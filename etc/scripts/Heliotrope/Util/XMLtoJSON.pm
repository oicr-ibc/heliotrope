package Heliotrope::Util::XMLtoJSON;

use common::sense;

use Moose;

has element_list_entries => (
  is => 'rw'
);
has object_list_entries => (
  is => 'rw'
);
has date_list_entries => (
  is => 'rw'
);

sub convert_document_to_json {
    my ($self, $element, $path) = @_;
    $path //= "";

    my $result = Tie::IxHash->new();

    my @children = $element->findnodes("*");
    my @attributes = $element->findnodes("@*");
    foreach my $child (@children) {

        foreach my $attr (@attributes) {
            $result->STORE($attr->nodeName(), $attr->getValue());
        }

        my $field = $child->nodeName();
        my $new_path = $path . "/" . $field;
        my $child_result = convert_document_to_json($child, $new_path);

        if ($element_list_entries->{$new_path}) {
            if (! $result->EXISTS($field)) {
                $result->STORE($field, []);
            }
            my $list = $result->FETCH($field);
            push @$list, $child_result;
        } else {
            if ($result->EXISTS($field)) {
                carp("Duplicate entry in: $new_path, " . $element->toString());
            }
            $result->STORE($field, $child_result);
        }
        if ($date_list_entries->{$new_path}) {
            my $date = $result->FETCH($field);
            my $datetime = DateTime->new(year => $date->FETCH('Year'), month => $date->FETCH('Month'), day => $date->FETCH('Day'), time_zone => "UTC");
            $result->STORE($field, $datetime);
        }
    }
    if (! @children && defined($element->textContent())) {

        if (@attributes || $object_list_entries->{$path}) {
            foreach my $attr (@attributes) {
                $result->STORE($attr->nodeName(), $attr->textContent());
            }
            $result->STORE('value', $element->textContent());
        } else {
            return $element->textContent();
        }
    } else {
        foreach my $attr (@attributes) {
            $result->STORE($attr->nodeName(), $attr->getValue());
        }
    }
    return $result;
}

1;