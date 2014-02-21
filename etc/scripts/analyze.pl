#!/usr/bin/env perl -w

use common::sense;

use Getopt::Long;
use FindBin;

BEGIN {
	use lib "$FindBin::Bin";
}

use Heliotrope::Registry;
use Heliotrope::Analyse::Publications;

my $analyzer = Heliotrope::Analyse::Publications->new();
$analyzer->analyse();

1;
