#!/usr/bin/env perl -w

use common::sense;

use Test::More;
use Heliotrope::Registry;
use Heliotrope::Update::Annovar;

my $reg = Heliotrope::Registry->instance();

ok($reg->cache_root());
ok($reg->data());

my $updater = Heliotrope::Update::Annovar->new();

#ok($updater->maybe_update($reg));

ok($updater->output($reg));

#ok($updater->analyze_results($reg, "/var/folders/j5/6883cpn94mbct49b44v87n7w0000gp/T/9hTJvTsDLv"));

done_testing();

1;