package Heliotrope::Update::COSMIC;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';
with 'Heliotrope::WorkingDatabase';

use boolean;
use HTTP::Request;
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

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);
use Heliotrope::Utilities qw(convert_sequence convert_names_to_codes);
use Heliotrope::ReferenceSequenceEngine;
use Heliotrope::AnnotationEngine;

sub BUILD {
    my ($self) = @_;
    $self->{name} = "cosmic";
}

sub maybe_update {
    my ($self, $registry, %options) = @_;
    
    my ($req, $result, $file);

    my $base_url = "ftp://ftp.sanger.ac.uk/pub/CGP/cosmic/data_export/";
    $req = HTTP::Request->new(GET => $base_url);
    $req->header(Accept => "text/ftp-dir-listing, */*;q=0.1"); 
    ($result, $file) = $self->get_resource($registry, $req);
    my $listing = read_file($file);

    my @records = parse_dir($listing);
    my ($cosmic) = grep { $_->[0] =~ m{^CosmicCompleteExport_v} } @records;
    
    my $dt = DateTime->from_epoch(epoch => $cosmic->[3]);
    my $normalized_date = $dt->format_cldr("yyyy-MM-dd");
    say "Normalized: $normalized_date.";

    # In COSMIC, we can use the file name as an indication of the date
    # and the version, as it is all encoded there. 
    
    my ($release) = ($listing =~ m{CosmicCompleteExport_v(\d+)}sp);
    if (! $release) {
        croak("Failed to find CosmicCompleteExport file");
    }
    my $filename = $cosmic->[0];
    
    my $cached_data = $self->get_data($registry);
    my $existing = $self->get_target_file($registry, "CosmicCompleteExport.tsv.gz");
    
    if (! -e $existing) {
        $cached_data = {};
    }
    
    # If the cache entry exists and says the file is older, or the cache entry
    # does not exist, we should continue to download the file. 
    
    if (exists($cached_data->{date}) && $cached_data->{date} ge $normalized_date) {
        say "Existing file is new.";
        say "Skipping update.";
        return;
    }

    my $cosmic_url = $base_url . $filename;
    say "Downloading $cosmic_url.";
    $req = HTTP::Request->new(GET => $cosmic_url);
    ($result, $file) = $self->get_resource($registry, $req);
    say "Download complete.";

    # Now we can store the data file in the right place and update the cache       
    $cached_data->{date} = $normalized_date;
    $cached_data->{url} = $cosmic_url;
    $cached_data->{download_time} = DateTime->now()->iso8601();
    $cached_data->{version} = $release;
    $self->relocate_file($registry, $file, "CosmicCompleteExport.tsv.gz");
    $self->set_data($registry, $cached_data);
    
    $self->update($registry);
}

sub update {
    my ($self, $registry) = @_;

    say "About to update.";
    
    my $dbh = $self->open_working_database($registry);
    
    load_phase($self, $registry, $dbh);
    create_indexes_phase($self, $registry, $dbh);
    reference_allele_phase($self, $registry, $dbh);
    my $table = annotate_phase($self, $registry, $dbh);
    duplicates_phase($self, $registry, $dbh);
    label_phase($self, $registry, $dbh);
    frequencies_phase($self, $registry, $dbh);
    my $distribution_table = frequency_distribution_phase($self, $registry, $dbh);
    
    $self->close_working_database();

    $self->output($registry, $table, $distribution_table);
}

sub load_phase {
    my ($self, $registry, $dbh) = @_;
    
    # When loading, we ought to invert the var_allele for the -ve strand, as this
    # is needed to make the data consistent. This requires knowing, at this stage,
    # which strand is being used. That is nasty, but there appears to be no way
    # around this issue. Fortunately, at this stage, we can fairly quickly get this
    # information out of MongoDB. 
    
    my $file = $self->get_target_file($registry, "CosmicCompleteExport.tsv.gz");
    
    $self->execute_sql(<<__ENDSQL__);
DROP TABLE IF EXISTS mutations
__ENDSQL__
    
    $self->execute_sql( <<__ENDSQL__);
CREATE TABLE mutations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sample_name VARCHAR(40) NOT NULL,
  id_sample INTEGER,
  id_tumour INTEGER,
  primary_site VARCHAR(100) NOT NULL,
  site_subtype VARCHAR(250),
  primary_hist VARCHAR(150),
  hist_subtype VARCHAR(255),
  genome_wide_screen INTEGER,
  gene_name VARCHAR(40),
  accession VARCHAR(30),
  hgnc CHAR(30),
  mutation_id INTEGER,
  mutation_cds VARCHAR(180),
  mutation_aa VARCHAR(80),
  mutation_description VARCHAR(255),
  mutation_zygosity VARCHAR(30),
  ncbi36_position VARCHAR(30),
  ncbi36_strand CHAR(1),
  grch37_position VARCHAR(30),
  grch37_strand CHAR(1),
  somatic_status VARCHAR(50),
  pubmed CHAR(20),
  sample_source VARCHAR(20),
  tumour_origin VARCHAR(50),
  chromosome CHAR(2),
  start INTEGER,
  stop INTEGER,
  ref_allele VARCHAR(64),
  var_allele VARCHAR(64),
  canonical_gene_id VARCHAR(40),
  canonical_mutation VARCHAR(255),
  canonical_mutation_type VARCHAR(64),
  canonical_cds_mutation VARCHAR(255),
  canonical_codon INTEGER
)
__ENDSQL__

    my $insert_statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
INSERT INTO mutations (gene_name, accession, hgnc, sample_name, id_sample, id_tumour, primary_site, site_subtype, primary_hist, hist_subtype, 
    genome_wide_screen, 
    mutation_id, 
    mutation_cds, mutation_aa, 
    mutation_description, mutation_zygosity, 
    grch37_position, grch37_strand, 
    somatic_status, pubmed, 
    sample_source, tumour_origin, chromosome, start, stop, ref_allele, var_allele)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
__ENDSQL__

    say STDERR "Loading data.";
    $dbh->begin_work();
    
    my $fh = IO::Uncompress::Gunzip->new($file) or croak("Can't open $file: $!");
    my $headers = <$fh>;
    while(my $line = <$fh>) {
        chomp($line);
        my ($gene_name, $accession, $hgnc, $sample_name, $id_sample, $id_tumour, $primary_site, $site_subtype, $primary_hist, $hist_subtype, 
            $genome_wide_screen, $mutation_id, $mutation_cds, $mutation_aa, $mutation_description, $mutation_zygosity, undef, undef, 
            $grch37_position, $grch37_strand, $somatic_status, $pubmed, $sample_source, $tumour_origin, undef) = split("\t", $line);
        my ($chromosome, $start, $stop, $var_allele, $ref_allele);
        $mutation_id ||= 0;
        $mutation_id = 0 if ($mutation_aa eq '' && $mutation_id != 0);
        $genome_wide_screen = ($genome_wide_screen eq 'y') ? 1 : 0;
        $mutation_aa = 'p.?' if ($mutation_aa =~ m/^p\.unknown/);
        $primary_hist = $hist_subtype if ($primary_hist eq "other");
        
        # Yes, COSMIC internally uses chromosome numbers 23 and 24 for X and Y. We don't like that. Actually,
        # nor does COSMIC really - this is displayed as X and Y on the web site. And now added 25 => MT, as
        # there are about four of those in COSMIC too. 
        $grch37_position =~ s{^23:}{X:};
        $grch37_position =~ s{^24:}{Y:};
        $grch37_position =~ s{^25:}{MT:};

        # We could do more cleaning on gene names, when we have positioning information only. We can get away with this
        # because we will use Annovar later, and we can put in proper gene names and fix the variant data. Really,
        # all we strictly need from COSMIC is the position, variant allele, and frequencies by tumour site and by
        # type. Everything else should probably be added by Annovar, as it is more likely to be consistent than
        # COSMIC. 
        
        # Make sure we have spaces - otherwise we can't do word boundary matching later on, well, immediately. 
        $primary_site =~ s{_}{ }g;
        $primary_hist =~ s{_}{ }g;
        $site_subtype =~ s{_}{ }g;
        $hist_subtype =~ s{_}{ }g;
        
        # Deal with benign stuff. 
        if ($primary_hist =~ m{(?:\b(?:adenoma|normal|nevus|in\ssitu|polyp|keratosis|cyst|wart|mole|hamartoma|ameloblastoma|
                                       chondroma|chordoma|endometriosis|pterygium|leiomyoma|thrombosis|aberrant\scrypt\sfoci|
                                       crohn\sdisease|low\smalignant\spotential|barrett\soesophagus|spitzoid\stumour|keratoacanthoma|
                                       lentigo|ns)\b|
                                   \berythro|
                                   (?:plasia|itis)$)}xi) {
            $mutation_id = 0;
        }
        
        if ($grch37_position =~ m/([0-9XYMT]+):(\d+)-(\d+)/) {
            $chromosome = $1;
            $start = $2;
            $stop = $3;
            my $strand = ($grch37_strand eq '+') ? 1 : ($grch37_strand eq '-') ? -1 : undef;
            next unless (defined($strand));
            
            # Be aware of sneaky logic! The deletion pattern sets a second empty group which gets propogated to 
            # the variant allele. This is unpleasant but correct. We don't really want to be sure what the variant
            # allele is, and it ought to be empty for any deletion. As always, we should regard two deletions of
            # the same start/stop, irrespective of the reference allele, as the same. 
            ($ref_allele, $var_allele) = 
                 ($mutation_cds =~ m/^c\.[0-9_+-]+ins([ACGT]+)$/)             ? ("", $1) 
               : ($mutation_cds =~ m/^c\.[0-9_+-]+del\d+ins([ACGT]+)$/)       ? ("N" x ($stop - $start + 1), $1) 
               : ($mutation_cds =~ m/^c\.[0-9_+-]+del(?:.*)()$/)              ? ("N" x ($stop - $start + 1), $1)
               : ($mutation_cds =~ m/^c\.[0-9_+-]+[ACGT]*>([ACGT]+)$/)        ? ("N" x ($stop - $start + 1), $1)
               : next;
               
            # Now the other issue is the reference allele, and particularly its size when we are dealing with an
            # insertion. In a simple insertion, the reference allele should be zero size. In a deletion which
            # is also an insertion, that isn't such an issue. This is useful as the existence of an empty
            # reference allele now tells us we are dealing with an insertion in later stages. 
        }
        
        $insert_statement->execute($gene_name, $accession, $hgnc, $sample_name, $id_sample, $id_tumour, $primary_site, $site_subtype, $primary_hist, $hist_subtype, 
                                   $genome_wide_screen, $mutation_id, $mutation_cds, $mutation_aa, $mutation_description, $mutation_zygosity, 
                                   $grch37_position, $grch37_strand, $somatic_status, $pubmed, $sample_source, $tumour_origin,
                                   $chromosome, $start, $stop, $ref_allele, $var_allele);
    }
    
    $dbh->commit();
    
}

sub reference_allele_phase {
    my ($self, $registry, $dbh) = @_;
    
    $dbh->begin_work();
    
    # Note that we don't need to bother if the reference allele is the empty string. 
    my $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT DISTINCT chromosome, start, stop
FROM mutations
WHERE chromosome IS NOT NULL
AND start IS NOT NULL
AND stop IS NOT NULL
AND var_allele IS NOT NULL
AND ref_allele IS NOT NULL AND ref_allele != ''
__ENDSQL__
    
    $statement->execute() or die($dbh->errstr());
    
    my $engine = Heliotrope::ReferenceSequenceEngine->new();
    while (my ($chromosome, $start, $stop) = $statement->fetchrow_array()) {
        $engine->add_reference_sequence_request($chromosome, $start, $stop);
    };
    
    # Check we write to the same thing. 
    my $update_statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
UPDATE mutations
SET ref_allele = CASE WHEN grch37_strand = '+' THEN ? WHEN grch37_strand = '-' THEN ? END 
WHERE chromosome = ?
AND start = ?
AND stop = ?
AND ref_allele = ?
__ENDSQL__
    
    $engine->get_reference_sequences(sub {
        my ($chromosome, $start, $stop, $reference_allele) = @_;
        my $reverse_reference_allele = convert_sequence('-', $reference_allele);
        my $result = $update_statement->execute($reference_allele, $reverse_reference_allele, $chromosome, $start, $stop, "N" x length($reference_allele));
        if ($update_statement->rows() == 0) {
            $DB::single = 1;
            croak("Mismatched reference allele length: $chromosome, $start, $stop, $reference_allele");
        }
    });
    
    $dbh->commit();
}

sub annotate_phase {
    my ($self, $registry, $dbh) = @_;
    
    my $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT DISTINCT chromosome, start, stop, var_allele, ref_allele, grch37_strand
FROM mutations
WHERE chromosome IS NOT NULL
AND start IS NOT NULL
AND stop IS NOT NULL
AND var_allele IS NOT NULL
AND ref_allele IS NOT NULL
AND grch37_strand IS NOT NULL
ORDER BY chromosome ASC, start ASC
__ENDSQL__
    
    $statement->execute() or die($dbh->errstr());
    
    my $engine = Heliotrope::AnnotationEngine->new();
    
    while (my ($chromosome, $start, $stop, $var_allele, $ref_allele, $strand) = $statement->fetchrow_array()) {
        $engine->add_annotation_request($chromosome, $start, $stop, $ref_allele, $var_allele, $strand);
    };
    
    say "Analyzing variants.";
    my $table = $engine->get_annotations();
    
    my $update_statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
UPDATE mutations 
SET canonical_gene_id = ?, canonical_mutation = ?, canonical_mutation_type = ?, canonical_cds_mutation = ?, canonical_codon = ?
WHERE chromosome = ?
AND start = ?
AND stop = ?
AND var_allele = ? 
__ENDSQL__
    
    say "Annotation completed.";

    $dbh->begin_work();
    
    foreach my $key (sort keys %$table) {
        my $records = $table->{$key};
        
        # These can now be tagged back to *all* the original COSMIC records. It would be so very
        # nice if we could actually find all the original COSMIC records easily, but we can't. The
        # location is a good basis. And we have the allele too. Anyway, here goes...
        
        my ($canonical_gene, $canonical_mutation) = split(":", $key, 2);
        
        foreach my $record (@$records) {

            my $thawed_record = Storable::thaw($record);

            $DB::single = 1 if (! $thawed_record->[0]->{location});
            my $location = $thawed_record->[0]->{location};
            my ($chromosome, $start, $stop) = ($location =~ m{^([0-9XYMT]+):(\d+)(?:-(\d+))?$});
            $stop ||= $start;
            my $var_allele = $thawed_record->[0]->{allele};
            my $canonical_mutation_type = $thawed_record->[0]->{consequence};
            
            # Now, in every single case there ought to be at least one record that matches.
            # There must be, as we are working from the database that produced all this
            # data. This a safety test. 
            
            $var_allele = '' if ($var_allele eq '-');
            
            my $canonical_cds_mutation = undef;
            if (exists($thawed_record->[0]->{extra}->{HGVSc})) {
                (undef, $canonical_cds_mutation) = split(":", $thawed_record->[0]->{extra}->{HGVSc}, 2);
            }
            
            my $canonical_codon = undef;
            if ($thawed_record->[0]->{protein_position} =~ m{^(\d+)}) {
                $canonical_codon = $1;
            }
            
            $update_statement->execute($canonical_gene, $canonical_mutation, $canonical_mutation_type, $canonical_cds_mutation, $canonical_codon,
                                       $chromosome, $start, $stop, $var_allele) or die($dbh->errstr());
            my $value = $update_statement->rows();
            if ($value < 1) {
                say "Failed to find: $chromosome, $start, $stop, $var_allele";
            } else {
                # say "Updated: $chromosome, $start, $stop, $var_allele";
            }
        }
    }
    
    $dbh->commit();

    return $table;
}

# At this stage, we can start the merging process, based on the canonical variants that we 
# now have in place.

sub create_indexes_phase {
    my ($self, $registry, $dbh) = @_;

    say STDERR "Creating indexes.";
    
    $self->execute_sql(<<__ENDSQL__);
CREATE INDEX mutation_gene_name_mutation_aa ON mutations(gene_name, mutation_aa)
__ENDSQL__

    $self->execute_sql(<<__ENDSQL__);
CREATE INDEX mutation_genomic_coordinates ON mutations(chromosome, start, stop)
__ENDSQL__

    $self->execute_sql(<<__ENDSQL__);
CREATE INDEX mutation_id_sample_mutation ON mutations(id_sample, mutation_id)
__ENDSQL__
    
}

sub duplicates_phase {
    my ($self, $registry, $dbh) = @_;
    
    say STDERR "Removing duplicates.";

    $self->execute_sql(<<__ENDSQL__);
UPDATE mutations 
SET canonical_gene_id  = (SELECT k.canonical_gene_id FROM mutations k 
                          WHERE k.gene_name = mutations.gene_name AND k.mutation_aa = mutations.mutation_aa 
                          AND k.canonical_gene_id IS NOT NULL AND k.canonical_mutation IS NOT NULL),
    canonical_mutation = (SELECT k.canonical_mutation FROM mutations k 
                          WHERE k.gene_name = mutations.gene_name AND k.mutation_aa = mutations.mutation_aa 
                          AND k.canonical_gene_id IS NOT NULL AND k.canonical_mutation IS NOT NULL)
WHERE chromosome IS NULL
AND start IS NULL
AND mutation_aa != ''
AND grch37_position = ''
AND gene_name IS NOT NULL
AND EXISTS (SELECT k.canonical_gene_id FROM mutations k 
            WHERE k.gene_name = mutations.gene_name AND k.mutation_aa = mutations.mutation_aa 
            AND k.canonical_gene_id IS NOT NULL AND k.canonical_mutation IS NOT NULL)
__ENDSQL__

    $self->execute_delimited_sql(<<__ENDSQL__);
DROP TABLE IF EXISTS to_delete;
CREATE TABLE to_delete AS
SELECT id_sample FROM 
(SELECT id_sample, 
       COUNT(mutation_cds) as p1, 
       COUNT(NULLIF('c.?', mutation_cds)) as p2, 
       COUNT(NULLIF(0, mutation_id)) as p3, 
       COUNT(mutation_id) as p4 
FROM mutations
GROUP BY id_sample
HAVING (p3 != 0 AND p2 = 0));

CREATE INDEX to_delete_id_sample ON to_delete(id_sample);

DELETE FROM mutations
WHERE id_sample IN 
(SELECT id_sample FROM to_delete);

DROP TABLE IF EXISTS to_delete;
__ENDSQL__
}

sub label_phase {
    my ($self, $registry, $dbh) = @_;
    
    say STDERR "Labelling genes.";
    
    # Labels genes with a canonical identifier. When we can. Try with both gene
    # and accession, then accession alone, then gene alone. 
    
    $self->execute_delimited_sql(<<__ENDSQL__);
DROP TABLE IF EXISTS gene_identifiers;

CREATE TABLE gene_identifiers AS
SELECT DISTINCT gene_name, accession, canonical_gene_id
FROM mutations
WHERE canonical_gene_id IS NOT NULL;

CREATE INDEX gene_identifier_name ON gene_identifiers(gene_name, accession);
CREATE INDEX gene_identifier_accession ON gene_identifiers(accession);

UPDATE mutations
SET canonical_gene_id = (SELECT k.canonical_gene_id 
                         FROM gene_identifiers k
                         WHERE k.gene_name = mutations.gene_name
                         AND k.accession = mutations.accession)
WHERE canonical_gene_id IS NULL;

UPDATE mutations
SET canonical_gene_id = (SELECT k.canonical_gene_id 
                         FROM gene_identifiers k
                         WHERE k.accession = mutations.accession)
WHERE canonical_gene_id IS NULL;

UPDATE mutations
SET canonical_gene_id = (SELECT k.canonical_gene_id 
                         FROM gene_identifiers k
                         WHERE k.gene_name = mutations.gene_name)
WHERE canonical_gene_id IS NULL
__ENDSQL__
}

my $bucket_count = 200;

sub frequency_distribution_phase {
    my ($self, $registry, $dbh) = @_;
    
    say STDERR "Calculating frequency distribution.";
    
    # First, we create a table of buckets, each containing a low end an an upper end. We
    # can use this with a find, to pick a bucket. Stuff on the boundaries ought to be
    # handled more systematically than this, but that is hard. We can use this in a 
    # subquery to find which bucket we want, and use that as a bucket count key when
    # calculating the distributions. 
    
    $self->execute_delimited_sql(<<__ENDSQL__);
DROP TABLE IF EXISTS canonical_gene_size;

CREATE TABLE canonical_gene_size (
  canonical_gene_id VARCHAR(20) PRIMARY KEY NOT NULL,
  size INTEGER NOT NULL
)
__ENDSQL__

    # Next we need to actually go back to MongoDB and get some of the canonical information
    # for each canonical gene identifier we are using. We really need the codon position for
    # each variant against the canonical transcript, and the protein size for the canonical
    # transcript. That we then use in the bucketing logic, which will be very similar to that
    # used already. 
    
    my $database = $self->open_database();

    $dbh->begin_work();
    
    my $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
INSERT INTO canonical_gene_size (canonical_gene_id, size) VALUES (?, ?)
__ENDSQL__
    
    my $cursor = $database->get_collection('genes')->find({}, {'id' => 1, 'sections.transcripts.data.records.lengthAminoAcid' => 1});
    while (my $object = $cursor->next) {
        if (my $length = $object->{sections}->{transcripts}->{data}->{records}->[0]->{lengthAminoAcid}) {
            my $gene_id = $object->{id};
            $statement->execute($gene_id, $length);
        } 
    }
    
    $dbh->commit();
   
    # Close off the MongoDB connection.
    $self->close_database($database);
    undef($database);
    
    say "Retrieved gene sizes.";

    # Now we can do the actual frequency calculations. This is now SQL. The data from this is 
    # actually smaller than it looks, as it is only derived at the gene level. We only work 
    # out the number of distinct mutated samples in each bucket. Every other thing is normalization
    # and can happen later.
    
    my $floaty_buckets = sprintf("%f", $bucket_count);

    $self->execute_delimited_sql(<<__ENDSQL__);
DROP TABLE IF EXISTS gene_distribution_hist;

CREATE TABLE gene_distribution_hist (
  canonical_gene_id CHAR(40),
  bucket INTEGER,
  mutated INTEGER,
  PRIMARY KEY (canonical_gene_id, bucket)
);

INSERT INTO gene_distribution_hist 
SELECT m.canonical_gene_id, CAST((($floaty_buckets * m.canonical_codon - 0.00000001)/gs.size) AS INTEGER) AS bucket, count(distinct(id_sample)) 
FROM mutations m
JOIN canonical_gene_size gs ON m.canonical_gene_id = gs.canonical_gene_id
WHERE m.canonical_mutation IS NOT NULL
AND m.canonical_codon IS NOT NULL
GROUP BY m.canonical_gene_id, CAST((($floaty_buckets * m.canonical_codon - 0.00000001)/gs.size) AS INTEGER)
__ENDSQL__

    say "Done.";
    
    # Now we can build an in-memory table of gene bucketed distributions. We'll rely to some
    # extend on autovivification here.

    $dbh->begin_work();
    
    $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT canonical_gene_id, bucket, mutated 
FROM gene_distribution_hist
__ENDSQL__

    
    # Get the data into Perl, autovivifying genes and buckets as required
    my $distribution_table = {};
    $statement->execute() or die($dbh->errstr());
    while (my ($canonical_gene_id, $bucket, $mutated) = $statement->fetchrow_array()) {
        $distribution_table->{$canonical_gene_id}->[$bucket] += $mutated;
    }
    
    # Completes each gene's array with zeros, and makes sure it's the right number of buckets
    foreach my $canonical_gene_id (keys %$distribution_table) {
        my $array = $distribution_table->{$canonical_gene_id};
        $distribution_table->{$canonical_gene_id} = [ map { $_ || 0 } @$array[0..($bucket_count - 1)] ];
    }

    $dbh->commit();
    
    return $distribution_table;
}

sub frequencies_phase {
    my ($self, $registry, $dbh) = @_;

    say STDERR "Calculating frequencies.";

    $self->execute_delimited_sql(<<__ENDSQL__);
DROP TABLE IF EXISTS gene_hist;

DROP TABLE IF EXISTS mutated_hist;

DROP TABLE IF EXISTS sample_hist;

DROP TABLE IF EXISTS gene_freqs;

DROP TABLE IF EXISTS mutation_freqs;

CREATE TABLE gene_hist (
  canonical_gene_id CHAR(40) ,
  primary_site CHAR(150),
  primary_hist CHAR(150),
  mutated INTEGER
);

CREATE TABLE mutated_hist (
  canonical_gene_id CHAR(40) ,
  canonical_mutation CHAR(244),
  primary_site CHAR(150),
  primary_hist CHAR(150),
  mutated INTEGER
);

CREATE INDEX gene_hist_primary_site ON gene_hist(primary_site);

CREATE INDEX mutated_hist_primary_site ON mutated_hist(primary_site);

CREATE INDEX gene_hist_gene_name ON gene_hist(canonical_gene_id);

CREATE INDEX mutated_hist_gene_name ON mutated_hist(canonical_gene_id);

CREATE INDEX mutated_hist_mutation_aa ON mutated_hist(canonical_mutation);

CREATE TABLE sample_hist (
  canonical_gene_id CHAR(30) ,
  primary_site CHAR(150),
  primary_hist CHAR(150),
  samples INTEGER
);

CREATE INDEX sample_hist_primary_site ON sample_hist(primary_site);

CREATE INDEX sample_hist_gene_name ON sample_hist(canonical_gene_id);

CREATE TABLE gene_freqs (
  canonical_gene_id CHAR(40),
  tissue_type CHAR(150),
  histology_type CHAR(150),
  total_sample INTEGER,
  sample_mutated INTEGER,
  frequency FLOAT
);

CREATE TABLE mutation_freqs (
  canonical_gene_id CHAR(40),
  canonical_mutation CHAR(255),
  tissue_type CHAR(150),
  histology_type CHAR(150),
  total_sample INTEGER,
  sample_mutated INTEGER,
  frequency FLOAT
);

CREATE INDEX mutation_freqs_gene ON mutation_freqs(canonical_gene_id);

CREATE INDEX mutation_freqs_mutation ON mutation_freqs(canonical_mutation);

CREATE INDEX mutation_freqs_tissue_type ON mutation_freqs(tissue_type);

CREATE INDEX mutation_freqs_histology_type ON mutation_freqs(histology_type);

CREATE INDEX gene_freqs_gene ON gene_freqs(canonical_gene_id);

CREATE INDEX gene_freqs_tissue_type ON gene_freqs(tissue_type);

CREATE INDEX gene_freqs_histology_type ON gene_freqs(histology_type);

INSERT INTO mutated_hist 
SELECT canonical_gene_id, canonical_mutation, primary_site, primary_hist, count(distinct(id_sample)) 
FROM mutations 
WHERE canonical_mutation IS NOT NULL
GROUP BY canonical_gene_id, canonical_mutation, primary_site, primary_hist
UNION
SELECT canonical_gene_id, canonical_mutation, primary_site, NULL AS primary_hist, count(distinct(id_sample)) 
FROM mutations 
WHERE canonical_mutation IS NOT NULL
GROUP BY canonical_gene_id, canonical_mutation, primary_site
UNION
SELECT canonical_gene_id, canonical_mutation, NULL AS primary_site, primary_hist, count(distinct(id_sample)) 
FROM mutations 
WHERE canonical_mutation IS NOT NULL
GROUP BY canonical_gene_id, canonical_mutation, primary_hist
UNION
SELECT canonical_gene_id, canonical_mutation, NULL AS primary_site, NULL AS primary_hist, count(distinct(id_sample)) 
FROM mutations 
WHERE canonical_mutation IS NOT NULL
GROUP BY canonical_gene_id, canonical_mutation;

INSERT INTO gene_hist 
SELECT canonical_gene_id, primary_site, primary_hist, count(distinct(id_sample)) 
FROM mutations 
WHERE canonical_mutation IS NOT NULL
GROUP BY canonical_gene_id, primary_site, primary_hist
UNION
SELECT canonical_gene_id, primary_site, NULL AS primary_hist, count(distinct(id_sample)) 
FROM mutations 
WHERE canonical_mutation IS NOT NULL
GROUP BY canonical_gene_id, primary_site
UNION
SELECT canonical_gene_id, NULL AS primary_site, primary_hist, count(distinct(id_sample)) 
FROM mutations 
WHERE canonical_mutation IS NOT NULL
GROUP BY canonical_gene_id, primary_hist
UNION
SELECT canonical_gene_id, NULL AS primary_site, NULL AS primary_hist, count(distinct(id_sample)) 
FROM mutations 
WHERE canonical_mutation IS NOT NULL
GROUP BY canonical_gene_id;

INSERT INTO sample_hist 
SELECT canonical_gene_id, primary_site, primary_hist, count(distinct(id_sample)) 
FROM mutations 
GROUP BY canonical_gene_id, primary_site, primary_hist
UNION
SELECT canonical_gene_id, primary_site, NULL AS primary_hist, count(distinct(id_sample)) 
FROM mutations 
GROUP BY canonical_gene_id, primary_site
UNION
SELECT canonical_gene_id, NULL AS primary_site, primary_hist, count(distinct(id_sample)) 
FROM mutations 
GROUP BY canonical_gene_id, primary_hist
UNION
SELECT canonical_gene_id, NULL AS primary_site, NULL AS primary_hist, count(distinct(id_sample)) 
FROM mutations 
GROUP BY canonical_gene_id;

CREATE INDEX sample_hist_gene_site ON sample_hist(canonical_gene_id, primary_site);

CREATE INDEX sample_hist_gene_hist ON sample_hist(canonical_gene_id, primary_hist);

INSERT INTO mutation_freqs 
SELECT s.canonical_gene_id, m.canonical_mutation, s.primary_site, s.primary_hist, s.samples, m.mutated, m.mutated/ROUND(s.samples)
FROM mutated_hist AS m, sample_hist as s 
WHERE s.canonical_gene_id = m.canonical_gene_id 
AND s.primary_site = m.primary_site 
AND s.primary_hist = m.primary_hist;

INSERT INTO mutation_freqs
SELECT s.canonical_gene_id, m.canonical_mutation, s.primary_site, s.primary_hist, s.samples, m.mutated, m.mutated/ROUND(s.samples)
FROM mutated_hist AS m, sample_hist as s
WHERE s.canonical_gene_id = m.canonical_gene_id
AND s.primary_site = m.primary_site
AND s.primary_hist IS NULL
AND m.primary_hist IS NULL;

INSERT INTO mutation_freqs 
SELECT s.canonical_gene_id, m.canonical_mutation, s.primary_site, s.primary_hist, s.samples, m.mutated, m.mutated/ROUND(s.samples)
FROM mutated_hist AS m, sample_hist as s
WHERE s.canonical_gene_id = m.canonical_gene_id
AND s.primary_site IS NULL
AND m.primary_site IS NULL
AND s.primary_hist = m.primary_hist;

INSERT INTO mutation_freqs 
SELECT s.canonical_gene_id, m.canonical_mutation, s.primary_site, s.primary_hist, s.samples, m.mutated, m.mutated/ROUND(s.samples)
FROM mutated_hist AS m, sample_hist as s
WHERE s.canonical_gene_id = m.canonical_gene_id
AND s.primary_site IS NULL
AND m.primary_site IS NULL
AND s.primary_hist IS NULL
AND m.primary_hist IS NULL;

INSERT INTO gene_freqs 
SELECT s.canonical_gene_id, s.primary_site, s.primary_hist, s.samples, m.mutated, m.mutated/ROUND(s.samples)
FROM gene_hist AS m, sample_hist as s 
WHERE s.canonical_gene_id = m.canonical_gene_id 
AND s.primary_site = m.primary_site 
AND s.primary_hist = m.primary_hist;

INSERT INTO gene_freqs 
SELECT s.canonical_gene_id, s.primary_site, s.primary_hist, s.samples, m.mutated, m.mutated/ROUND(s.samples)
FROM gene_hist AS m, sample_hist as s 
WHERE s.canonical_gene_id = m.canonical_gene_id 
AND s.primary_site = m.primary_site 
AND s.primary_hist IS NULL
AND m.primary_hist IS NULL;

INSERT INTO gene_freqs 
SELECT s.canonical_gene_id, s.primary_site, s.primary_hist, s.samples, m.mutated, m.mutated/ROUND(s.samples)
FROM gene_hist AS m, sample_hist as s 
WHERE s.canonical_gene_id = m.canonical_gene_id 
AND s.primary_site IS NULL
AND m.primary_site IS NULL 
AND s.primary_hist = m.primary_hist;

INSERT INTO gene_freqs 
SELECT s.canonical_gene_id, s.primary_site, s.primary_hist, s.samples, m.mutated, m.mutated/ROUND(s.samples)
FROM gene_hist AS m, sample_hist as s 
WHERE s.canonical_gene_id = m.canonical_gene_id 
AND s.primary_site IS NULL
AND m.primary_site IS NULL 
AND s.primary_hist IS NULL
AND m.primary_hist IS NULL;

__ENDSQL__
}

sub output {
    my ($self, $registry, $table, $distribution_table) = @_;
    
    my $cached_data = $self->get_data($registry);

    my $dbh = $self->reopen_working_database($registry);
    
    my $database = $self->open_database();
    
    # In this part, we write out the data which is at the gene level. That's really all frequencies, as COSMIC
    # doesn't say much about genes. That's where CGC comes in.

    my $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT canonical_gene_id AS identifier, 'tumour' AS block, (tissue_type || " " || histology_type) AS type, total_sample, sample_mutated, frequency
FROM gene_freqs
WHERE tissue_type IS NOT NULL
AND histology_type IS NOT NULL
UNION
SELECT canonical_gene_id AS identifier, 'tissue' AS block, tissue_type AS type, total_sample, sample_mutated, frequency
FROM gene_freqs
WHERE tissue_type IS NOT NULL
AND histology_type IS NULL
UNION
SELECT canonical_gene_id AS identifier, 'histology' AS block, histology_type AS type, total_sample, sample_mutated, frequency
FROM gene_freqs
WHERE tissue_type IS NULL
AND histology_type IS NOT NULL
UNION
SELECT canonical_gene_id AS identifier, 'all' AS block, '_all' AS type, total_sample, sample_mutated, frequency
FROM gene_freqs
WHERE tissue_type IS NULL
AND histology_type IS NULL
__ENDSQL__
    
    $statement->execute() or die($dbh->errstr());
    my $gene_data = {};
    while(my $data = $statement->fetchrow_hashref()) {
        push @{$gene_data->{$data->{identifier}}->{$data->{block}}}, $data;
    }
    
    my @alert = (
        _alerts => [{
            level => "note", 
            author => "cosmic",
            text => "This information has been updated in COSMIC v$cached_data->{version}",
            date => DateTime->now()
        }]
    );
    
    my $reference_id_cache = {};
    
    say STDERR "Writing gene frequencies.";

    foreach my $gene (sort keys %$gene_data) {
        my $existing = $self->find_one_record($database, 'genes', {"id" => $gene});
        if (! defined($existing)) {
            say "Can't locate: $gene";
            next;
        }
        
        my $new = expand_references($existing);
        
        my $frequencies = $gene_data->{$gene};
        
        foreach my $block (keys %$frequencies) {
            
            # Don't make references for an _ prefixed type. 
            $frequencies->{$block} = [ map { 
                {
                    (($_->{type} !~ m{^_}) ? ($block."TypesRefx" => $_->{type}) : ()), 
                    affected => int($_->{sample_mutated}), 
                    total => int($_->{total_sample}),
                    frequency => $_->{frequency} * 1.0
                }
            } sort {
                $b->{frequency} <=> $a->{frequency} || lc($a->{type}) cmp lc($b->{type}) 
            } @{$frequencies->{$block}} ];
        }
     
         $new->{sections}->{frequencies} = {_format => "frequencies", @alert, data => $frequencies};
        $new->{sections}->{distribution} = {_format => "distribution", @alert, data => $distribution_table->{$gene} };
         my $resolved = resolve_references($new, $existing);
         maybe_update_object($self, $resolved, $existing, $reference_id_cache, $database, 'genes');
    }

    # Save a wee bit of memory
    undef($gene_data);
    
    # Now we have done the genes, we can do the variants. Much less is actually needed to be 
    # stored here. 
    
    $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT mf.canonical_gene_id || ':' || mf.canonical_mutation AS name, 'tumour' AS block, 
       (mf.tissue_type || " " || mf.histology_type) AS type, mf.total_sample AS total_sample, mf.sample_mutated AS sample_mutated, mf.frequency AS frequency
FROM mutation_freqs mf
WHERE mf.tissue_type IS NOT NULL
AND mf.histology_type IS NOT NULL
UNION
SELECT mf.canonical_gene_id || ':' || mf.canonical_mutation AS name, 'tissue' AS block, 
       mf.tissue_type AS type, mf.total_sample AS total_sample, mf.sample_mutated AS sample_mutated, mf.frequency AS frequency
FROM mutation_freqs mf
WHERE mf.tissue_type IS NOT NULL
AND mf.histology_type IS NULL
UNION
SELECT mf.canonical_gene_id || ':' || mf.canonical_mutation AS name, 'histology' AS block, 
       mf.histology_type AS type, mf.total_sample AS total_sample, mf.sample_mutated AS sample_mutated, mf.frequency AS frequency
FROM mutation_freqs mf
WHERE mf.tissue_type IS NULL
AND mf.histology_type IS NOT NULL
UNION
SELECT mf.canonical_gene_id || ':' || mf.canonical_mutation AS name, 'all' AS block, 
       '_all' AS type, mf.total_sample AS total_sample, mf.sample_mutated AS sample_mutated, mf.frequency AS frequency
FROM mutation_freqs mf
WHERE mf.tissue_type IS NULL
AND mf.histology_type IS NULL
__ENDSQL__

    $statement->execute() or die($dbh->errstr());
    my $variant_data = {};
    while(my $data = $statement->fetchrow_hashref()) {
        push @{$variant_data->{$data->{name}}->{$data->{block}}}, $data;
    }
    
    $database->get_collection('variants')->ensure_index(
        Tie::IxHash->new(geneId => 1, name => 1), 
        { unique => true, safe => true }
    );  

    say STDERR "Writing variant frequencies.";

    my @variant_keys = keys %$variant_data;

    foreach my $variant (@variant_keys) {
        
        my ($gene_id, $variant_name) = split(":", $variant, 2);
        my $existing = $self->find_one_record($database, 'variants', {geneId => $gene_id, variantName => $variant_name});
        
        if (! defined($existing)) {
            $existing = {
                type => 'variant',
                variantType => 'mutation',
                version => 1,
                geneId => $gene_id, 
                mutation => $variant_name, 
                references => [],
                sections => {}
            };
        }
        
        # Patch up the core variant data if needed, but flag as needing verification. That is 
        # an internal marker to avoid it causing equality issues. Note that we should probably
        # dig out the gene name as well as its identifier, to be safe.
        
        my $existing_gene = $self->find_one_record($database, 'genes', {id => $gene_id});
        if (! defined($existing_gene)) {
            carp("Failed to find gene: $gene_id - skipping $variant");
            next;
        } else {
            $existing->{gene} = $existing_gene->{name};
            $existing->{shortMutation} = convert_names_to_codes($existing->{mutation});          
            $existing->{name} = "$existing->{gene} $existing->{mutation}";            
            $existing->{shortName} = "$existing->{gene} $existing->{shortMutation}"; 
            $existing->{genesRidx} = $#{$existing->{references}} + 1;
            push @{$existing->{references}}, {ref => "genes", name => $existing_gene->{name}, _id => $existing_gene->{_id}};
        }
            
        # Now, at this stage there is very much more data that we can get from COSMIC, using
        # the table as the primary data source. This will include a lot of the genomic
        # positioning information. 

        my $table_data = $table->{"$gene_id:$variant_name"};
        my @thawed_table_data = map { Storable::thaw($_); } @{$table_data};
        $existing->{consequence} = $thawed_table_data[0]->[0]->{consequence} unless (exists($existing->{consequence}));
        my $position_data = [];
        my $colocated = {};
        foreach my $record (map { @$_; } @thawed_table_data) {
            my $position = {};
            ($position->{exon}) = ($record->{extra}->{EXON} =~ m{^(\d+)}) if (exists($record->{extra}->{EXON}));
            $position->{codon} = $record->{protein_position} if (exists($record->{protein_position}));
            
            # Expands, eg., X:135763775 => X:135763775-135763775, when not already a range
            ($position->{chromosome}, $position->{start}, $position->{stop}) = 
                ($record->{location} =~ m{(^[0-9XYMT]+):(\d+)(?:-(\d+))?}) if (exists($record->{location}));
            $position->{stop} ||= $position->{start};
            $position->{cdsPosition} = $record->{cds_position} if (exists($record->{cds_position}));
            $position->{consequence} = $record->{consequence};
            $position->{transcript} = $record->{feature} if ($record->{feature_type} eq 'Transcript');
            $position->{gene} = $record->{gene} if (exists($record->{gene}));
            ($position->{HGVSc}) = ($record->{extra}->{HGVSc} =~ m{^\w+:(.*)}) if (exists($record->{extra}->{HGVSc}));
            ($position->{HGVSp}) = ($record->{extra}->{HGVSp} =~ m{^\w+:(.*)}) if (exists($record->{extra}->{HGVSp}));
            $position->{referenceAllele} = $record->{_reference_allele} if (exists($record->{_reference_allele}));
            $position->{variantAllele} = $record->{_variant_allele} if (exists($record->{_variant_allele}));
            if (exists($record->{extra}->{SIFT})) {
                my ($level, $score) = ($record->{extra}->{SIFT} =~ m{(\w+)\(([0-9\.]+)\)});
                $position->{sift} = {level => $level, score => (0.0 + $score)};
            }
            if (exists($record->{extra}->{PolyPhen})) {
                my ($level, $score) = ($record->{extra}->{PolyPhen} =~ m{(\w+)\(([0-9\.]+)\)});
                $position->{polyphen} = {level => $level, score => (0.0 + $score)};
            }
            
            if ($record->{colocated} =~ m{\w+}) {
                foreach my $value (split(",", $record->{colocated})) {
                    $colocated->{$value} = $value;
                }
            }
                        
            $position->{HGVSpr} = convert_names_to_codes($position->{HGVSp}) if (exists($position->{HGVSp}));
            
            push $position_data, $position;
        }
        
        # Again, save a wee bit of memory
        my $frequencies = delete $variant_data->{$variant};
        foreach my $block (keys %$frequencies) {
            
            # Don't make references for an _ prefixed type. 
            $frequencies->{$block} = [ map { 
                {
                    (($_->{type} !~ m{^_}) ? ($block."TypesRefx" => $_->{type}) : ()), 
                    affected => int($_->{sample_mutated}), 
                    total => int($_->{total_sample}),
                    frequency => $_->{frequency} * 1.0
                }
            } sort {
                $b->{frequency} <=> $a->{frequency} || lc($a->{type}) cmp lc($b->{type}) 
            } @{$frequencies->{$block}} ];
        }
         
        my $new = expand_references($existing);
        $new->{sections}->{frequencies} = {_format => "frequencies", @alert, data => $frequencies};
        $new->{sections}->{positions} = {_format => "positions", @alert, data => $position_data};
        my $resolved = resolve_references($new, $existing);
        
        maybe_update_object($self, $resolved, $existing, $reference_id_cache, $database, 'variants');
    }
        
    $self->close_working_database();
    $self->close_database($database);
}

sub maybe_update_object {
    my ($self, $resolved, $existing, $reference_id_cache, $database, $collection) = @_;
    
    return if (deep_eq($resolved, $existing));
            
    foreach my $reference (@{$resolved->{references}}) {
        next if ($reference->{_id});
             
        if (my $id = $reference_id_cache->{$reference->{ref}}->{$reference->{name}}) {
            $reference->{_id} = $id;
        } else {
            my $collection = $reference->{ref};
            if (my $existing = $self->find_one_record($database, $collection, {name => $reference->{name}})) {
                $reference->{_id} = $existing->{_id};
                $reference_id_cache->{$reference->{ref}}->{$reference->{name}} = $reference->{_id};
            } else {
                my $copy = clone($reference);
                delete($copy->{ref});
                
                $reference->{_id} = $self->save_record($database, $collection, $copy, {w => 1, j => true});
                $reference_id_cache->{$reference->{ref}}->{$reference->{name}} = $reference->{_id};
            }
        }
        next;
    }
            
    $resolved->{version} = $existing->{version} + 1;
    $self->save_record($database, $collection, $resolved, {w => 1, j => true});
}

1;