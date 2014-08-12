package Heliotrope::Update::Statistics;

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
  $self->{name} = "statistics";
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

  $log->info("Computing statistics");
  my $database = $self->open_database();

  $database->get_collection('statistics')->ensure_index({'tag' => 1});

  $log->info("Calculating gene mutation frequencies");
  my $result = $database->get_collection('variantRecords')->aggregate([
    { '$match' => { 'mutationId' => { '$ne' => undef } } },
    { '$group' => { '_id' => '$geneId', 'frequency' => { '$sum' => 1 }, 'geneSymbol' => { '$first' => '$geneSymbol' } } },
    { '$project' => { 'name' => '$geneSymbol', 'frequency' => 1 } },
    { '$sort' => { 'frequency' => -1 } },
    { '$limit' => 250 }
  ]);

  $database->get_collection('statistics')->update({'tag' => 'gene_frequencies'}, {'$set' => {'data' => $result}}, {'upsert' => 1, 'safe' => 1});

  $self->close_database();
}

1;