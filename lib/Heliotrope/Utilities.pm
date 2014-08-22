package Heliotrope::Utilities;

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
use Carp;

use Sub::Exporter -setup => {
    exports => [ qw(convert_names_to_codes convert_codes_to_names convert_sequence trim eq_deeply merge_into_deeply) ],
};

my $amino_acid_codes = {
    Ala => "A",
    Arg => "R",
    Asn => "N",
    Asp => "D",
    Cys => "C",
    Gln => "Q",
    Glu => "E",
    Gly => "G",
    His => "H",
    Ile => "I",
    Leu => "L",
    Lys => "K",
    Met => "M",
    Phe => "F",
    Pro => "P",
    Ser => "S",
    Thr => "T",
    Trp => "W",
    Tyr => "Y",
    Val => "V",
    Ter => "X"
};

my $amino_acid_names = { reverse %$amino_acid_codes };

sub convert_names_to_codes {
	my ($string) = @_;
	my $pattern = join("|", keys %$amino_acid_codes);
	return $string =~ s{($pattern)}{$amino_acid_codes->{$1}}gr;
}

sub convert_codes_to_names {
    my ($string) = @_;
    my $pattern = join("|", keys %$amino_acid_names);
    return $string =~ s{($pattern)}{$amino_acid_names->{$1}}gr;
}

sub convert_sequence {
    my ($strand, $sequence) = @_;
    if ($strand == 1) {
        return $sequence;
    } else {
        return reverse($sequence =~ tr/ACGT/TGCA/r);
    }
}

sub trim {
    my ($value) = @_;
    $value =~ s{^\s+}{};
    $value =~ s{\s+$}{};
    return $value;
}

sub eq_deeply {
  my ($obj1, $obj2) = @_;
  my $ref1 = ref($obj1);
  my $ref2 = ref($obj2);
  return 0 if ($ref1 ne $ref2);
  if ($ref1 eq 'ARRAY') {
    my $len1 = $#$obj1;
    return 0 if ($len1 != $#$obj2);
    for(my $i = 0; $i <= $len1; $i++) {
      return 0 unless (eq_deeply($obj1->[$i], $obj2->[$i]));
    }
    return 1;
  } elsif ($ref1 eq 'HASH') {
    my @keys1 = keys %$obj1;
    my $keys2 = keys %$obj2;
    return 0 unless (@keys1 == $keys2);
    foreach my $key1 (@keys1) {
      return 0 if (! exists($obj2->{$key1}));
      return 0 unless (eq_deeply($obj1->{$key1}, $obj2->{$key1}));
    }
    return 1;
  } else {
    return $obj1 eq $obj2;
  }
}

sub merge_into_deeply {
  my ($obj1, $obj2) = @_;
  my $ref1 = ref($obj1);
  if ($ref1 eq 'HASH') {
    my @keys2 = keys %$obj2;
    foreach my $key2 (@keys2) {
      if (exists($obj1->{$key2})) {
        merge_into_deeply($obj1->{$key2}, $obj2->{$key2});
      } else {
        $obj1->{$key2} = $obj2->{$key2};
      }
    }
  } else {
    croak("Can't merge: $obj1 and $obj2");
  };
  return $obj1;
}

1;