package Heliotrope::Update::DrugBank;

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
use URI;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

sub BUILD {
  my ($self) = @_;
  $self->{name} = "drugbank";
}

sub maybe_update {
  my ($self, $registry, %options) = @_;

  my $base_url = URI->new("http://www.drugbank.ca/system/downloads/current/");
  my $file_url = URI->new_abs("drugbank.xml.zip", $base_url);

  my @file_segments = $file_url->path_segments();
  my $file = $file_segments[-1];

  my $cached_data = $self->get_data($registry);
  my $existing = $self->get_target_file($registry, $file);
  $cached_data = {} if (! -e $existing);
  my $headers = [];

  foreach my $header (qw(If_None_Match If_Last_Modified)) {
    push @$headers, $header => $cached_data->{$file}->{$header} if (exists($cached_data->{$file}) && $cached_data->{$file}->{$header});
  }

  $DB::single = 1;
  my $req = HTTP::Request->new(GET => $file_url, $headers);
  my ($res, $downloaded_file) = $self->get_resource($registry, $req);

  if ($res->is_success) {
    $cached_data->{$file}->{If_None_Match} = $res->header('ETag');
    $cached_data->{$file}->{If_Last_Modified} = $res->header('Modified');
    $cached_data->{download_time} = DateTime->now()->iso8601();
    $self->relocate_file($registry, $downloaded_file, $file);
    $self->set_data($registry, $cached_data);
    return 1;
  } elsif ($res->code() eq '304') {
    return;
  }
}

sub update {
  my ($self, $registry) = @_;

  # my $xc = XML::LibXML::XPathContext->new();
  # $xc->registerNs('t', 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#');
  # $xc->registerNs('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
  # $xc->registerNs('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
  # $xc->registerNs('owl', 'http://www.w3.org/2002/07/owl#');

  # my $context = {};
  # $context->{isa} = Graph->new(directed => 1);

  say "About to update.";
  # my $data_file = $self->get_target_file($registry, "Thesaurus_OWL-byName.zip");
  # _scan_file($self, $data_file, $xc, $context, \&entry_pass_1);

  # $DB::single = 1;
  $self->output($registry);
}

sub output {
  my ($self, $registry) = @_;

}

1;