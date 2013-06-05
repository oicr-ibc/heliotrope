package Heliotrope::Store;

use common::sense;

use Moose::Role;

use MongoDB;

sub open_database {
	my ($self) = @_;
	
	my $database_name = $ENV{HELIOTROPE_DATABASE_NAME} || "heliotrope";
    my $database_server = $ENV{HELIOTROPE_DATABASE_SERVER} || "localhost:27017";
    my $database_username = $ENV{HELIOTROPE_DATABASE_USERNAME};
    my $database_password = $ENV{HELIOTROPE_DATABASE_PASSWORD};
    
    my @options = (host => $database_server);
    push @options, username => $database_username if ($database_username);
    push @options, password => $database_password if ($database_password);
	
    $DB::single = 1;
	my $conn = MongoDB::Connection->new(@options);	
    my $database = $conn->get_database($database_name);
	return $database;
}

sub close_database {
	my ($self) = @_;
}

sub save_record {
	my ($self, $database, $collection, $data, @options) = @_;
	return $database->get_collection($collection)->save($data, @options);
}

sub update_record {
    my ($self, $database, $collection, $query, $changes, @options) = @_;
    return $database->get_collection($collection)->update($query, $changes, @options);
}

sub find_one_record {
    my ($self, $database, $collection, $query, @options) = @_;
    return $database->get_collection($collection)->find_one($query, @options);
}

sub ensure_index {
    my ($self, $database, $collection, $index, @options) = @_;
    return $database->get_collection($collection)->ensure_index($index, @options);
}

1;

=head1 NAME

Heliotrope::Store

=head1 SYNOPSIS

  with 'Heliotrope::Store';
  
  my $db = $self->open_database();
  ... Do some stuff
  $self->close_database($db);

=head1 DESCRIPTION

Encapsulates the code which opens a database connection to L<MongoDB>. This should
make it much easier for anyone who wants to use a different database name. 

=head1 NOTES

The C<close_database> doesn't actually do anything. It doesn't exist in MongoDB. The
connection is closed when all references go out of scope. This module could proxy
to do that, but meh. 

=head1 AUTHOR

Stuart Watt E<lt>stuart.watt@oicr.on.caE<gt>

=head1 COPYRIGHT AND LICENSE

This program is free software; you can redistribute it and/or modify it 
under the same terms as Perl itself.
