#!/usr/bin/env perl -w

use common::sense;

use Test::More;
use Data::Dump qw(dump);

use MongoDB::OID;
use DateTime;
use Scalar::Util qw(blessed);

use Heliotrope::Data qw(resolve_references expand_references deep_eq);

my $doc1 = {
  chromosome        => "3",
  geneRefx          => "KRAS",
  start             => 178936082,
  stop              => 178936082,
  sections          => [
    {id             => "consequence",
     _format        => "consequence",
     data           => {consequence => "activating", publicationRefx => "pmid:15329413"}},
    {id             => "clinical",
     _format        => "clinical",
     data           => [{tumourTypeRefx => "lung carcinoma", study_type => "prospective", publicationRefx => "pmid:16785471", comment => "XXX" },
                        {tumourTypeRefx => "lung neoplasm", study_type => "retrospective", publicationRefx => "pmid:15329413", comment => "XXX" }]}
  ]};
  
# First, let's test resolving references. This is what builds the reference table. 

my $result1 = resolve_references($doc1, {});

ok(exists($result1->{references}));
is(@{$result1->{references}}, 5);
is($result1->{references}->[0]->{name}, "KRAS");
is($result1->{references}->[0]->{ref}, "gene");
is($result1->{references}->[1]->{name}, "pmid:15329413");
is($result1->{references}->[1]->{ref}, "publication");
is($result1->{references}->[2]->{name}, "pmid:16785471");
is($result1->{references}->[2]->{ref}, "publication");
is($result1->{references}->[3]->{name}, "lung carcinoma");
is($result1->{references}->[3]->{ref}, "tumour_type");
is($result1->{references}->[4]->{name}, "lung neoplasm");
is($result1->{references}->[4]->{ref}, "tumour_type");

# Check that we can preserve identifiers from a previous version of the document.
# Identifiers may need to be resolved later. 

my $result2 = resolve_references($doc1, {references => [{ref => "gene", name => "KRAS", _id => "0123456789"}]});
ok(exists($result2->{references}));
is(@{$result2->{references}}, 5);
is($result2->{references}->[0]->{name}, "KRAS");
is($result2->{references}->[0]->{ref}, "gene");
is($result2->{references}->[0]->{_id}, "0123456789");

# Be sure that a reference that we don't use from the original is properly removed and
# not present in the resolved version.

my $result3 = resolve_references($doc1, {references => [{ref => "gene", name => "EGFR", _id => "0123456789"}]});
ok(exists($result3->{references}));
is(@{$result3->{references}}, 5);

# Now let's check that we can expand references. This also results in a revised
# document, without the reference table in it. 

my $result4 = expand_references($result2);

ok(exists($result4->{geneRefx}));
is($result4->{geneRefx}, "KRAS", "Got KRAS");
is($result4->{sections}->[0]->{data}->{publicationRefx}, "pmid:15329413", "Got pmid:15329413");
is($result4->{sections}->[1]->{data}->[0]->{publicationRefx}, "pmid:16785471", "Got pmid:16785471");
is($result4->{sections}->[1]->{data}->[0]->{tumourTypeRefx}, "lung carcinoma", "Got lung carcinoma");
ok(! exists($result4->{references}));

# And this is our testing the deep comparison which ignores/skips private fields.

ok(deep_eq({a => 1, b => 2, c => {d => 3}}, {a => 1, b => 2, c => {d => 3}}));
ok(! deep_eq({a => 1, b => 2, c => {d => 3}}, {a => 1, b => 2, c => {d => 4}}));
ok(deep_eq({a => 1, b => 2, c => {d => 3}}, {a => 1, b => 2, c => {d => 3}, _e => 5}));
ok(deep_eq({a => 1, b => 2, c => {d => 3}, _e => 5}, {a => 1, b => 2, c => {d => 3}}));
ok(deep_eq({a => 1, b => 2, c => {d => 3}, _e => {f => 6}}, {a => 1, b => 2, c => {d => 3}}));
ok(deep_eq($result1, $result2));

# Regression issue. If one of the fields is a MongoDB::OID, we need to make sure
# we get one back. Same for a DateTime. 

my $doc2 = {
  _id               => MongoDB::OID->new(value => "0123456789012345"),
  chromosome        => "3",
  geneRefx          => "KRAS",
  time              => DateTime->now(),
};

my $result5 = resolve_references($doc2, {});

ok(blessed($result5->{_id}) && $result5->{_id}->isa("MongoDB::OID"), "Got MongoDB::OID");
ok(blessed($result5->{_id}) && $result5->{time}->isa("DateTime"), "Got DateTime");

done_testing();

1;