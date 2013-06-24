#!/usr/bin/env perl -w

use common::sense;

use Test::More;

use Heliotrope::ReferenceSequenceEngine;

my $engine = Heliotrope::ReferenceSequenceEngine->new();
$engine->add_reference_sequence_request("3", 178936082, 178936082);

my $output = [];

$engine->get_reference_sequences(sub {
    my @result = @_;
    push @$output, \@result;
});

is(@$output, 1, "Right number of results");
is($output->[0]->[0], "3", "Correct chromosome");
is($output->[0]->[1], 178936082, "Correct start");
is($output->[0]->[2], 178936082, "Correct stop");
is($output->[0]->[3], "G", "Correct reference allele");

$engine->clear();
$engine->add_reference_sequence_request("2", 179480448, 179480450);

$output = [];
$engine->get_reference_sequences(sub {
    my @result = @_;
    push @$output, \@result;
});

is(@$output, 1, "Right number of results");
is($output->[0]->[0], "2", "Correct chromosome");
is($output->[0]->[1], 179480448, "Correct start");
is($output->[0]->[2], 179480450, "Correct stop");
is($output->[0]->[3], "AAT", "Correct reference allele");

$engine->clear();
$engine->add_reference_sequence_request("X", 1480448, 1480450);

$output = [];
$engine->get_reference_sequences(sub {
    my @result = @_;
    push @$output, \@result;
});

is(@$output, 1, "Right number of results");
is($output->[0]->[0], "X", "Correct chromosome");
is($output->[0]->[1], 1480448, "Correct start");
is($output->[0]->[2], 1480450, "Correct stop");
is($output->[0]->[3], "GCC", "Correct reference allele");

done_testing();

1;
