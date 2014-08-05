package Heliotrope::Update::Boot;

use common::sense;

use boolean;
use Tie::IxHash;
use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use Heliotrope::Logging qw(get_logger);

my $log = get_logger();

sub BUILD {
	my ($self) = @_;
	$self->{name} = "boot";
}

sub maybe_update {
	my ($self, $registry, %options) = @_;
	$self->update($registry);
}

sub update {
	my ($self, $registry) = @_;
	$self->output($registry);
}

sub output {
	my ($self, $registry) = @_;

	$log->info("Initializing indexes");
  my $dbh = $self->open_database();

  foreach my $collection ("genes", "variants", "tissue_types", "histology_types", "tumour_types") {
      $self->ensure_index($dbh, $collection, Tie::IxHash->new("name" => 1), { unique => true, safe => true });
  }

  ## Indexes for the genes collection
  $self->ensure_index($dbh, "genes", Tie::IxHash->new("id" => 1), { unique => true, safe => true });
  $self->ensure_index($dbh, "genes", Tie::IxHash->new("sections.transcripts.data.records.id" => 1), { unique => true, safe => true });

  ## Indexes for the variants collection
  $self->ensure_index($dbh, "variants", Tie::IxHash->new("sections.positions.data.chromosome" => 1, "sections.positions.data.position" => 1), { unique => false, safe => true });
  $self->ensure_index($dbh, "variants", Tie::IxHash->new("sections.identifiers.data.cosmic" => 1), { unique => true, safe => true });

  ## Indexes for the variantRecords collection
  $self->ensure_index($dbh, "variantRecords", Tie::IxHash->new("geneId" => 1, "sampleId" => 1, "mutationId" => 1), { unique => true, safe => true });

	$self->close_database($dbh);
}

1;
