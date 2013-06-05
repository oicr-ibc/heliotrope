#!/usr/bin/env perl -w

use common::sense;

use Getopt::Long;
use FindBin;

use lib "$FindBin::Bin";

my $force;

my $result = GetOptions("force" => \$force);

use Heliotrope::Registry;
use Heliotrope::Update::CGC;

my $reg = Heliotrope::Registry->instance();

$reg->cache_root();
$reg->data();

my $updater = Heliotrope::Update::CGC->new();

if ($force) {
    $updater->update($reg);
} else {
    $updater->maybe_update($reg);
}


1;