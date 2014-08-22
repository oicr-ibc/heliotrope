package Heliotrope::Data;

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
use Scalar::Util qw(blessed reftype);
use Convert::Scalar;
use Clone qw(clone);

use Sub::Exporter -setup => {
    exports => [ qw(resolve_references expand_references deep_eq) ],
};

# Checks to see if two structures are the same. This ignores private fields.
# Note that a hash and a Tie::IxHash, even with the same fields and values,
# will be found to be different. So only use hashes with this, at least for
# now.

sub expand_references_aux {
	my ($document, $top) = @_;

	if (ref($document) eq 'ARRAY') {
		return [ map { expand_references_aux($_, $top) } @$document ]
	} elsif (ref($document) eq 'HASH') {
		return { map {
			my $key = $_;
			my $value = $document->{$key};
			my $tag = substr($key, -4);
			if ($tag eq 'Ridx') {
        my $collection = $key;
        $collection =~ s{([a-z])([A-Z])}{$1_\l$2}gr;
        my $reference = $top->{references}->[$value];
        (substr($key, 0, -4) . "Refx", $reference->{name});
      } else {
		    ($key => expand_references_aux($value, $top));
      }
		} sort keys %$document }
	} else {
		return $document;
	}
}

sub expand_references {
    my ($document) = @_;

    my $result = expand_references_aux($document, $document);
    delete($result->{references});
    return $result;
}

sub resolve_references {
	my ($document, $original) = @_;

	my $table = {};
	my $references = [];
	if (exists($original->{references})) {
    	foreach my $reference (@{$original->{references}}) {
	   	    my ($ref, $name, $id) = @{$reference}{qw(ref name _id)};
		    $table->{$ref}->{$name} = {ref => $ref, name => $name, _id => $id};
	    }
	}
	$table->{_}->{_} = {index => 0};

	my $result = resolve_references_aux($document, $references, $table);

	# Remove the indexes we used while building the table
	foreach my $reference (@$references) {
		delete($reference->{_index});
	}

	# And add the filtered table back into the result
	$result->{references} = $references;
	return $result;
}

sub resolve_reference_key {
  my ($document, $references, $table, $key) = @_;

  my $value = (ref($document) eq 'HASH') ? $document->{$key} : $document->FETCH($key);
  my $tag = substr($key, -4);
  if ($tag eq 'Refx') {
    my $collection = substr($key, 0, -4);
    $collection =~ s/([a-z])([A-Z])/$1_\l$2/g;

    my $reference;
    if (exists($table->{$collection}->{$value})) {
      $reference = $table->{$collection}->{$value};
    } else {
      $reference = {ref => $collection, name => $value};
      $table->{$collection}->{$value} = $reference;
    }

    if (! exists($reference->{_index})) {
      my $current = $table->{_}->{_};
      push @$references, $reference;
      $reference->{_index} = $current->{index}++;
    }

    (substr($key, 0, -4) . "Ridx", $reference->{_index});
  } else {
    ($key => resolve_references_aux($value, $references, $table));
  }
}

sub resolve_references_aux {
    my ($document, $references, $table) = @_;

    if (ref($document) eq 'ARRAY') {
        return [ map { resolve_references_aux($_, $references, $table) } @$document ]
    } elsif (ref($document) eq 'HASH') {
        return { map { resolve_reference_key($document, $references, $table, $_); } sort keys %$document }
    } elsif (ref($document) eq 'Tie::IxHash') {
        return { map { resolve_reference_key($document, $references, $table, $_); } sort $document->Keys() }
    } else {
        return $document;
    }
}

sub deep_eq {
    my ($a, $b) = @_;

    if (not defined $a)        { return not defined $b }
    elsif (not defined $b)     { return 0 }
    elsif (not reftype($a))         { $a eq $b }
    elsif ($a eq $b)           { return 1 }
    elsif (reftype($a) ne reftype $b)   { return 0 }
    elsif (reftype($a) eq 'SCALAR') { $$a eq $$b }
    elsif (reftype($a) eq 'ARRAY')  {
        if (@$a == @$b) {
            for (0..$#$a) {
                my $rval;
                return $rval unless ($rval = deep_eq($a->[$_], $b->[$_]));
            }
            return 1;
        }
        else { return 0 }
    }
    elsif (reftype($a) eq 'HASH')   {
        my @keysa = grep { substr($_, 0, 1) ne '_' } keys %$a;
        my @keysb = grep { substr($_, 0, 1) ne '_' } keys %$b;
        if (@keysa == @keysb) {
            for (@keysa) {
                my $rval;
                return $rval unless ($rval = deep_eq($a->{$_}, $b->{$_}));
            }
            return 1;
        }
        else { return 0 }
    }
    elsif (reftype($a) eq reftype($b))   { warn 'Cannot test '.(ref $a)."\n"; undef }
    else                       { return 0 }
}

1;