#!/usr/bin/env perl -w

## Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
##
## This program and the accompanying materials are made available under the terms of the GNU Public
## License v3.0. You should have received a copy of the GNU General Public License along with this
## program. If not, see <http://www.gnu.org/licenses/>.
##
## THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
## IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
## FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
## CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
## DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
## DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
## WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
## WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

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
