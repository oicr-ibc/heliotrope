#!/usr/bin/env perl -w

use common::sense;

use Getopt::Long;
use FindBin;

use lib "$FindBin::Bin";

my $force;
my $output_only;

my $result = GetOptions("force" => \$force, "output-only" => \$output_only);

use Heliotrope::Registry;
use Heliotrope::Update::Ensembl;

my $reg = Heliotrope::Registry->instance();

$reg->cache_root();
$reg->data();

my $updater = Heliotrope::Update::Ensembl->new();

if ($output_only) {
	$updater->output($reg);
} elsif ($force) {
    $updater->update($reg);
} else {
    $updater->maybe_update($reg);
}


1;