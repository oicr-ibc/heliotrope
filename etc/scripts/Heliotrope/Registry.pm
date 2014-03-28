package Heliotrope::Registry;

use common::sense;

use File::Spec;
use File::HomeDir;
use CHI;

use MooseX::Singleton;

has data => (
    is      => 'ro',
    isa     => 'CHI',
);

has cache_root => (
    is      => 'ro',
    isa     => 'Str',
    default => sub { 
        $ENV{HELIOTROPE_CACHE_ROOT} // File::Spec->catfile(File::HomeDir->my_home, '.heliotrope');
    },
);

sub BUILD {
	my ($self) = @_;
	
	$self->{data} = CHI->new(
	   driver => 'File', 
	   root_dir => File::Spec->catfile($self->cache_root, "db")
	);
}

1;
