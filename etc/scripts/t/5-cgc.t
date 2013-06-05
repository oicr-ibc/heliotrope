#!/usr/bin/env perl -w

use common::sense;

use Test::More;
use Heliotrope::Registry;
use Heliotrope::Update::CGC;

my $reg = Heliotrope::Registry->instance();

ok($reg->cache_root());
ok($reg->data());

my $updater = Heliotrope::Update::CGC->new();

ok($updater->maybe_update($reg));

done_testing();

1;