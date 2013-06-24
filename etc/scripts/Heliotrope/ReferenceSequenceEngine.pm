package Heliotrope::ReferenceSequenceEngine;

use common::sense;

use Moose;

use File::Spec;
use File::HomeDir;
use File::Temp;
use IO::CaptureOutput qw(capture);

use Bio::DB::Fasta;

has reference_fh => (
    is  => 'rw'
);

has reference_requests => (
    is  => 'rw'
);

has fasta_directory => (
    is  => 'rw'
);

sub clear {
    my ($self) = @_;
    $self->reference_requests([]);
    $self->fasta_directory($ENV{HELIOTROPE_FASTA_DIRECTORY} || File::Spec->rel2abs("fasta", File::HomeDir->my_home()));
}

sub BUILD {
    my ($self) = @_;
    $self->clear();
}

sub add_reference_sequence_request {
    my ($self, $chromosome, $start, $stop) = @_;
    push @{$self->reference_requests()}, [$chromosome, $start, $stop];
}

sub get_reference_sequences {
    my ($self, $callback) = @_;
    
    my $fasta_dir = $self->fasta_directory();
    my $db = Bio::DB::Fasta->new($fasta_dir);

    foreach my $request (@{$self->reference_requests()}) {
        my $chromosome = $request->[0];
        $chromosome =~ s{^chr}{};
        my $start = $request->[1];
        my $stop = $request->[2];
        my $reference_allele = $db->seq($chromosome, $start, $stop);
        &$callback($chromosome, $start, $stop, $reference_allele);
    }
}

1;

=head1 NAME

Heliotrope::ReferenceSequenceEngine

=head1 SYNOPSIS

  use Heliotrope::ReferenceSequenceEngine;
  
  my $engine = Heliotrope::ReferenceSequenceEngine->new();
  $engine->add_reference_sequence_request('1', 2000, 2002);
  $engine->add_reference_sequence_request('X', 2000, 2002);
  
  $engine->get_reference_sequences(sub { 
      my ($ch, $start, $stop, $reference_allele) = @_; 
      say "$ch, $start, $stop, $reference_allele";
  });

=head1 DESCRIPTION

Abstracts logic to find a reference sequence for a part of a chromosome. This
is used when the data we have does not include a reference sequence, just
variant information -- or when we cannot trust the reference sequence
that we do have. 

The API is designed to allow a batch script to process a large number of 
requests. It is not a good idea to assume that there is any ordering applied
consistently to the results. All that can be assumed is that we *might*
get back the corresponding chromosome section back.

Note that chromosomes are coded 1 to 22, X, Y, MT.

=head1 NOTES

Originally implemented as a thin wrapper around Annovar's retrieve_seq_from_fasta.pl 
script. This was replaced by direct use of BioPerl, which makes it consistent with
Ensembl, and easier to install with reasonable licensing.  

Locates fasta files using either the HELIOTROPE_FASTA_DIRECTORY enviroment variable, or in an 
"fasta" directory within the user's home directory. 

=head1 AUTHOR

Stuart Watt E<lt>stuart.watt@oicr.on.caE<gt>

=head1 COPYRIGHT AND LICENSE

This program is free software; you can redistribute it and/or modify it 
under the same terms as Perl itself.

