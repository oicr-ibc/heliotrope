package Heliotrope::ReferenceSequenceEngine;

use common::sense;

use Moose;

use File::Spec;
use File::HomeDir;
use File::Temp;
use IO::CaptureOutput qw(capture);

has reference_fh => (
    is  => 'rw'
);

has reference_filename => (
    is  => 'rw'
);

has annovar_directory => (
    is  => 'rw'
);

sub clear {
	my ($self) = @_;
	
	close $self->reference_fh() if ($self->reference_fh());
	
    my $var_fh = File::Temp->new(UNLINK => 0);
    my $var_filename = $var_fh->filename();
    $self->reference_fh($var_fh);
    $self->reference_filename($var_filename);
    
    $self->annovar_directory($ENV{ANNOVAR_HOME} || File::Spec->rel2abs("annovar", File::HomeDir->my_home()));
}

sub BUILD {
	my ($self) = @_;
	$self->clear();
}

sub add_reference_sequence_request {
	my ($self, $chromosome, $start, $stop) = @_;
	my $fh = $self->reference_fh();
	say $fh join("\t", $chromosome, $start, $stop);
}

sub get_reference_sequences {
	my ($self, $callback) = @_;
	
	close $self->reference_fh();
	delete $self->{reference_fh};
	
    my $var_filename = $self->reference_filename();
    say "Deriving reference alleles: $var_filename.";
	
	my $annovar_dir = $self->annovar_directory();
    my $executable = $^X;
    my $command = ["$annovar_dir/retrieve_seq_from_fasta.pl", 
                   qw(-tabout -format tab -outfile),
                   "$var_filename.tab",
                   qw(-seqdir),
                   "$annovar_dir/humandb/hg19seq/",
                   $var_filename];
    
    # We could probably dispense with some of this. 
    my $stdout;
    my $stderr;
    my $status;
    capture {
        system($executable, @$command);
        $status = $?;
    } \$stdout, \$stderr;
    $status == 0 || croak("retrieve_seq_from_fasta.pl failed: exit status: $status; output: $stdout; error: $stderr");
    
    open(my $ref_fh, "<", "$var_filename.tab") or die("Can't open: $var_filename.tab: $!");
    while(my $line = <$ref_fh>) {
        chomp($line);
        my ($position, $reference_allele) = split("\t", $line);
        my ($chromosome, $start, $stop) = ($position =~ m{^([0-9XYMT]+):(\d+)-(\d+)$});        
        &$callback($chromosome, $start, $stop, $reference_allele);
    }
    close($ref_fh);
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

Currently implemented as a thin wrapper around Annovar's retrieve_seq_from_fasta.pl 
script, although this may change. Assumes hg19 currently. 

Locates Annovar using either the ANNOVAR_HOME enviroment variable, or in an 
"annovar" directory within the user's home directory. 

=head1 AUTHOR

Stuart Watt E<lt>stuart.watt@oicr.on.caE<gt>

=head1 COPYRIGHT AND LICENSE

This program is free software; you can redistribute it and/or modify it 
under the same terms as Perl itself.

