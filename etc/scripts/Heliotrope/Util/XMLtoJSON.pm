package Heliotrope::Util::XMLtoJSON;

use common::sense;

use Moose;

use Carp;
use Tie::IxHash;
use DateTime;
use XML::LibXML;

has element_list_entries => (
  is => 'rw'
);
has object_list_entries => (
  is => 'rw'
);
has date_list_entries => (
  is => 'rw'
);
has ordered_objects => (
  is => 'rw',
  default => sub { 1; }
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
  return _convert($self, $element, $path, $self->ordered_objects(), $self->element_list_entries(), $self->date_list_entries(), $self->object_list_entries());
}

sub _convert {
  my ($self, $element, $path, $ordered, $element_list_entries, $date_list_entries, $object_list_entries) = @_;
  $path //= "";

  my $result = ($ordered) ? Tie::IxHash->new() : {};

  my @children = $element->findnodes("*");
  my @attributes = $element->findnodes("@*");
  foreach my $child (@children) {

    foreach my $attr (@attributes) {
      _store($result, $ordered, $attr->nodeName(), $attr->getValue())
    }

    my $field = $child->nodeName();
    my $new_path = $path . "/" . $field;
    my $child_result = _convert($self, $child, $new_path, $ordered, $element_list_entries, $date_list_entries, $object_list_entries);

    if ($element_list_entries->{$new_path}) {
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
    if ($self->date_list_entries()->{$new_path}) {
      my $date = _fetch($result, $ordered, $field);
      my $year = _fetch($date, $ordered, 'Year');
      my $month = _fetch($date, $ordered, 'Month');
      my $day = _fetch($date, $ordered, 'Day');
      my $datetime = DateTime->new(year => $year, month => $month, day => $day, time_zone => "UTC");
      _store($result, $ordered, $field, $datetime);
    }
  }
  if (! @children && defined($element->textContent())) {

    if (@attributes || $self->object_list_entries()->{$path}) {
      foreach my $attr (@attributes) {
        _store($result, $ordered, $attr->nodeName(), $attr->textContent());
      }
      _store($result, $ordered, 'value', $element->textContent());
    } else {
      return $element->textContent();
    }
  } else {
    foreach my $attr (@attributes) {
      _store($result, $ordered, $attr->nodeName(), $attr->getValue());
    }
  }
  return $result;
}

1;