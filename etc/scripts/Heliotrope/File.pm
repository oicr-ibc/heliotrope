package Heliotrope::File;

use common::sense;

use File::Spec;
use File::HomeDir;
use LWP::UserAgent;
use HTTP::Request;
use File::Temp;

use Sub::Exporter -setup => {
    exports => [ qw(get_request) ],
};

sub get_request {
	my ($req) = @_;
	
	my $tmp = File::Temp->new(UNLINK => 0, SUFFIX => '.dat');
	my $filename = $tmp->filename;
	
	my $ua = LWP::UserAgent->new();
	
	my $response = $ua->request($req, $filename);
	return ($response, $filename);
}

1;
