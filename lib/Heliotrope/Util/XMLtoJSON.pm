package Heliotrope::Util::XMLtoJSON;

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

use Moose;

use Carp;
use Tie::IxHash;
use DateTime;
use XML::LibXML;
use Scalar::Util qw(looks_like_number);

has element_hooks => (
  is => 'rw',
  default => sub { {} }
);
has element_list_entries => (
  is => 'rw',
  default => sub { {} }
);
has object_list_entries => (
  is => 'rw',
  default => sub { {} }
);
has date_list_entries => (
  is => 'rw',
  default => sub { {} }
);
has ordered_objects => (
  is => 'rw',
  default => sub { 1; }
);
has ordered => (
  is => 'rw',
  default => sub { 0; }
);

sub _store {
  my ($hash, $ordered, $key, $value) = @_;
  if ($ordered) {
    $hash->STORE($key, $value);
  } else {
    $hash->{$key} = $value;
  }
}

sub _exists {
  my ($hash, $ordered, $key) = @_;
  if ($ordered) {
    return $hash->EXISTS($key);
  } else {
    return exists($hash->{$key});
  }
}

sub _fetch {
  my ($hash, $ordered, $key) = @_;
  if ($ordered) {
    return $hash->FETCH($key);
  } else {
    return $hash->{$key};
  }
}

sub convert_document_to_json {
  my ($self, $element, $path) = @_;
  my $args = {
    ordered_objects => $self->ordered_objects(),
    element_list_entries => $self->element_list_entries(),
    date_list_entries => $self->date_list_entries(),
    object_list_entries => $self->object_list_entries(),
    element_hooks => $self->element_hooks(),
    ordered => $self->ordered(),
  };
  return _convert($self, $element, $path, $args);
}

my $month_numbers = {
  jan => 1,
  feb => 2,
  mar => 3,
  apr => 4,
  may => 5,
  jun => 6,
  jul => 7,
  aug => 8,
  sep => 9,
  oct => 10,
  nov => 11,
  dec => 12,
};

sub _convert {
  my ($self, $element, $path, $args) = @_;
  $path //= "";

  my $ordered = $args->{ordered};
  my $result = ($ordered) ? Tie::IxHash->new() : {};

  my @children = $element->findnodes("*");
  my @attributes = $element->findnodes("@*");
  foreach my $child (@children) {

    foreach my $attr (@attributes) {
      _store($result, $ordered, $attr->nodeName(), $attr->getValue())
    }

    my $field = $child->nodeName();
    my $new_path = $path . "/" . $field;
    my $child_result = _convert($self, $child, $new_path, $args);

    if ($args->{element_list_entries}->{$new_path}) {
      if (! _exists($result, $ordered, $field)) {
        _store($result, $ordered, $field, [])
      }
      my $list = _fetch($result, $ordered, $field);
      push @$list, $child_result;
    } else {
      if (_exists($result, $ordered, $field)) {
        carp("Duplicate entry in: $new_path, " . $element->toString());
      }
      _store($result, $ordered, $field, $child_result)
    }
    if ($args->{date_list_entries}->{$new_path}) {
      my $date = _fetch($result, $ordered, $field);
      my $year = _fetch($date, $ordered, 'Year');
      my $month = _fetch($date, $ordered, 'Month');
      my $day = _fetch($date, $ordered, 'Day');
      if (! looks_like_number($month)) {
        $month = $month_numbers->{lc(substr($month, 0, 3))} // croak "Failed to parse month: $month";
      }
      my $datetime = DateTime->new(year => $year, month => $month, day => $day, time_zone => "UTC");
      _store($result, $ordered, $field, $datetime);
    }
  }
  my $text = $element->textContent();
  if (defined($text) && exists($args->{element_hooks}->{$path})) {
    my $hook = $args->{element_hooks}->{$path};
    return &$hook($self, $element, $path, $args, $text);
  } elsif (! @children && defined($text)) {

    if (@attributes || $args->{object_list_entries}->{$path}) {
      foreach my $attr (@attributes) {
        _store($result, $ordered, $attr->nodeName(), $attr->textContent());
      }
      _store($result, $ordered, 'value', $text);
    } else {
      return $text;
    }
  } else {
    foreach my $attr (@attributes) {
      _store($result, $ordered, $attr->nodeName(), $attr->getValue());
    }
  }
  return $result;
}

1;