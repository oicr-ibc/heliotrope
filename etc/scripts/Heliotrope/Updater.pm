package Heliotrope::Updater;

use common::sense;

use Moose::Role;

use File::Temp;
use File::Spec;
use File::Path;
use File::Copy;
use LWP::UserAgent;

has 'name' => (
    is  => 'ro',
    isa => 'Str',
);

requires 'update';

sub maybe_update {
	my ($self, @args) = @_;
	$self->update(@args);
}

sub get_data {
	my ($self, $registry) = @_;
	return $registry->data()->get($self->name());
}

sub set_data {
	my ($self, $registry, $value) = @_;
	$registry->data()->set($self->name(), $value);
}

sub get_resource {
    my ($self, $registry, $req) = @_;
    
    my $tmp = File::Temp->new(UNLINK => 0, SUFFIX => '.dat');
    my $filename = $tmp->filename;
    
    my $ua = LWP::UserAgent->new();
    
    my $response = $ua->request($req, $filename);
    return ($response, $filename);
};

sub get_target_file {
	my ($self, $registry, $filename) = @_;
	
	my $root = $registry->cache_root();
    my $directory = File::Spec->catfile($root, $self->name());
    my $target = File::Spec->catfile($directory, $filename);
    return $target;
}

sub relocate_file {
	my ($self, $registry, $tempfile, $filename) = @_;

    my $root = $registry->cache_root();
    my $directory = File::Spec->catfile($root, $self->name());
    File::Path::make_path($directory);
    my $target = File::Spec->catfile($directory, $filename);
    move($tempfile, $target);
    return $target;
}

1;

=head1 NAME

Heliotrope::Updater

=head1 SYNOPSIS

  with 'Heliotrope::Updater';
  
=head1 DESCRIPTION

This role defines the expected interface for an updater, and provides a few 
useful default methods. 

=over 4

=item $self->maybe_update()

The conditional update entry point. This is typically called when we don't know 
whether or not we need to actually do an update. It should do a minimal amount
of networky stuff and then, if necessary, call L<update>.

=item $self->update()

The unconditional update entry point. This is where the main update logic is
required; it ought to download the files that are needed, and build any
databases needed. Then, it should write the data into the database. As a 
convention, but not an enforced one, this usually happens in a method
L<output>.

=item $self->get_data($registry)

=item $self->set_data($registry, $data)

Reader and writer methods for registry data for this updater. This is persisted
between runs. Use this to record, for example, the date associated with the
last file loaded by this updater. 

=item $self->get_resource($registry, $req)

Gets a resource URL, and returns two values, a L<HTTP::Response> and a temporary
file name for the contents (if any, don't assume there are).

=item $self->get_target_file($registry, $filename)

Gets a full filename for a file relative to the file space for this updater 
within the registry. 

=item $self->relocate_file($registry, $tempfile, $filename)

Moves a file from C<$tempfile> to C<$filename>. All are relative to the file 
space for this updater within the registry. 

=back

=head1 AUTHOR

Stuart Watt E<lt>stuart.watt@oicr.on.caE<gt>

=head1 COPYRIGHT AND LICENSE

This program is free software; you can redistribute it and/or modify it 
under the same terms as Perl itself.

