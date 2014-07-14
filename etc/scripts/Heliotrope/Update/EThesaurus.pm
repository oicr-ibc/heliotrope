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

  say "About to update.";
  my $data_file = $self->get_target_file($registry, "Thesaurus_OWL-byName.zip");
  my $zip = IO::Uncompress::Unzip->new($data_file);
  die "Zipfile has no members" if ! defined $zip->getHeaderInfo;

  for (my $status = 1; $status > 0; $status = $zip->nextStream) {
    my $name = $zip->getHeaderInfo->{Name};
    say "Processing member $name" ;

    my $reader = XML::LibXML::Reader->new(IO => $zip);
    my $first = 1;
    my $whole;
    my $attributes = {};

    while($reader->read()) {
      say $reader->name();
      last if ($reader->name() eq 'owl:Ontology');
    };

    do {
      entry($self, $reader) if ($reader->nodeType() == XML_READER_TYPE_ELEMENT);
    } while($reader->nextSibling());
  }

  $self->output($registry);
}

sub entry {
  my ($self, $reader) = @_;
  my $xml = $reader->readOuterXml();
  my $dom = XML::LibXML->load_xml(string => $xml, clean_namespaces => 1);
  my $root = $dom->documentElement();

  my $about = $root->getAttribute("rdf:about");
  say "$about";
  return "";
}

sub output {
  my ($self, $registry) = @_;

}

1;