package Heliotrope::Update::Boot;

use common::sense;

use boolean;
use Tie::IxHash;
use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';
with 'Heliotrope::WorkingDatabase';

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
	
	say "Initializing indexes";
    my $dbh = $self->open_database();
    
    foreach my $collection ("genes", "variants", "tissue_types", "histology_types", "tumour_types") {
        $self->ensure_index($dbh, $collection, Tie::IxHash->new("name" => 1), { unique => true, safe => true });
    }
    
    $self->ensure_index($dbh, "genes", Tie::IxHash->new("id" => 1), { unique => true, safe => true });
	$self->close_database($dbh);
}

1;
