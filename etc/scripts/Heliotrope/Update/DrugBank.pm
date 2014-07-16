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
use IO::Compress::Deflate qw(deflate $DeflateError);

use HTTP::Request;
use DateTime;
use URI;
use JSON;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);
use Heliotrope::Util::XMLtoJSON;

my $ELEMENT_LIST_ENTRIES = {
  "/drugbank-id" => 1,
  "/go-classifiers" => 1,
  "/groups/group" => 1,
  "/packagers/packager" => 1,
  "/manufacturers/manufacturer" => 1,
  "/brands/brand" => 1,
  "/prices/price" => 1,
  "/categories/category" => 1,
  "/affected-organisms/affected-organism" => 1,
  "/dosages/dosage" => 1,
  "/mixtures/mixture" => 1,
  "/atc-codes/atc-code" => 1,
  "/atc-codes/atc-code/level" => 1,
  "/ahfs-codes/ahfs-code" => 1,
  "/patents/patent" => 1,
  "/food-interactions/food-interaction" => 1,
  "/drug-interactions/drug-interaction" => 1,
  "/sequences/sequence" => 1,
  "/experimental-properties/property" => 1,
  "/external-links/external-link" => 1,
  "/external-identifiers/external-identifier" => 1,
  "/pathways/pathway" => 1,
  "/pathways/pathway/drugs/drug" => 1,
  "/pathways/pathway/enzymes/uniprot-id" => 1,
  "/reactions/reaction" => 1,
  "/reactions/reaction/enzymes/enzyme" => 1,
  "/snp-effects/effect" => 1,
  "/snp-adverse-drug-reactions/reaction" => 1,
  "/targets/external-identifiers" => 1,
  "/targets/target" => 1,
  "/targets/target/actions/action" => 1,
  "/targets/target/polypeptide/go-classifiers/go-classifier" => 1,
  "/targets/target/polypeptide/synonyms/synonym" => 1,
  "/targets/target/polypeptide/pfams/pfam" => 1,
  "/targets/target/polypeptide/external-identifiers/external-identifier" => 1,
  "/synonyms/synonym" => 1,
  "/pfams" => 1,
  "/go-classifiers" => 1,
  "/enzymes/enzyme" => 1,
  "/enzymes/enzyme/actions/action" => 1,
  "/enzymes/enzyme/polypeptide" => 1,
  "/enzymes/enzyme/polypeptide/synonyms/synonym" => 1,
  "/enzymes/enzyme/polypeptide/pfams/pfam" => 1,
  "/enzymes/enzyme/polypeptide/go-classifiers/go-classifier" => 1,
  "/enzymes/enzyme/polypeptide/external-identifiers/external-identifier" => 1,
  "/carriers/carrier" => 1,
  "/targets/target/polypeptide" => 1,
  "/carriers/carrier/polypeptide/external-identifiers/external-identifier" => 1,
  "/carriers/carrier/polypeptide/go-classifiers/go-classifier" => 1,
  "/carriers/carrier/polypeptide/synonyms/synonym" => 1,
  "/carriers/carrier/polypeptide/pfams/pfam" => 1,
  "/transporters/transporter" => 1,
  "/transporters/transporter/actions/action" => 1,
  "/transporters/transporter/polypeptide" => 1,
  "/transporters/transporter/polypeptide/go-classifiers/go-classifier" => 1,
  "/transporters/transporter/polypeptide/external-identifiers/external-identifier" => 1,
  "/transporters/transporter/polypeptide/synonyms/synonym" => 1,
  "/transporters/transporter/polypeptide/pfams/pfam" => 1,
  "/classification/alternative-parent" => 1,
  "/classification/substituent" => 1,
  "/calculated-properties/property" => 1,
  "/salts/salt" => 1,
};
my $OBJECT_LIST_ENTRIES = {
};
my $DATE_LIST_ENTRIES = {};

sub BUILD {
  my ($self) = @_;
  $self->{name} = "drugbank";
  $self->{xmltojson} = Heliotrope::Util::XMLtoJSON->new({
    element_list_entries => $ELEMENT_LIST_ENTRIES,
    object_list_entries => $OBJECT_LIST_ENTRIES,
    date_list_entries => $DATE_LIST_ENTRIES,
    ordered_objects => 0
  });
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

  my $req = HTTP::Request->new(GET => $file_url, $headers);
  my ($res, $downloaded_file) = $self->get_resource($registry, $req);

  if ($res->is_success) {
    $cached_data->{$file}->{If_None_Match} = $res->header('ETag');
    $cached_data->{$file}->{If_Last_Modified} = $res->header('Modified');
    $cached_data->{download_time} = DateTime->now()->iso8601();
    $self->relocate_file($registry, $downloaded_file, $file);
    $self->set_data($registry, $cached_data);
    $self->update($registry);
  } elsif ($res->code() eq '304') {
    return;
  }
}

sub update {
  my ($self, $registry) = @_;

  my $xc = XML::LibXML::XPathContext->new();
  $xc->registerNs('db', 'http://www.drugbank.ca');

  my $context = {};

  say "About to update.";
  my $data_file = $self->get_target_file($registry, "drugbank.xml.zip");
  _scan_file($self, $data_file, $xc, $context, \&entry_pass_1);

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
      last if ($reader->name() eq 'drug');
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
  $DB::single = 1;

  my $json_data = $self->{xmltojson}->convert_document_to_json($root);
  my $json_string = JSON->new()->utf8(1)->encode($json_data);
  my $compressed_json_string = "";
  deflate(\$json_string, \$compressed_json_string) or die "deflate failed: $DeflateError\n";
  push @{$context->{drugs}}, $compressed_json_string;
  return;
}

sub output {
  my ($self, $registry) = @_;

}

1;