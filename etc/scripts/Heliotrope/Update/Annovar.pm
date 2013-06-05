package Heliotrope::Update::Annovar;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use boolean;
use File::Slurp;
use File::Temp;
use DateTime;
use Carp;
use IO::File;
use MongoDB;
use IO::Uncompress::Gunzip;
use IO::CaptureOutput qw(capture);
use Parallel::ForkManager;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

sub BUILD {
    my ($self) = @_;
    $self->{name} = "annovar";
}

sub maybe_update {
    my ($self, $registry, %options) = @_;
    
    # The simple check is a MongoDB assessment, to see if we can find any data that
    # needs to be handled. If not, we can stop.
    
    my $database = $self->open_database();
    
    $database->variants->ensure_index(Tie::IxHash->new("_pendingVerification" => 1), { unique => false, safe => true });
    
    my $count = $database->variants->query({_pendingVerification => boolean::true})->count();
    return if ($count == 0);
    $self->close_database($database);
    
    say "Need to update $count variants.";
    
    $self->update($registry);
}

sub update {
	my ($self, $registry) = @_;
    $self->output($registry);
}

sub output {
	my ($self, $registry) = @_;
	
    say "Connecting to MongoDB.";
    my $database = $self->open_database();

    my $var_fh = File::Temp->new(UNLINK => 0);
    my $var_filename = $var_fh->filename();
    say "Building annotation file: $var_filename.";
    
    my $cursor = $database->variants->
                    query({_pendingVerification => boolean::true})->
                    sort(Tie::IxHash->new(chromosome => 1, start => 1))->
                    fields({chromosome => 1, start => 1, stop => 1, variantAllele => 1, name => 1});
    while (my $object = $cursor->next()) {
    	my $comment = "id:$object->{_id};name:$object->{name}";
    	say $var_fh join("\t", $object->{chromosome}, $object->{start}, $object->{stop}, 0, $object->{variantAllele} || '-', $comment);
    };
    $var_fh->close();
    $self->close_database($database);
    
    say "Starting annotations. We recommend a long coffee break at this point.";
    # Let's do up to six Annovars at a time
    
    my @commands = (
        [qw(--dbtype ensgene --geneanno --hgvs)],
        [qw(--filter --dbtype avsift)],
        [qw(--filter --dbtype ljb_sift)],
        [qw(--filter --dbtype ljb_pp2)],
        [qw(--filter --dbtype ljb_mt)],
        [qw(--filter --dbtype ljb_lrt)],
        [qw(--filter --dbtype snp132)],
    );
    
    my $pm = new Parallel::ForkManager(10); 
    
    foreach my $command (@commands) {
        $pm->start and next; # do the fork

        say "Running Annovar: ".join(" ", @$command);
        run_annovar_with_options($var_filename, @$command);
        $pm->finish; # do the exit in the child process
    }
    $pm->wait_all_children;
    
    say "Done running Annovar.";
    $self->analyze_results($registry, $var_filename);
}

sub analyze_results {
	my ($self, $registry, $base) = @_;
		
	my $score_table = build_score_table($base);
	
	say "Connecting to MongoDB.";
    my $database = $self->open_database();
    
    my $canonical_transcripts = {};
    
    # Fast LRU cache for 10 genes, one which doesn't serialize but uses direct references.
    my $gene_cache = CHI->new(driver => 'RawMemory', global => 1, max_size => 10);
	
	my $target = "${base}.exonic_variant_function";
	open(my $fh, "<", $target) or die("Can't open $target: $!");
	
	my @alert = (
        _alerts => [{
            level => "note", 
            author => "annovar",
            text => "This information has been updated from Annovar",
            date => DateTime->now()
        }],
    );
	
    while(my $line = <$fh>) {
        chomp($line);
        my (undef, $type, $codings, undef, undef, undef, undef, undef, $comments) = split("\t", $line);
        
        my ($identifier) = ($comments =~ m{id:([[:xdigit:]]+)});
        if (! $identifier) {
        	croak("Internal error: failed to find identifier in $comments");
        }

        my $position_data = {};
        my $significance_data = {};
        
        foreach my $coding (split(",", $codings)) {
        	my ($gene_stable_id, $transcript_stable_id, $exon, $cds_variant, $aa_variant) = split(":", $coding);
        	
        	next if ($gene_stable_id eq 'UNKNOWN');
        	next if ($exon eq 'wholegene');
        	
        	# Do a little caching for performance. 
        	my $gene_record = $gene_cache->get($gene_stable_id);
        	if (! defined($gene_record)) {
        	   $gene_record = $database->genes->find_one({"id" => $gene_stable_id});
        	   $gene_cache->set($gene_stable_id, $gene_record) if (defined($gene_record));
        	}
        	if (! defined($gene_record)) {
        		say STDERR "Can't find gene: $gene_stable_id; ignoring records -- this ought not to happen";
        		next;
        	}
        	
        	# Now we have a gene record, we can locate the transcript, and determine whether 
        	# or not it is the canonical transcript, in which case we have look at the canonical
        	# cDNA and AA mutation values. 
        	
        	# Yes, this really is the path
        	my $canonical_transcript_id = $gene_record->{sections}->{transcripts}->{data}->{records}->[0]->{id};
        	
        	# This is a little laborious because we potentially can have the same mutation
        	# given separate gene identifiers by Annovar. How we handle that is anyone's guess. For
        	# sanity, choose the first listed by Annovar.
        	
        	# Skip if we don't have any canonical transcript, which happens when we have no transcripts,
        	# as under these conditions we can't really say much about the mutation. 
        	
        	next if (! defined($canonical_transcript_id));
        	
        	if ($transcript_stable_id eq $canonical_transcript_id) {
        		
        		# Here we have a semi-canonical $exon, $cdna_variant, and $aa_variant - these probably 
        		# deserve a little cleaning, as Annovar doesn't completely meet the HGVS nomenclature
        		# described at: http://www.hgvs.org/mutnomen/ -- even when the HGVS key is set. 
        		
        		# Add in delins where required - normally Annovar writes e.g., c.2194_2196AGC
        		# where strictly that should be c.2194_2196delinsAGC. 
        		
        		$cds_variant =~ s{(c\.\d+_\d+)([[:upper:]]+)}{${1}delins${2}};
        		
        		my ($exon_number) = ($exon =~ m{exon(\d+)});
                $position_data->{type} = $type;
        		$position_data->{exon} = int($exon_number);
                $position_data->{mutationDNA} = $cds_variant;
                $position_data->{mutationAminoAcid} = $aa_variant if ($aa_variant);
                $position_data->{geneId} = $gene_stable_id;
                
                # Now for some dirty work. We can get the positioning from the CDS mutation
                # positioning information. These are what we need to position a variant against
                # the domain information, which is based on codon positions for the canonical
                # transcript. We specify that to be clear. 
                
                if ($cds_variant =~ m{^c\.(\d+)(?:_(\d+))?}) {
                	$position_data->{startCodon} = int(($1 + 2)/ 3);
                    $position_data->{endCodon} = int((($2 || $1) + 2)/ 3);
                    $position_data->{referenceTranscriptId} = $transcript_stable_id;
                }
        	}
        }
        
        # This done, we can also attach the significance data from the table that we have now
        # built. This is fairly simple, although we also add a little interpretation of some of
        # the values. This is based on http://www.ncbi.nlm.nih.gov/pubmed?term=21520341.
        
        my $scores = $score_table->{$identifier};
        @{$significance_data}{keys %$scores} = values %$scores;
        
        # Interpretation requires care. SIFT and Polyphen2 both define boundary values, and we
        # can make those annotations. LRT and MT are probabilistic, and LRT is only a measure
        # of constrainedness anyway. 
        
        $scores->{avsiftInterpretation} = ($scores->{avsift} <= 0.05) ? 'damaging' : 'tolerated' if (exists($scores->{avsift}));
        $scores->{ljb_siftInterpretation} = ($scores->{ljb_sift} >= 0.95) ? 'damaging' : 'tolerated' if (exists($scores->{ljb_sift}));
        $scores->{ljb_pp2Interpretation} = ($scores->{ljb_pp2} >= 0.85) ? 'damaging' : 
                                           ($scores->{ljb_pp2} >= 0.15) ? 'possibly damaging' : 'benign' if (exists($scores->{ljb_pp2}));
        
        
        my $blocks = {};
        $blocks->{positions} = $position_data;
        $blocks->{significance} = $scores;
        
        # Now we can find the variant. Based on the identifier.
        my $search = {"_id" => MongoDB::OID->new(value => $identifier)};
        my $existing = $database->variants->find_one($search);
        carp("Internal error: failed to find variant id: $identifier") unless ($existing);
        
        my $changes = {};
        $changes->{'$set'}->{version} = $existing->{version} + 1;
        my $write = 0;
        
        foreach my $block (keys %$blocks) {
            my $existing_block = $existing->{sections}->{$block}->{data};
            my $new_block = $blocks->{$block};
            if (! deep_eq($existing_block, $new_block)) {
                $changes->{'$set'}->{"sections.$block"} = {
                    @alert,
                    _format => $block,
                    data => $new_block
                };
                $write++;
            }
        }
        
        if ($write) {
            $database->variants->update($search, $changes, {upsert => 0, multiple => 0});
        }
        
        # We have several sets of info to set now. We can, for example, locate the gene, properly
        # in the event that it was wrong before. We are also able to select the canonical transcript
        # for the gene, which means we can be more careful about positioning information. 
    }
    close($fh);
    
    $self->close_database($database);
}

sub build_score_table {
	my ($filename) = @_;
	
	my $table = {};
	my @files = qw(avsift ljb_sift ljb_pp2 ljb_mt ljb_lrt snp132);
	foreach my $file (@files) {
		my $target = "${filename}.*_${file}_dropped";
		my ($located) = glob($target);
		
		say "Reading $file scores from: $located.";
		open(my $fh, "<", $located) or die("Can't open $located: $!");
		while(my $line = <$fh>) {
			chomp($line);
			my ($tag, $score, undef, undef, undef, undef, undef, $comments) = split("\t", $line);
			
			if (my ($identifier) = ($comments =~ m{id:([[:xdigit:]]+)})) {
				$table->{$identifier}->{$tag} = $score;
			} else {
				croak("Internal error: failed to find identifier in $comments");
			}
		}
		close($fh);
	}
	
	return $table;
}

sub run_annovar_with_options {
	my ($var_filename, @options) = @_;
	
	my $annovar_dir = "/Users/swatt/annovar";
    my $executable = $^X;
    my $command = ["$annovar_dir/annotate_variation.pl", 
                   $var_filename, 
                   @options,
                   qw(--buildver hg19),
                   "$annovar_dir/humandb/"];
    
    # We could probably dispense with some of this. 
    my $stdout;
    my $stderr;
    my $status;
    capture {
        system($executable, @$command);
        $status = $?;
    } \$stdout, \$stderr;
    $status == 0 || croak("ANNOVAR failed: exit status: $status; output: $stdout; error: $stderr");
}

1;