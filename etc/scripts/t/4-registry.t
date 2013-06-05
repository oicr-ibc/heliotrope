#!/usr/bin/env perl -w

use common::sense;

use Test::More;
use Heliotrope::Registry;

my $reg = Heliotrope::Registry->instance();

ok($reg->cache_root());
ok($reg->data());

done_testing();