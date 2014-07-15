package Heliotrope::Update::EThesaurus;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use File::Slurp;
use File::Listing qw(parse_dir);
use XML::LibXML;
use XML::LibXML::Reader;
use IO::Uncompress::Unzip;
use HTTP::Request;
use DateTime;
use Graph;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

sub BUILD {
  my ($self) = @_;
  $self->{name} = "ethesaurus";
}

sub maybe_update {
  my ($self, $registry, %options) = @_;

  my $base_url = "http://evs.nci.nih.gov/ftp1/NCI_Thesaurus/";
  my $req = HTTP::Request->new(GET => $base_url);
  $req->header(Accept => "text/ftp-dir-listing, */*;q=0.1");
  my ($result, $file) = $self->get_resource($registry, $req);
  my $listing = read_file($file);

  my @records = parse_dir($listing, undef, 'apache');
  my (@versions) = grep { $_->[0] =~ m{^Thesaurus_(.*)\.OWL-byName\.zip$} } @records;
  @versions = sort { $b->[3] <=> $a->[3] } @versions;

  my $selected = $versions[0];
  say "Selecting: $selected->[0]";

  my $dt = DateTime->from_epoch(epoch => $selected->[3]);
  my $normalized_date = $dt->format_cldr("yyyy-MM-dd");
  say "Normalized: $normalized_date.";

  my $cached_data = $self->get_data($registry);
  my $existing = $self->get_target_file($registry, "Thesaurus_OWL-byName.zip");
  if (! -e $existing) {
    $cached_data = {};
  }

  if (exists($cached_data->{date}) && $cached_data->{date} ge $normalized_date) {
    say "Existing file is new.";
    say "Skipping update.";
    return;
  }

  my $thesaurus_url = $base_url . $selected->[0];
  say "Downloading $thesaurus_url.";
  $req = HTTP::Request->new(GET => $thesaurus_url);
  ($result, $file) = $self->get_resource($registry, $req);
  say "Download complete.";

  # Now we can store the data file in the right place and update the cache
  $cached_data->{date} = $normalized_date;
  $cached_data->{url} = $thesaurus_url;
  $cached_data->{download_time} = DateTime->now()->iso8601();
  $cached_data->{version} = ($selected->[0] =~ m{^Thesaurus_(.*)\.OWL-byName\.zip$});
  $self->relocate_file($registry, $file, "Thesaurus_OWL-byName.zip");
  $self->set_data($registry, $cached_data);

  $self->update($registry);
}

sub update {
  my ($self, $registry) = @_;

  my $xc = XML::LibXML::XPathContext->new();
  $xc->registerNs('t', 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#');
  $xc->registerNs('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
  $xc->registerNs('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
  $xc->registerNs('owl', 'http://www.w3.org/2002/07/owl#');

  my $context = {};
  $context->{isa} = Graph->new(directed => 1);

  say "About to update.";
  my $data_file = $self->get_target_file($registry, "Thesaurus_OWL-byName.zip");
  _scan_file($self, $data_file, $xc, $context, \&entry_pass_1);

  $DB::single = 1;
  $self->output($registry);
}

sub _scan_file {
  my ($self, $data_file, $xc, $context, $handler) = @_;

  my $zip = IO::Uncompress::Unzip->new($data_file);
  die "Zipfile has no members" if ! defined $zip->getHeaderInfo;

  for (my $status = 1; $status > 0; $status = $zip->nextStream) {
    my $name = $zip->getHeaderInfo->{Name};

    my $reader = XML::LibXML::Reader->new(IO => $zip);
    my $first = 1;
    my $whole;
    my $attributes = {};

    while($reader->read()) {
      last if ($reader->name() eq 'owl:Ontology');
    };

    do {
      _call_handler($self, $reader, $xc, $context, $handler) if ($reader->nodeType() == XML_READER_TYPE_ELEMENT);
    } while($reader->nextSibling());
  }
}

sub _call_handler {
  my ($self, $reader, $xc, $context, $handler) = @_;
  my $xml = $reader->readOuterXml();
  my $dom = XML::LibXML->load_xml(string => $xml, clean_namespaces => 1);
  my $root = $dom->documentElement();
  &$handler($self, $root, $xc, $context);
}

sub entry_pass_1 {
  my ($self, $root, $xc, $context) = @_;
  return unless ($root->nodeName() eq 'owl:Class');

  my $about = $root->findvalue('@rdf:about');
  my @subclasses = map { $_->nodeValue() } $root->findnodes('rdfs:subClassOf/@rdf:resource');

  foreach my $class (@subclasses) {
    $context->{isa}->add_edge($about, $class);
  }

  # Record properties when they exist and are easily accessed
  for my $property in (qw(t:OMIM_Number t:Preferred_Name)) {
    if (my $value = $root->findvalue($property)) {
      $context->{properties}->{$about}->{$property} = $value;
    }
  }
}

## After pass 1, we can start to iterate through the context and look for all subclasses of
## a given class. This is basically a tree walk, except it might be a graph so we should
## take a little extra care.

sub output {
  my ($self, $registry) = @_;

}

1;