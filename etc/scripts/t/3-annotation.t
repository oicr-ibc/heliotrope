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

use Heliotrope::AnnotationEngine;

my $engine = Heliotrope::AnnotationEngine->new();
$engine->add_annotation_request("3", 178936082, 178936082, "G", "A", "+");

my $result = $engine->get_annotations();

ok($result, "Got some data for PIK3CA g:178936082-178936082G>A");
ok(keys %$result, "Really got some data");

my ($found) = keys %$result;
is($found, "ENSG00000121879:p.Glu542Lys", "Got the right variant");
is($result->{$found}->[0]->[0]->{amino_acid_change}, "E/K", "Correct amino acid change");
is($result->{$found}->[0]->[0]->{protein_position}, 542, "Correct codon");
is($result->{$found}->[0]->[0]->{consequence}, "missense_variant", "Correct variant type");
is($result->{$found}->[0]->[0]->{extra}->{CANONICAL}, "YES", "Correct canonicality");
like($result->{$found}->[0]->[0]->{colocated}, qr/COSM760/, "Found COSMIC id 760");

$engine->clear();
$engine->add_annotation_request("12", 25398284, 25398284, "G", "A", "-");

$result = $engine->get_annotations();
($found) = keys %$result;
is($found, "ENSG00000133703:p.Gly12Asp", "Got the right variant");
is($result->{$found}->[0]->[0]->{amino_acid_change}, "G/D", "Correct amino acid change");
is($result->{$found}->[0]->[0]->{protein_position}, 12, "Correct codon");
is($result->{$found}->[0]->[0]->{consequence}, "missense_variant", "Correct variant type");
is($result->{$found}->[0]->[0]->{extra}->{CANONICAL}, "YES", "Correct canonicality");
like($result->{$found}->[0]->[0]->{colocated}, qr/COSM520/, "Found COSMIC id 520");

done_testing();

1;
