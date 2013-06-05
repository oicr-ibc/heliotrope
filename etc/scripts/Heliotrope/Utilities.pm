package Heliotrope::Utilities;

use common::sense;

use Sub::Exporter -setup => {
    exports => [ qw(convert_names_to_codes convert_codes_to_names convert_sequence trim) ],
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

1;