#!/usr/bin/env perl -w

use common::sense;

use Test::More;
use Heliotrope::Registry;
use Heliotrope::Update::Ensembl;

my $reg = Heliotrope::Registry->instance();

ok($reg->cache_root());
ok($reg->data());

my $updater = Heliotrope::Update::Ensembl->new();

ok($updater->maybe_update($reg));

done_testing();

1;