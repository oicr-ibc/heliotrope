#!/usr/bin/env perl -w

use common::sense;

use Test::More;
use Heliotrope::Registry;
use Heliotrope::Update::COSMIC;

my $reg = Heliotrope::Registry->instance();

ok($reg->cache_root());
ok($reg->data());

my $updater = Heliotrope::Update::COSMIC->new();

ok($updater->maybe_update($reg));

done_testing();

1;