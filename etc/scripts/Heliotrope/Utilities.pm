package Heliotrope::Utilities;

use common::sense;

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
    Ter => "Q"
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
  }
}

1;