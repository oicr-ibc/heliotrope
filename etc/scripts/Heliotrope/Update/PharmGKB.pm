package Heliotrope::Update::PharmGKB;

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
  $self->{name} = "pharmgkb";
}

sub maybe_update {
  my ($self, $registry, %options) = @_;

  my $cached_data = $self->get_data($registry);
  my $existing = $self->get_target_file($registry, $file);
  $cached_data = {} if (! -e $existing);
  my $headers = {};

  foreach my $header (qw(If_None_Match If_Last_Modified)) {
    $headers->{$header} = $cached_data->{$file}->{$header} if (exists($cached_data->{$file}) && $cached_data->{$file}->{$header});
  }

  my $req = HTTP::Request->new(GET => $base_url, $headers);
  my ($res, $file) = $self->get_resource($registry, $req);

  if ($res->is_success) {
    $cached_data->{$file}->{If_None_Match} = $res->header('ETag');
    $cached_data->{$file}->{If_Last_Modified} = $res->header('Modified');
    $cached_data->{download_time} = DateTime->now()->iso8601();
    $self->set_data($registry, $cached_data);
    return 1;
  } elsif ($res->code() eq '304') {
    return;
  }
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

sub output {
  my ($self, $registry) = @_;

}

1;