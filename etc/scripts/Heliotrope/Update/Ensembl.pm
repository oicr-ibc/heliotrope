package Heliotrope::Update::Ensembl;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';
with 'Heliotrope::WorkingDatabase';

use boolean;
use DBI;
use HTTP::Request;
use File::Slurp;
use File::Temp;
use DateTime;
use DateTime::Format::Natural;
use Carp;
use IO::File;
use IO::Uncompress::Gunzip;
use List::MoreUtils qw(firstidx apply);

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

has 'release' => (
  is => 'ro',
  default => sub { "75"; }
);

has 'files' => (
  is  => 'ro',
  default => sub {
    ["alt_allele.txt.gz",
     "analysis.txt.gz",
     "attrib_type.txt.gz",
     "coord_system.txt.gz",
     "exon.txt.gz",
     "exon_transcript.txt.gz",
     "external_db.txt.gz",
     "external_synonym.txt.gz",
     "gene.txt.gz", 
     "interpro.txt.gz",
     "object_xref.txt.gz",
     "protein_feature.txt.gz",
     "seq_region.txt.gz",
     "seq_region_attrib.txt.gz",
     "transcript.txt.gz",
     "translation.txt.gz",
     "xref.txt.gz",
    ]
  }
);

sub BUILD {
  my ($self) = @_;
  $self->{name} = "ensembl";
}

sub maybe_update {
  my ($self, $registry, %options) = @_;
  
  my ($req, $result, $file);

  my $release = $self->release();

  # First of all, we need to locate the right directory
  my $root_url = "ftp://ftp.ensembl.org/pub/release-$release/mysql/";
  $req = HTTP::Request->new(GET => $root_url);
  $req->header(Accept => "text/html, */*;q=0.1");  
  ($result, $file) = $self->get_resource($registry, $req);
  my $mysql_listing = read_file($file);
  my ($directory, $version) = ($mysql_listing =~ m{(homo_sapiens_core)_(\w+)}s);

  # Now we can get the checksums file, to find out what might have changed. This is more
  # that a little fragile, given it uses an old BSD checksum algorithm. But that's an 
  # Ensembl decision. To overcome that risk, we use the version as a prefix. 
  
  my $base_url = "$root_url/${directory}_${version}";

  $req = HTTP::Request->new(GET => "$base_url/CHECKSUMS.gz");
  $req->header(Accept => "text/html, */*;q=0.1");

  ($result, $file) = $self->get_resource($registry, $req);
  
  my $uncompressed = IO::Uncompress::Gunzip->new($file);
  my $data = read_file($uncompressed);
  
  my $checksums = {};
  while($data =~ m{([^\n]+)}g) {
    my $line = $1;
    if ($line =~ m{^(\d+\s+\d+)\s+(.*)$}) {
      my ($checksum, $file) = ($1, $2);
      $checksum =~ s{\s+}{ };
      $checksums->{$file} = "$version $checksum";
    }
  }
  
  # Now, we don't actually want all the tables. So let's define the files that we do need, and download
  # any that need to be updated. 
  
  my $cached_data = $self->get_data($registry);
  $cached_data = {} if (ref($cached_data) ne 'HASH');
  
  my $any_change = 0;
  
  my @files = @{$self->files()};
  foreach my $file (@files) {
    my $url = "$base_url/$file";
    my $file_data = $cached_data->{$file};
    my $checksum = $checksums->{$file};
    
    if (exists($file_data->{checksum}) && $file_data->{checksum} eq $checksum) {
      say "Existing file is fine: $file. Skipping update.";
      next;
    }
    
    $req = HTTP::Request->new(GET => $url);
    say "Downloading $url.";
    my ($req_result, $req_file) = $self->get_resource($registry, $req);
    say "Download complete.";

    # Now we can store the data file in the right place and update the cache     
    $file_data->{checksum} = $checksum;
    $file_data->{url} = $url;
    $file_data->{download_time} = DateTime->now()->iso8601();
    $cached_data->{$file} = $file_data;
    $self->relocate_file($registry, $req_file, $file);
    $any_change = 1;
  }
  
  if ($any_change) {
    $cached_data->{base_url} = $base_url;
    $cached_data->{version} = $version;
    $self->set_data($registry, $cached_data);
    $self->update($registry);
  }
}

sub update {
  my ($self, $registry) = @_;
  
  say "About to update.";
  
  my $dbh = $self->open_working_database($registry);
  
  $self->load_data($registry, "alt_allele.txt.gz",
     qq{INSERT INTO alt_allele (alt_allele_id, gene_id, is_ref) VALUES (?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE alt_allele (
  alt_allele_id INTEGER NOT NULL,
  gene_id INTEGER NOT NULL,
  is_ref INTEGER,
  UNIQUE (alt_allele_id, gene_id)
)
__ENDSQL__
  
  $self->load_data($registry, "analysis.txt.gz",
     qq{INSERT INTO analysis (analysis_id, created, logic_name, db, db_version, db_file, program, program_version, program_file, parameters, module, module_version, gff_source, gff_feature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE analysis (
  analysis_id INTEGER PRIMARY KEY AUTOINCREMENT,
  created DATETIME,
  logic_name VARCHAR(128),
  db VARCHAR(120),
  db_version VARCHAR(40),
  db_file VARCAR(120),
  program VARCHAR(80),
  program_version VARCHAR(40),
  program_file VARCHAR(80),
  parameters TEXT,
  module VARCHAR(80),
  module_version VARCHAR(40),
  gff_source VARCHAR(40),
  gff_feature VARCHAR(40)
)
__ENDSQL__
  
  $self->load_data($registry, "attrib_type.txt.gz",
     qq{INSERT INTO attrib_type (attrib_type_id, code, name, description) VALUES (?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE attrib_type (
  attrib_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
  code VARCHAR(15) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(1024)
);
CREATE UNIQUE INDEX code_idx ON attrib_type(code);
__ENDSQL__
  
  $self->load_data($registry, "coord_system.txt.gz",
     qq{INSERT INTO coord_system (coord_system_id, species_id, name, version, rank, attrib) VALUES (?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE coord_system (
  coord_system_id INTEGER PRIMARY KEY AUTOINCREMENT,
  species_id INTEGER NOT NULL,
  name VARCHAR(40) NOT NULL,
  version VARCHAR(255),
  rank INTEGER NOT NULL,
  attrib VARCHAR(40)
);
CREATE UNIQUE INDEX name_idx ON coord_system(name, version, species_id);
__ENDSQL__
  
  $self->load_data($registry, "exon.txt.gz",
     qq{INSERT INTO exon (exon_id, seq_region_id, seq_region_start, seq_region_end, seq_region_strand, phase, end_phase, is_current, is_constitutive, stable_id, version, created_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE exon (
  exon_id INTEGER PRIMARY KEY AUTOINCREMENT,
  seq_region_id INTEGER NOT NULL,
  seq_region_start INTEGER NOT NULL,
  seq_region_end INTEGER NOT NULL,
  seq_region_strand INTEGER NOT NULL,
  phase INTEGER NOT NULL,
  end_phase INTEGER NOT NULL,
  is_current INTEGER NOT NULL,
  is_constitutive INTEGER NOT NULL,
  stable_id VARCHAR(128),
  version INTEGER NOT NULL,
  created_date DATETIME,
  modified_date DATETIME
)
__ENDSQL__
  
  $self->load_data($registry, "exon_transcript.txt.gz",
     qq{INSERT INTO exon_transcript (exon_id, transcript_id, rank) VALUES (?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE exon_transcript (
  exon_id INTEGER NOT NULL,
  transcript_id INTEGER NOT NULL,
  rank INTEGER,
  PRIMARY KEY (exon_id, transcript_id, rank)
);
CREATE INDEX exon_transcript_transcript_id ON exon_transcript(transcript_id);
CREATE INDEX exon_transcript_exon_id ON exon_transcript(exon_id);
__ENDSQL__
  
  $self->load_data($registry, "external_db.txt.gz",
     qq{INSERT INTO external_db (external_db_id, db_name, db_release, status, priority, db_display_name, type, secondary_db_name, secondary_db_table, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE external_db (
  external_db_id INTEGER PRIMARY KEY AUTOINCREMENT,
  db_name VARCHAR(100) NOT NULL,
  db_release VARCHAR(255),
  status VARCHAR(12) NOT NULL,
  priority INTEGER NOT NULL,
  db_display_name VARCHAR(255),
  type VARCHAR(12),
  secondary_db_name VARCHAR(255),
  secondary_db_table VARCHAR(255),
  description TEXT
);
CREATE UNIQUE INDEX db_name_db_release_idx ON external_db(db_name, db_release)
__ENDSQL__
  
  $self->load_data($registry, "external_synonym.txt.gz",
     qq{INSERT INTO external_synonym (xref_id, synonym) VALUES (?, ?)},
     <<__ENDSQL__);
CREATE TABLE external_synonym (
  xref_id INTEGER NOT NULL,
  synonym VARCHAR(100) NOT NULL,
  PRIMARY KEY (xref_id, synonym)
)
__ENDSQL__
  
  $self->load_data($registry, "gene.txt.gz",
     qq{INSERT INTO gene (gene_id, biotype, analysis_id, seq_region_id, seq_region_start, seq_region_end, seq_region_strand, display_xref_id, source, status, description, is_current, canonical_transcript_id, stable_id, version, created_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE gene (
  gene_id INTEGER PRIMARY KEY AUTOINCREMENT,
  biotype VARCHAR(40) NOT NULL,
  analysis_id INTEGER NOT NULL,
  seq_region_id INTEGER NOT NULL,
  seq_region_start INTEGER NOT NULL,
  seq_region_end INTEGER NOT NULL,
  seq_region_strand INTEGER NOT NULL,
  display_xref_id INTEGER NOT NULL,
  source VARCHAR(20) NOT NULL,
  status VARCHAR(20),
  description TEXT,
  is_current INTEGER NOT NULL,
  canonical_transcript_id INTEGER NOT NULL,
  stable_id VARCHAR(128),
  version INTEGER NOT NULL,
  created_date DATETIME,
  modified_date DATETIME  
);
CREATE INDEX gene_stable_id_idx ON gene(stable_id)
__ENDSQL__
  
  $self->load_data($registry, "interpro.txt.gz",
     qq{INSERT INTO interpro (interpro_ac, id) VALUES (?, ?)},
     <<__ENDSQL__);
CREATE TABLE interpro (
  interpro_ac VARCHAR(40) NOT NULL,
  id VARCHAR(40) NOT NULL,
  PRIMARY KEY (interpro_ac, id)
);
CREATE INDEX interpro_id_idx ON interpro(id)
__ENDSQL__
  
  $self->load_data($registry, "object_xref.txt.gz",
     qq{INSERT INTO object_xref (object_xref_id, ensembl_id, ensembl_object_type, xref_id, linkage_annotation, analysis_id) VALUES (?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE object_xref (
  object_xref_id INTEGER PRIMARY KEY AUTOINCREMENT,
  ensembl_id INTEGER NOT NULL,
  ensembl_object_type VARCHAR(18) NOT NULL,
  xref_id INTEGER NOT NULL,
  linkage_annotation VARCHAR(255),
  analysis_id INTEGER NOT NULL
);
CREATE INDEX ensembl_idx ON object_xref(ensembl_object_type, ensembl_id)
__ENDSQL__
  
  $self->load_data($registry, "protein_feature.txt.gz",
     qq{INSERT INTO protein_feature (protein_feature_id, translation_id, seq_start, seq_end, hit_start, hit_end, hit_name, analysis_id, score, evalue, perc_ident, external_data, hit_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE protein_feature (
  protein_feature_id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_id INTEGER NOT NULL,
  seq_start INTEGER NOT NULL,
  seq_end INTEGER NOT NULL,
  hit_start INTEGER NOT NULL,
  hit_end INTEGER NOT NULL,
  hit_name VARCHAR(40) NOT NULL,
  analysis_id INTEGER NOT NULL,
  score REAL,
  evalue REAL,
  perc_ident REAL,
  external_data TEXT,
  hit_description TEXT
);
CREATE INDEX protein_feature_translation_id ON protein_feature(translation_id)
__ENDSQL__
  
  $self->load_data($registry, "seq_region.txt.gz",
     qq{INSERT INTO seq_region (seq_region_id, name, coord_system_id, length) VALUES (?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE seq_region (
  seq_region_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(40) NOT NULL,
  coord_system_id INTEGER NOT NULL,
  length INTEGER NOT NULL
);
__ENDSQL__
  
  $self->load_data($registry, "seq_region_attrib.txt.gz",
     qq{INSERT INTO seq_region_attrib (seq_region_id, attrib_type_id, value) VALUES (?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE seq_region_attrib (
  seq_region_id INTEGER NOT NULL,
  attrib_type_id INTEGER NOT NULL,
  value VARCHAR(255)
);
CREATE INDEX seq_region_idx ON seq_region_attrib(seq_region_id);
CREATE INDEX type_val_idx ON seq_region_attrib(attrib_type_id, value);
__ENDSQL__
  
  $self->load_data($registry, "transcript.txt.gz",
     qq{INSERT INTO transcript (transcript_id, gene_id, analysis_id, seq_region_id, seq_region_start, seq_region_end, seq_region_strand, display_xref_id, source, biotype, status, description, is_current, canonical_translation_id, stable_id, version, created_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE transcript (
  transcript_id INTEGER PRIMARY KEY AUTOINCREMENT,
  gene_id INTEGER,
  analysis_id INTEGER NOT NULL,
  seq_region_id INTEGER NOT NULL,
  seq_region_start INTEGER NOT NULL,
  seq_region_end INTEGER NOT NULL,
  seq_region_strand INTEGER NOT NULL,
  display_xref_id INTEGER,
  source VARCHAR(20),
  biotype VARCHAR(40) NOT NULL,
  status VARCHAR(20),
  description TEXT,
  is_current INTEGER NOT NULL,
  canonical_translation_id INTEGER,
  stable_id VARCHAR(128),
  version INTEGER NOT NULL,
  created_date DATETIME,
  modified_date DATETIME  
);
CREATE INDEX transcript_stable_id_idx ON transcript(stable_id);
CREATE INDEX transcript_gene_id ON transcript(gene_id)
__ENDSQL__
  

  $self->load_data($registry, "translation.txt.gz",
     qq{INSERT INTO translation (translation_id, transcript_id, seq_start, start_exon_id, seq_end, end_exon_id, stable_id, version, created_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE translation (
  translation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  transcript_id INTEGER NOT NULL,
  seq_start INTEGER NOT NULL,
  start_exon_id INTEGER NOT NULL,
  seq_end INTEGER NOT NULL,
  end_exon_id INTEGER NOT NULL,
  stable_id VARCHAR(128),
  version INTEGER NOT NULL,
  created_date DATETIME,
  modified_date DATETIME  
);
CREATE INDEX translation_stable_id_idx ON translation(stable_id);
CREATE INDEX translation_transcript_id_idx ON translation(transcript_id)
__ENDSQL__
  
  $self->load_data($registry, "xref.txt.gz",
     qq{INSERT INTO xref (xref_id, external_db_id, dbprimary_acc, display_label, version, description, info_type, info_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)},
     <<__ENDSQL__);
CREATE TABLE xref (
  xref_id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_db_id INTEGER NOT NULL,
  dbprimary_acc VARCHAR(40) NOT NULL,
  display_label VARCHAR(128) NOT NULL,
  version VARCHAR(10) NOT NULL,
  description TEXT,
  info_type VARCHAR(20) NOT NULL,
  info_text VARCHAR(255) NOT NULL,
  UNIQUE (dbprimary_acc, external_db_id, info_type, info_text, version)
)
__ENDSQL__
  
  $self->close_working_database();
  
  $self->output($registry);
}

sub output {
  my ($self, $registry) = @_;
  
  my $cached_data = $self->get_data($registry);
  
  my $gene_data = $self->build_data($registry);
  
  my $dbh = $self->open_database();
  my $collection = 'genes';  
  
  # Now we have finally made it to the stage where we can start to actually do
  # the dataase updating. We really want to go through all of the genes looking
  # for them, and then updating them. Each section can be updated separately and 
  # a Ensembl update note attached. This should inform people about when the
  # data was actually updated. 
  
  say "Writing data.";
  
  my @alert = (
    _alerts => [{
      level => "note", 
      author => "ensembl",
      text => "This information has been updated in Ensembl version v$cached_data->{version}",
      url => $cached_data->{base_url},
      date => DateTime->now()
    }],
  );
  
  $self->ensure_index($dbh, $collection, Tie::IxHash->new("id" => 1), { unique => true, safe => true });
  $self->ensure_index($dbh, $collection, Tie::IxHash->new("name" => 1), { unique => true, safe => true });
  
  foreach my $id (sort { $gene_data->{$a}->{name} cmp $gene_data->{$b}->{name} } keys %$gene_data) {
    my $data = $gene_data->{$id};
    
    my $existing = $self->find_one_record($dbh, $collection, {"id" => $id});
    $existing = {} unless (defined($existing));
    $existing->{version} = 1 unless (exists($existing->{version}));
    $existing->{id} = $id unless (exists($existing->{id}));
    $existing->{name} = $data->{name} unless (exists($existing->{name}));
    $existing->{type} = 'gene' unless (exists($existing->{type}));
    
    my $changes = {};
    $changes->{'$set'}->{version} = $existing->{version} + 1;
    
    my $new = expand_references($existing);
    
    foreach my $block (qw(description location transcripts)) {
      my $existing_block = $existing->{sections}->{$block}->{data};
      my $new_block = $data->{$block};
      if (! deep_eq($existing_block, $new_block)) {
        $changes->{'$set'} = {} unless (exists($changes->{'$set'}));
        $changes->{'$set'}->{"sections.$block"} = {
          @alert,
          _format => $block,
          data => $new_block
        }
      }
    }
    
    $self->update_record($dbh, $collection, $existing, $changes, {upsert => 1, multiple => 0, w => 1, j => true})
  }
  
  $self->close_database($dbh);
}

sub build_data {
  my ($self, $registry) = @_;
    
  my $dbh = $self->reopen_working_database($registry);
  my $statement;
  
  # Start with gene and chromosome stuff. This is a more complex query 
  # as we need to remove the sequencing regions that aren't reference.
  
  say "Finding genes.";
  
  $self->execute_delimited_sql(<<__ENDSQL__);
DROP TABLE IF EXISTS interesting_genes;

CREATE TABLE interesting_genes AS
SELECT g.gene_id as gene_id,
     g.stable_id as id, 
     g.version as version, 
     x.display_label as name, 
     sr.name as chromosome, 
     x.description as fullName, 
     g.seq_region_start as txStart, 
     g.seq_region_end as txEnd, 
     g.seq_region_strand as strand,
     g.canonical_transcript_id as canonical_transcript_id,
     g.display_xref_id as display_xref_id
FROM gene g
JOIN seq_region sr ON g.seq_region_id = sr.seq_region_id
JOIN coord_system cs ON sr.coord_system_id = cs.coord_system_id
JOIN xref x ON g.display_xref_id =  x.xref_id
JOIN external_db xdb ON x.external_db_id = xdb.external_db_id
WHERE cs.version = 'GRCh37' 
AND cs.name = 'chromosome'
AND xdb.db_name = 'HGNC' 
AND sr.seq_region_id NOT IN
  (SELECT sra.seq_region_id
   FROM seq_region_attrib sra
   JOIN attrib_type at ON sra.attrib_type_id = at.attrib_type_id
   WHERE at.code = 'non_ref');

DELETE FROM interesting_genes WHERE id NOT IN (SELECT min(id) FROM interesting_genes GROUP BY name);
__ENDSQL__
  
  $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT id, version, name, chromosome, fullName, txStart, txEnd, strand 
FROM interesting_genes
ORDER BY name asc
__ENDSQL__

  my $gene_data = {};

  $statement->execute() or die($dbh->errstr());
  while (my ($stable_id, $version, $name, $chromosome, $full_name, $tx_start, $tx_end, $strand) = $statement->fetchrow_array()) {
    $gene_data->{$stable_id} = {
      id => $stable_id,
      versionedId => "$stable_id.$version",
      name => $name,
      location => {
        chromosome => $chromosome,
        strand => $strand,
        txStart => $tx_start,
        txEnd => $tx_end
      },
      description => {
        fullName => $full_name,
        synonyms => [$name]
      },
      transcripts => {}
    };
  };

  say "Finding synonyms.";
  
  # Now let's read the synonyms. 
  $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT g.id, xs.synonym AS synonym
FROM interesting_genes g
JOIN external_synonym xs ON xs.xref_id = g.display_xref_id
__ENDSQL__

  $statement->execute() or die($dbh->errstr());
  while (my ($stable_id, $synonym) = $statement->fetchrow_array()) {
    push @{$gene_data->{$stable_id}->{description}->{synonyms}}, $synonym if (exists($gene_data->{$stable_id}));
  }
  
  say "Finding transcripts.";
  
  $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT g.id, g.canonical_transcript_id = tr.transcript_id, tr.stable_id, tr.version, tl.stable_id, tl.version,
     tl.seq_start, tl.start_exon_id, tl.seq_end, tl.end_exon_id, x.display_label
FROM external_db xdb
CROSS JOIN interesting_genes g 
CROSS JOIN transcript tr ON tr.gene_id = g.gene_id
CROSS JOIN translation tl ON tl.transcript_id = tr.transcript_id
LEFT JOIN object_xref ox ON ox.ensembl_id = tr.transcript_id AND ox.ensembl_object_type = 'Transcript'
CROSS JOIN xref x on x.xref_id = ox.xref_id AND x.external_db_id = xdb.external_db_id
WHERE xdb.db_name = 'HGNC_trans_name'
ORDER BY g.id asc, g.canonical_transcript_id = tr.transcript_id desc, x.display_label asc
__ENDSQL__
  
  # Transcripts are a tricky area. We want to be able to access transcripts by name, and quickly to
  # get to the canonical transcript. That requires indexing, which means the associative array
  # approach is baaad. We should really do the following (a) use an array (b) put the canonical 
  # transcript at position 0, and (c) put the whole lot in a subfield with a canonicalTranscriptId 
  # field to make the name of the canonical transcript easy. We could alternatively use a 
  # canonicalTranscriptIndex and a number with a plain sorted list of transcripts. In any event
  # the name remains accessible via a multikey. Must admit I like the idea of the zero positioned
  # canonical value. 
   
  $statement->execute() or die($dbh->errstr());
  while (my ($stable_id, $is_canonical, $transcript_stable_id, $transcript_version, $translation_stable_id, $translation_version, 
         $seq_start, $start_exon_id, $seq_end, $end_exon_id, $transcript_name) = $statement->fetchrow_array()) {
    croak if (! exists($gene_data->{$stable_id}));
    $gene_data->{$stable_id}->{transcripts}->{$transcript_stable_id} = {
      name => $transcript_name,
      translationId => $translation_stable_id,
      versionedId => "$transcript_stable_id.$transcript_version",
      versionedTranslationId => "$translation_stable_id.$translation_version",
      isCanonical => boolean($is_canonical),
      seqExonStart => $seq_start,
      seqExonEnd => $seq_end,
      _ensemblStartExonId => $start_exon_id,
      _ensemblEndExonId => $end_exon_id,
    }
  }
  
  # OK, transcript identification done. And we are using a Tie::IxHash so we need to remember that
  # when poking around with the remaining data. 
  #
  # The calculation of exons here differs from that in refGene.txt, and this is how. First of all
  # the translation includes four extra fields, a start and end exon id, and a start and end offset
  # within those exons. These are used in translation to define which segments of the exons are 
  # used in the coding sequence. These then correspond to the refGene.txt. This implies we should
  # probably only work (for now) with transcripts that do have a defined translation. It's probably
  # best not to try to fit all of this into SQL, the boundary conditions are going to be a little 
  # funny. However, we probably should filter out non-translating transcripts, and store the 
  # start/end exons and offsets -- and retain exon identifiers -- and use these to clean up the
  # data afterwards. Basically, the short story is, like refGene.txt, we focus on the coding DNA
  # only, which makes it easier for us to handle things. 
  #
  # NOTE: We probably also need to test out ANNOVAR for Ensembl transcripts, as we may actually need
  # to keep these offsets in the database and apply then at runtime, if we are getting different
  # coordinates against Ensembl transcripts than we would against refGene.txt coding segments.
  
  say "Finding exons.";
  
  $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT g.id, tr.stable_id, ext.rank, 
     ex.exon_id, ex.seq_region_start, ex.seq_region_end, ex.phase, ex.end_phase
FROM interesting_genes g
JOIN transcript tr ON tr.gene_id = g.gene_id
JOIN translation tl ON tl.transcript_id = tr.transcript_id
JOIN exon_transcript ext ON ext.transcript_id = tr.transcript_id
JOIN exon ex on ex.exon_id = ext.exon_id
ORDER BY g.id, tr.stable_id, ext.rank
__ENDSQL__
  
  $statement->execute() or die($dbh->errstr());
  while (my ($stable_id, $transcript_stable_id, undef, 
         $exon_id, $start, $end, $start_phase, $end_phase) = $statement->fetchrow_array()) {
    croak if (! exists($gene_data->{$stable_id}));
    my $transcript = $gene_data->{$stable_id}->{transcripts}->{$transcript_stable_id};
    push @{$transcript->{exons}}, {
      _ensemblExonId => $exon_id,
      start => $start,
      end => $end,
      startPhase => $start_phase,
      endPhase => $end_phase
    };
    $transcript->{numberOfExons}++;
    $transcript->{length} += (1 + $end - $start);
  }
  
  say "Removing Ensembl internal exon identifiers.";
  foreach my $gene (keys %$gene_data) {
    my $transcripts = $gene_data->{$gene}->{transcripts};
    foreach my $transcript (keys %$transcripts) {
      my $transcript_data = $transcripts->{$transcript};
      my $exons = $transcript_data->{exons};
      my $start_exon_offset = firstidx { $_->{_ensemblExonId} == $transcript_data->{_ensemblStartExonId} } @$exons;
      my $end_exon_offset = firstidx { $_->{_ensemblExonId} == $transcript_data->{_ensemblEndExonId} } @$exons;
      delete($transcript_data->{_ensemblStartExonId});
      delete($transcript_data->{_ensemblEndExonId});
      $transcript_data->{startExon} = $start_exon_offset;
      $transcript_data->{endExon} = $end_exon_offset;
      apply { delete($_->{_ensemblExonId}) } @$exons;
    }
  }
  
  say "Finding RefSeq identifiers.";
  
  $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT g.id, tr.stable_id, x.display_label
FROM external_db xdb
CROSS JOIN interesting_genes g
CROSS JOIN transcript tr ON tr.gene_id = g.gene_id
CROSS JOIN object_xref ox ON ox.ensembl_id = tr.transcript_id AND ox.ensembl_object_type = 'Transcript'
CROSS JOIN xref x on x.xref_id = ox.xref_id AND x.external_db_id = xdb.external_db_id
WHERE xdb.db_name = 'RefSeq_mRNA'
ORDER BY g.id ASC, tr.stable_id ASC, x.display_label
__ENDSQL__

  $statement->execute() or die($dbh->errstr());
  while (my ($stable_id, $transcript_stable_id, $refseq_id) = $statement->fetchrow_array()) {
    croak if (! exists($gene_data->{$stable_id}));
    my $transcript = $gene_data->{$stable_id}->{transcripts}->{$transcript_stable_id};
    push @{$transcript->{refSeqId}}, $refseq_id;
  }
  
  say "Finding domains.";

  $statement = $dbh->prepare(<<__ENDSQL__) or die($dbh->errstr());
SELECT g.id, tr.stable_id, pf.seq_start, pf.seq_end, pf.hit_name, pf.score, pf.evalue, pf.perc_ident, pf.external_data, a.gff_source, ip.interpro_ac, x.description
FROM interesting_genes g
JOIN transcript tr ON tr.gene_id = g.gene_id
JOIN translation tl ON tl.transcript_id = tr.transcript_id
JOIN protein_feature pf ON pf.translation_id = tl.translation_id
JOIN analysis a ON pf.analysis_id = a.analysis_id
LEFT JOIN interpro ip ON pf.hit_name = ip.id
LEFT JOIN xref x ON x.external_db_id = (SELECT external_db_id FROM external_db WHERE db_name = 'Interpro')
AND x.dbprimary_acc = ip.interpro_ac
__ENDSQL__
  
  $statement->execute() or die($dbh->errstr());
  while (my ($stable_id, $transcript_stable_id, 
         $seq_start, $seq_end, $hit_name, $score, $evalue, $perc_ident, $external_data,
         $gff_source, $interpro, $description) = $statement->fetchrow_array()) {
    croak if (! exists($gene_data->{$stable_id}));
    my $transcript = $gene_data->{$stable_id}->{transcripts}->{$transcript_stable_id};
    my $domain = {
      start => $seq_start,
      end => $seq_end,
      hitName => $hit_name,
      gffSource => $gff_source,
      (defined($score) ? (score => $score) : ()),
      (defined($evalue) ? (evalue => $evalue) : ()),
      (defined($perc_ident) ? (perc_ident => $perc_ident) : ()),
      (defined($external_data) ? (external_data => $external_data) : ()),
      ($interpro ? (interproId => $interpro, description => $description) : ())
    };
    push @{$transcript->{domains}}, $domain;
  }
  
  # This is where we revise the transcript data, using a subfield for the list of transcripts,
  # sorted in order, and a canonical identifier with that transcript first. We do this as a 
  # post process, because using an associative array (aka hash) makes the Perl code very much 
  # easier. 
  
  say "Finalizing transcripts.";
  foreach my $gene (keys %$gene_data) {
    my $transcripts = $gene_data->{$gene}->{transcripts};
    my @transcript_identifiers = sort { $transcripts->{$b}->{isCanonical} <=> $transcripts->{$a}->{isCanonical} || $a cmp $b } keys %$transcripts;
    my $transcript_records = [];
    foreach my $identifier (@transcript_identifiers) {
      my $record = $transcripts->{$identifier};
      $record->{id} = $identifier;
      push @$transcript_records, $record;
    };
    
    foreach my $transcript (@$transcript_records) {
      calculate_transcript_values($transcript);
    };
    
    $gene_data->{$gene}->{transcripts} = {
      canonicalTranscriptId => $transcript_records->[0]->{id},
      records => $transcript_records
    };
  }
  
  $self->close_working_database();
  
  return $gene_data;
}

# This calculates the amino acid length. The algorithm probably ought to be correct, but
# it isn't matching the web data precisely. Where the problem lies is not yet clear. 
# However, my tests show the issue is at most one off, which is not really that 
# significant. We ought to get someone to check and the code this better some time. 

sub calculate_transcript_values {
  my ($transcript) = @_;
  
  my $start_exon = $transcript->{startExon};
  my $end_exon = $transcript->{endExon};
  my $exons = $transcript->{exons};
  my @transcribed = @$exons[$start_exon..$end_exon];
  
  my $length = 0;
  if ($#transcribed == 0) {
    $length += ($transcript->{seqExonEnd} - $transcript->{seqExonStart} + 1);
  } else {
    $length += ($transcribed[0]->{end} - $transcribed[0]->{start} + 1 - $transcript->{seqExonStart} + 1);
    $length += $transcript->{seqExonEnd};
    foreach my $exon (@transcribed[1..($#transcribed - 1)]) {
      $length += ($exon->{end} - $exon->{start} + 1);
    }
  }
  
  $transcript->{lengthAminoAcid} = int($length / 3);
  $transcript->{lengthDNA} = $length;
  return $transcript;
}

1;
