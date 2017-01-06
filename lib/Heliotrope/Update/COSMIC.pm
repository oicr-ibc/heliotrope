package Heliotrope::Update::COSMIC;

## Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
##
## This program and the accompanying materials are made available under the terms of the GNU Public
## License v3.0. You should have received a copy of the GNU General Public License along with this
## program. If not, see <http://www.gnu.org/licenses/>.
##
## THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
## IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
## FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
## CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
## DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
## DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
## WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
## WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';
with 'Heliotrope::WorkingDatabase';
with 'Heliotrope::Update::COSMICAccess';

use boolean;
use HTTP::Request;
use HTTP::Cookies;
use HTML::TreeBuilder;
use URI::Escape::XS qw(decodeURIComponent encodeURIComponent);
use File::Slurp;
use File::Temp;
use File::Listing qw(parse_dir);
use DateTime;
use DateTime::Format::Natural;
use Carp;
use IO::File;
use IO::Uncompress::Gunzip;
use IO::CaptureOutput qw(capture);
use Clone qw(clone);
use Storable;
use List::MoreUtils qw(all);
use Net::SFTP;
use IO::Compress::Gzip qw(gzip $GzipError);

use Heliotrope::Logging qw(get_logger);
use Heliotrope::Config;
use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);
use Heliotrope::Utilities qw(convert_sequence convert_names_to_codes convert_codes_to_names);
use Heliotrope::ReferenceSequenceEngine;
use Heliotrope::AnnotationEngine;
use Vcf;

my $log = get_logger();

sub BUILD {
    my ($self) = @_;
    $self->{name} = "cosmic";
}

sub maybe_update {
    
    my ($self, $registry, %options) = @_;

    my ($req, $result, $file);

    my $cached_data = $self->get_data($registry);
    
    #J These lines seems a bit cryptic
    my $existing = $self->get_target_file($registry, "CosmicCompleteExport.tsv.gz");
    
    if (! -e $existing) {
        $cached_data = {};
    }

    ## COSMIC now requires authentication, so we need a cookie jar.
    my $ua = $self->user_agent();
    
    my $config = Heliotrope::Config::get_config();

    #$self->login($registry);
    #my $version_string;
    #my $version_date;  
    #my ($version_string, $version_date) = $self->get_cosmic_version_date($registry);
    
    #if (exists($cached_data->{date}) && $cached_data->{date} ge $version_date) {
    #    $log->info("Existing file is new; skipping update");
    #    return;
    #}
    
    # COSMIC now stores their data on an SFTP server. Authentication can now happen through Net::SFTP::Foreign 
    $DB::single = 1;
    use Net::SFTP::Foreign;
    my $host = "sftp-cancer.sanger.ac.uk";
    my %args = (
    "user"     => "jcook04\@uoguelph.ca",
    "password" => "H34rth1ng",
    "port"     => "22" ) ;

    my $version_url = "http://cancer.sanger.ac.uk/cosmic";
    my $HTML = HTML::TreeBuilder->new_from_url($version_url);
    my $string_HTML = $HTML->as_HTML;
    $string_HTML =~ m/COSMIC\s([a-zA-z0-9]{3})/;
    my $version = $1;
  
    my $sftp = Net::SFTP::Foreign->new($host, %args);

    $log->infof("Downloading CosmicCompleteTargetedScreensMutantExport.tsv.gz");
    my $remote = "/files/grch38/cosmic/$version/CosmicCompleteTargetedScreensMutantExport.tsv.gz";
    my $locale = "../../../../.heliotrope/cosmic/CosmicCompleteTargetedScreensMutantExport.tsv.gz";
    $sftp->get($remote, $locale) or die "No TargetedScreens\n";

    $log->infof("Downloading CosmicCompleteGenomeScreensMutantExport.tsv.gz");
    $remote = "/files/grch38/cosmic/$version/CosmicGenomeScreensMutantExport.tsv.gz";
    $locale = "../../../../.heliotrope/cosmic/CosmicGenomeScreensMutantExport.tsv.gz";
    $sftp->get($remote, $locale) or die "No GenomeScreens\n";

    $log->infof("Downloading CosmicCodingMuts.vcf.gz");
    $remote = "/files/grch38/cosmic/$version/VCF/CosmicCodingMuts.vcf.gz";
    $locale = "../../../../.heliotrope/cosmic/CosmicCodingMuts.vcf.gz";
    $sftp->get($remote, $locale) or die "No CodingMuts\n";
    
   
  # To recreate CosmicCompleteExport.tsv.gz, we need to concatenate GenomeScreens and TargetedScreens. 
  # The files are structured the same except for the addition of the Resistance column at Col 26,
  # meaning we need to add this column into GenomeScreens and populate each line with 'null' before
  # joining the files together.

  my $file_genome = $self->get_target_file($registry, "CosmicGenomeScreensMutantExport.tsv.gz");
  my $file_targeted = $self->get_target_file($registry, "CosmicCompleteTargetedScreensMutantExport.tsv.gz");
  my $fh_genome = IO::Uncompress::Gunzip->new($file_genome) or croak("Can't open $file_genome: $!");
  my $fh_targeted = IO::Uncompress::Gunzip->new($file_targeted) or croack ("Can't open $file_targeted: $!");

  my $headers_genome = <$fh_genome>;
  my $headers_targeted = <$fh_targeted>;

  # Adding Resistance column to GenomeScreens.tsv file
  # Splice seemed like the best function choice for the addition of a column. 
  $log->infof("Adding 'null' Resistance column to CosmicGenomeScreensMutantExport.tsv.gz");
  my @genome_screens;
  my $count = 0;
  while (<$fh_genome>) {
        my @splitarray = split ("\t", $_);
        splice @splitarray, 26, 0, 'null';
        my $string = join("\t", @splitarray);
        push @genome_screens, $string;
        $count++;
        if (($count % 1000000) == 0) { $log->infof("$count lines processed"); }
 }
  $log->infof("Completed");

  # Replacing '-' with 'null' in TargetedScreens.tsv file
  $log->infof("Replacing '-' with 'null' in CosmicCompleteTargetedScreensMutantExport.tsv.gz");
  my @targeted_screens;
  while (<$fh_targeted>){
        my @splitarray = split ("\t", $_);
        if ($splitarray[26] eq "-") {
                splice @splitarray, 26, 1, 'null';
        }
        my $string = join("\t", @splitarray);
        push @targeted_screens, $string;
 }
  $log->infof("Completed");

  # Joining modified TargetedScreens and GenomeScreens to recreate CosmicCompleteExport.tsv.gz

  unshift @genome_screens, $headers_targeted;
  push(@genome_screens, @targeted_screens);

  $log->infof("Creating CosmicCompleteExport.tsv.gz");
  my $filename = "CosmicCompleteExport.tsv";

  open (my $fh_body, '>', $filename) or die "Could not create $filename\n";
  my $line_count = 0;
  foreach my $element (@genome_screens) {
        print $fh_body "$element";
        $line_count++;
        if (($line_count % 1000000) == 0) { $log->infof("$line_count lines processed"); }
        }
 close $fh_body;

 # Compressing CompleteExport so that it fits nicely with previous code
 $log->infof("Compressing and Moving CosmicCompleteExport.tsv");
 my $file_complete = "CosmicCompleteExport.tsv";
 gzip $file_complete => "$file_complete.gz" or die "gzip failed: $GzipError\n";
 $self->relocate_file($registry, "CosmicCompleteExport.tsv.gz", "CosmicCompleteExport.tsv.gz");
 unlink $file_complete;
 $log->infof("Completed");


    #J variable graveyard
    my $export_url;
    my $export_file;
    my $vcf_file;
    my $version_date;
    my $version_string;
    #my $export_url = "sftp://sftp-cancer.sanger.ac.uk//files/grch38/cosmic/v79/CosmicCompleteTargetedScreensMutantExport.tsv.gz";
    #$log->infof("Downloading %s", $export_url);
    #$req = HTTP::Request->new(GET => $export_url);
    #my ($export_result, $export_file) = $self->get_resource($registry, $req);
    #$log->info("Download complete");
    
    
    #my $vcf_url = $base_url . "$version_string/VCF/CosmicCodingMuts.vcf.gz";
    #$log->infof("Downloading %s", $vcf_url);
    #$req = HTTP::Request->new(GET => $vcf_url);
    #my ($vcf_result, $vcf_file) = $self->get_resource($registry, $req);
    #$log->info("Download complete");

    # If the cache entry exists and says the file is older, or the cache entry
    # does not exist, we should continue to download the file.

    $cached_data->{date} = $version_date;
    $cached_data->{url} = $export_url;
    $cached_data->{download_time} = DateTime->now()->iso8601();
    $cached_data->{version} = $version_string;
    $self->set_data($registry, $cached_data);

    $self->relocate_file($registry, $export_file, "CosmicCompleteExport.tsv.gz");
    $self->relocate_file($registry, $vcf_file, "CosmicCodingMuts.vcf.gz");

    $self->update($registry);
}
sub update {
    
    my ($self, $registry) = @_;

    say "About to update.";
    $self->output($registry);
}

sub load_phase {
  my ($self, $registry) = @_;
 
  my $database = $self->open_database();

  # When loading, we ought to invert the var_allele for the -ve strand, as this
  # is needed to make the data consistent. This requires knowing, at this stage,
  # which strand is being used. That is nasty, but there appears to be no way
  # around this issue. Fortunately, at this stage, we can fairly quickly get this
  # information out of MongoDB.

  # Back to normal

  my $file_completed = $self->get_target_file($registry, "CosmicCompleteExport.tsv.gz");
  my $fh = IO::Uncompress::Gunzip->new($file_completed) or croak("Can't open $file_completed: $!");
  
  my $headers = <$fh>;
  chomp($headers);
  my @headers = map { $_ = lc($_); s{ }{_}gr; } split("\t", $headers, -1);

  state $warned = {};
  state $gene_records = {};
  my $line_number = 0;

  my $bulk = $database->get_collection('variantRecords')->initialize_ordered_bulk_op();

  while(my $line = <$fh>) {
    chomp($line);
    my $data = {};
    @{$data}{@headers} = split("\t", $line, -1);

    ## Various normalizations to handle possible field name changes
    $data->{accession} = delete $data->{accession_number};
    $data->{primary_hist} = delete $data->{primary_histology};
    $data->{hist_subtype} = delete $data->{histology_subtype_1}; # Added _1 
    $data->{pubmed} = delete $data->{pubmed_pmid};
    $data->{site_subtype} = delete $data->{site_subtype_1}; # Added this line to account for changed header
    ## Now continue to analyze the data
    $data->{primary_hist} = $data->{hist_subtype} if ($data->{primary_hist} eq "other");

    $data->{primary_site} =~ s{_}{ }g;
    $data->{site_subtype} =~ s{_}{ }g;
    $data->{primary_hist} =~ s{_}{ }g;
    $data->{hist_subtype} =~ s{_}{ }g;

    ## This hasn't been documented anywhere, yet it should be. This is a pattern that
    ## is used to filter out some of the non-cancer tumour types, so they aren't
    ## included in frequency estimates. Mostly they're they're benign or precancerous
    ## or explicit normal controls.

    if ($data->{primary_hist} =~ m{(?:\b(?:adenoma|normal|nevus|in\ssitu|polyp|keratosis|cyst|wart|mole|hamartoma|ameloblastoma|
                                   chondroma|chordoma|endometriosis|pterygium|leiomyoma|thrombosis|aberrant\scrypt\sfoci|
                                   crohn\sdisease|low\smalignant\spotential|barrett\soesophagus|spitzoid\stumour|keratoacanthoma|
                                   lentigo|ns)\b|
                               \berythro|
                               (?:plasia|itis)$)}xi) {
      $data->{mutation_id} = 0;
    }

    $data->{primary_site} = undef if ($data->{primary_site} eq 'NS');
    $data->{site_subtype} = undef if ($data->{site_subtype} eq 'NS');
    $data->{primary_hist} = undef if ($data->{primary_hist} eq 'NS');
    $data->{hist_subtype} = undef if ($data->{hist_subtype} eq 'NS');

    $data->{accession} =~ s{_v\d+}{};

    my $gene_record;
    if (exists($gene_records->{$data->{accession}})) {
      $gene_record = $gene_records->{$data->{accession}};
    } else {
      $gene_record = $database->get_collection('genes')->find_one({"sections.transcripts.data.records.id" => $data->{accession}});
      $gene_records->{$data->{accession}} = $gene_record;
    }
    if (! defined($gene_record)) {
      $log->warnf("%s %s: can't find gene for transcript: %, skipping", $data->{gene_name}, $data->{mutation_aa} // "null", $data->{accession}) unless ($warned->{$data->{accession}});
      $DB::single = 1 unless ($warned->{$data->{accession}});
      $warned->{$data->{accession}} = 1;
      next;
    }
    my $mutation_record;
    my $mutation_codon;
    my $mutation_name;
    if ($data->{mutation_id}) {
      my $cosmic_id = $data->{mutation_id}; #J Removed ""COSM"." - ID now contains it
      $mutation_record = $database->get_collection('variants')->find_one({"sections.identifiers.data.cosmic" => $cosmic_id});

      if (! defined($mutation_record) && $data->{mutation_cds} eq 'c.?' && $data->{mutation_aa} ne 'p.?') {
        my $real_gene_name = $gene_record->{name};
        my $variant = convert_codes_to_names($data->{mutation_aa});
        my $variant_name = "$real_gene_name $variant";
        $mutation_record = $database->get_collection('variants')->find_one({"name" => $variant_name});
      }

      if (defined($mutation_record)) {
        $mutation_codon = $mutation_record->{sections}->{positions}->{data}->[0]->{codonStart};
        $mutation_name = $mutation_record->{mutation};
      }

      $log->warnf("%s %s: can't find mutation: %s", $data->{gene_name}, $data->{mutation_aa} // "null", $cosmic_id) unless ($mutation_record);
    }

    my $record_query = {};
    my $record_update = {};
    $DB::single = 1 if ($data->{id_sample} =~ m{\D});
    $record_query->{geneId} = $gene_record->{_id};
    $record_query->{geneSymbol} = $gene_record->{name};
    $record_query->{sampleId} = int($data->{id_sample});
    $record_query->{mutationId} = $mutation_record && $mutation_record->{_id};  ## undef is important here
    $record_update->{pmid} = $data->{pubmed};
    $record_update->{primarySite} = $data->{primary_site};
    $record_update->{siteSubtype} = $data->{site_subtype};
    $record_update->{primaryHist} = $data->{primary_hist};
    $record_update->{histSubtype} = $data->{hist_subtype};
    $record_update->{mutationCodon} = $mutation_codon && int($mutation_codon);
    $record_update->{mutationName} = $mutation_name;
    $bulk->find($record_query)->upsert()->update({'$set' => $record_update});

    $line_number++;
    if (($line_number % 10000) == 0) {
      my $result = $bulk->execute();
      $log->infof("Processed %d lines, updated %d records", $line_number, $result->{nModified});
      $bulk = $database->get_collection('variantRecords')->initialize_ordered_bulk_op();
    }
  }

  my $result = $bulk->execute();
  $log->infof("Processed %d lines, updated %d records", $line_number, $result->{nModified});
  $fh->close();
}

sub _get_consequence_data_schema {
  my ($self, $vcf, $field) = @_;
  if (! exists($self->{_fields})) {
    my $field_schema = $vcf->get_header_line(key=>'INFO', ID=>'CSQ');
    my ($field_schema_fields) = ($field_schema->[0]->{Description} =~ m{Format: ((?:\w+\|)*\w+)$});
    $self->{_fields} = [ split('\|', $field_schema_fields) ];
  }
  return $self->{_fields};
}

my $duplicates = {};

sub _handle_annotations {
  my ($self, $fh, $database) = @_;
  
  my $vcf = Vcf->new(fh => $fh);
  $vcf->parse_header();
  my @fields = qw(chrom pos id ref alt qual filter info);

  my $vcf_data = {};
  my $line_number = 0;
  while(my $line = $vcf->next_data_array()) {
    @$vcf_data{@fields} = @$line;

    ## To calculate the start and stop, we might have a common prefix in the reference and alt, and we
    ## need to factor this into the start and stop positioning.

    my $ref_length = length($vcf_data->{ref});
    my $alt_length = length($vcf_data->{alt});
    my $prefix = ($ref_length < $alt_length) ? $ref_length : $alt_length;
    if (substr($vcf_data->{ref}, 0, $prefix) eq substr($vcf_data->{alt}, 0, $prefix)) {
      $vcf_data->{ref} = substr($vcf_data->{ref}, $prefix);
      $vcf_data->{alt} = substr($vcf_data->{alt}, $prefix);
      $vcf_data->{pos} += $prefix;
    }

    ## We have bad VCF data in some cases, with a chromosome looking like: xxx:11 rather than 11.
    $vcf_data->{chrom} =~ s{^(\d+\:)}{};

    ## Now let's look to see if we have already handled this variant. If so, make sure this identifier
    ## is added but otherwise skip out. Use an update for this, and look to see if we have updated
    ## anything.

    my $csq_fields = $self->_get_consequence_data_schema($vcf);
    my $csq_values = $vcf->get_info_field($vcf_data->{info}, 'CSQ');
    my $gene_symbol = $vcf->get_info_field($vcf_data->{info}, 'GENE');
    foreach my $csq_value (split(',', $csq_values)) {
      my $csq_data = {};
      $csq_data->{_geneSymbol} = $gene_symbol;
      @$csq_data{@$csq_fields} = (map { decodeURIComponent($_); } split('\|', $csq_value, -1));
      $self->_handle_canonical_annotation($csq_data, $vcf_data, $line, $database) if ($csq_data->{CANONICAL} eq 'YES');
    }

    $line_number++;
    $log->infof("Processed %d lines", $line_number) if (($line_number % 10000) == 0);
  }
}

sub _handle_canonical_annotation {
  my ($self, $csq_data, $vcf_data, $line, $database) = @_;

  state $gene_cache = {};

  my $consequence = $csq_data->{Consequence};
  return if ($consequence eq 'downstream_gene_variant' ||
             $consequence eq 'upstream_gene_variant' ||
             $consequence eq 'intron_variant' ||
             $consequence =~ m{\bnc_transcript_variant\b});

  my $gene = $csq_data->{Gene};
  $csq_data->{HGVSporiginal} = $csq_data->{HGVSp}, $csq_data->{HGVSp} =~ s{^ENS[^:]+}{$gene} if (exists($csq_data->{HGVSp}));
  $csq_data->{HGVScoriginal} = $csq_data->{HGVSc}, $csq_data->{HGVSc} =~ s{^ENS[^:]+}{$gene} if (exists($csq_data->{HGVSc}));

  # Synonymous variants from VEP are coded oddly. We restore them to a more sensible format.
  if ($consequence =~ m{\bsynonymous_variant\b}) {
    if (exists($csq_data->{HGVSp}) && $csq_data->{HGVSp} =~ m{^ENS[^:]+:[^\(]+\(p\.=\)$}) {
      my $amino = convert_codes_to_names($csq_data->{Amino_acids});
      my $protein_position = $csq_data->{Protein_position};
      my $variant = "p.".$amino.$protein_position.$amino;
      $csq_data->{HGVSp} = $gene.":".$variant;
    }
  }

 #J HGVSfallback is no longer included in CSQ
  if ($consequence =~ m{\btranscript_ablation\b} || ($consequence =~ m{\b5_prime_UTR_variant\b} && $consequence =~ m{\bfeature_truncation\b})) {
    $csq_data->{HGVSfallback} = 'p.0';
  } elsif (($consequence =~ m{\b3_prime_UTR_variant\b} && $consequence =~ m{\bfeature_truncation\b})) {
    $csq_data->{HGVSfallback} = 'p.?';
  }


  # There are several possibilities here.
  #
  # 1. We find a variant by identical genomic coordinates, reference and variant, same COSMIC identifier
  # 2. We find a variant by identical genomic coordinates, reference and variant, different COSMIC identifier
  # 3. We find a variant by identical name, i.e., gene and variant, same COSMIC identifier
  # 4. We find a variant by identical name, i.e., gene and variant, different COSMIC identifier
  #
  # In an ideal world, we'd handle these differently, for performance.

  my $collection = 'variants';
  my $position_query = {
    'chromosome' => "$vcf_data->{chrom}",
    'position' => int($vcf_data->{pos}),
    'referenceAllele' => "$vcf_data->{ref}",
    'variantAllele' => "$vcf_data->{alt}"
  };

  # Current source of bottleneck is the following index. Commented out to improve speed but not able to accept site duplicate entries

  #my $existing = $self->find_one_record($database, $collection, {'sections.positions.data' => {'$elemMatch' => $position_query}});
  my $existing;
  ## This merely tells is whether there is an existing variant which is genomically identical. If there is, we should make sure
  ## the COSMIC identifier is present and then quit. if not, we need to add it to the existing variant by name. This leaves us
  ## with an interesting question: if we have multiple genomic variants which are the same at the variant name level but genomically
  ## different, how do we merge different clinical significances? Let's gloss over that for now.

  if (defined($existing)) {
    my $bulk = $database->get_collection($collection)->initialize_ordered_bulk_op();
    $bulk->find({'_id' => $existing->{'_id'}})->update_one({'$addToSet' => {'sections.identifiers.data.cosmic' => $vcf_data->{id}}});
    my $result = $bulk->execute();
    # if ($result->{nModified} > 0) {
    #   $log->warnf("Added COSMIC identifier %s to %s", $vcf_data->{id}, $existing->{name});
    # }
    return;
  }

  my $position = {};
  my $annotation = {};

  ## Now start to populate the annotation and significance fields.

  my ($exon) = ($csq_data->{EXON} =~ m{^(\d+)}) if (exists($csq_data->{EXON}));
  $position->{exon} = int($exon) if (defined($exon));

  $position->{chromosome} = "$vcf_data->{chrom}";
  $position->{gene} = "$csq_data->{Gene}";
  $position->{transcript} = "$csq_data->{Feature}" if ($csq_data->{Feature_type} eq 'Transcript');
  $position->{strand} = int($csq_data->{STRAND}) if (exists($csq_data->{STRAND}));
  if (exists($csq_data->{CDS_position}) && $csq_data->{CDS_position} =~ m{^(\d+)(?:-(\d+))?$}) {
    $position->{cdsPositionStart} = int($1);
    $position->{cdsPositionStop} = int($2 // $1);
  }
  if (exists($csq_data->{Protein_position}) && $csq_data->{Protein_position} =~ m{^(\d+)(?:-(\d+))?$}) {
    $position->{codonStart} = int($1);
    $position->{codonStop} = int($2 // $1);
  }

  $position->{position} = int($vcf_data->{pos});
  $position->{genomicPositionStart} = int($vcf_data->{pos});
  $position->{referenceAllele} = $vcf_data->{ref};
  $position->{variantAllele} = $vcf_data->{alt};

  ($position->{HGVSc}) = ($csq_data->{HGVSc} =~ m{^\w+:(.*)}) if (exists($csq_data->{HGVSc}));
  ($position->{HGVSp}) = ($csq_data->{HGVSp} =~ m{^\w+:(.*)}) if (exists($csq_data->{HGVSp}));
  $position->{HGVSpr} = convert_names_to_codes($position->{HGVSp}) if (exists($position->{HGVSp}));

  $annotation->{consequence} = $csq_data->{Consequence} if ($csq_data->{Consequence});
  $annotation->{significance} = $csq_data->{CLIN_SIG} if ($csq_data->{CLIN_SIG});
  if ($csq_data->{SIFT}) {
    my ($level, $score) = ($csq_data->{SIFT} =~ m{(\w+)\(([0-9\.]+)\)});
    $annotation->{sift} = {level => $level, score => (0.0 + $score)};
  }
  if ($csq_data->{PolyPhen}) {
    my ($level, $score) = ($csq_data->{PolyPhen} =~ m{(\w+)\(([0-9\.]+)\)});
    $annotation->{polyphen} = {level => $level, score => (0.0 + $score)};
  }

  my $variant = $csq_data->{HGVSp} || $csq_data->{HGVSc};
  my (undef, $variant_name) = split(":", $variant, 2);
  if (! $variant_name) {
    $DB::single = 1;
    $log->warnf("Failed to process variant: no HGVS name found: %s", $variant);
    return;
  }

  my $gene_id = "$csq_data->{Gene}";
  my $existing_gene;
  if (exists($gene_cache->{$gene_id})) {
    $existing_gene = $gene_cache->{$gene_id};
  } else {
    $existing_gene = $self->find_one_record($database, 'genes', {id => "$csq_data->{Gene}"}, {'name' => 1, '_id' => 1});
    $gene_cache->{$gene_id} = $existing_gene;
  }
  if (! defined($existing_gene)) {
    $log->warnf("Failed to find gene: %s - skipping", "$csq_data->{Gene}");
    return;
  }

  my $gene_symbol = $existing_gene->{name};
  $existing = $self->find_one_record($database, $collection, {'name' => "$gene_symbol $variant_name"});

  # Again, if we find an existing variant, we are adding a new position or merging an annotation. We
  # know by now that we don't have an existing positional exact match, so now we can build a change to
  # apply via an upsert against the name.

  ## Now we can look for an existing record...
  $existing = {} unless (defined($existing));
  $existing->{version} = 1 unless (exists($existing->{version}));
  $existing->{type} = 'variant' unless (exists($existing->{type}));
  $existing->{variantType} = 'mutation' unless (exists($existing->{variantType}));
  $existing->{geneId} = "$csq_data->{Gene}" unless (exists($existing->{geneId}));
  $position->{geneSymbol} = "$existing_gene->{name}";

  $existing->{references} = [] unless (exists($existing->{references}));
  if (! exists($existing->{sections})) {
    my $sections = {};
    $sections->{positions} = {data => []};
    $sections->{identifiers} = {data => {cosmic => ["$vcf_data->{id}"]}};
    $existing->{sections} = $sections;
  } else {
    my $identifiers = $existing->{sections}->{identifiers}->{data}->{cosmic};
    if (! grep { $_ eq "$vcf_data->{id}" } @$identifiers) {
      push @$identifiers, "$vcf_data->{id}";
    }
  }

  $existing->{mutation} = $variant_name unless (exists($existing->{mutation}));
  $existing->{shortMutation} = convert_names_to_codes($existing->{mutation}) unless (exists($existing->{shortMutation}));
  $existing->{gene} = $gene_symbol unless (exists($existing->{gene}));
  $existing->{name} = "$existing->{gene} $existing->{mutation}" unless (exists($existing->{name}));
  $existing->{shortName} = "$existing->{gene} $existing->{shortMutation}" unless (exists($existing->{shortName}));

  # genesRidx doesnt appear to exist anymore
  if (! exists($existing->{genesRidx})) {
    $existing->{genesRidx} = $#{$existing->{references}} + 1;
    push @{$existing->{references}}, {ref => "genes", name => $existing_gene->{name}, _id => $existing_gene->{_id}};
  }

  # We could use resolving here, but we don't ever need to do. So don't unpack and repack for comparison.
  my $alert = $self->{_alert};
  my $new = clone($existing);
  $new->{sections}->{annotation} = {_format => "positions", @$alert, data => $annotation};
  if (exists($new->{sections}->{positions})) {
    my $positions_data = $new->{sections}->{positions}->{data};
    my $found = grep { my $this = $_; all { $position_query->{$_} eq $this->{$_} } keys %$position_query; } @$positions_data;
    if (! $found) {
      push @{$new->{sections}->{positions}->{data}}, $position;
    }
  }

  if (! deep_eq($new, $existing)) {
    $DB::single = 1;
    $self->save_record($database, $collection, $new);
  }

  return;
}

## When we have all the variants recorded from the VCF file, we can then go through the variants in the
## main record data file. This is actually going to be a bulk loading model, for performance, so let's
## deal with that that way.

sub annotate_phase {
    my ($self, $registry) = @_;

    my $database = $self->open_database();

    my $out_vcf_filename = $self->get_target_file($registry, "CosmicCodingMuts.vcf.gz");
    my $engine = Heliotrope::AnnotationEngine->new({annotation_filename => $out_vcf_filename});
    $engine->get_annotations(sub {
      my ($fh, $this) = @_;
      $this->_handle_annotations($fh, $database);
    }, $self);
}

sub output {
    my ($self, $registry, $table, $distribution_table) = @_;

    my @alert = (
      _alerts => [{
        level => "note",
        author => "cosmic",
        text => "This information has been updated in COSMIC",
        date => DateTime->now()
      }]
    );
    $self->{_alert} = \@alert;

#    annotate_phase($self, $registry);
    load_phase($self, $registry);
}

1;
