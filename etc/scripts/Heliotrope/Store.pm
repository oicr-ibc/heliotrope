package Heliotrope::Store;

use Carp;
use common::sense;
use boolean;

use Moose::Role;

use MongoDB;

use Heliotrope::Data qw(deep_eq);

sub BUILD {
  my ($self) = @_;
  $self->{_reference_id_cache} = {};
}

sub open_database {
    my ($self, @args) = @_;

    my $database_name = $ENV{HELIOTROPE_DATABASE_NAME} || "heliotrope";
    my $database_server = $ENV{HELIOTROPE_DATABASE_SERVER} || "localhost:27017";
    my $database_username = $ENV{HELIOTROPE_DATABASE_USERNAME};
    my $database_password = $ENV{HELIOTROPE_DATABASE_PASSWORD};

    my @options = (@args, host => $database_server);
    push @options, username => $database_username if ($database_username);
    push @options, password => $database_password if ($database_password);
    push @options, query_timeout => -1;
    push @options, auto_reconnect => 1;

    my $conn = MongoDB::MongoClient->new(@options);
    $conn->connect();
    my $database = $conn->get_database($database_name);
    return $database;
}

sub close_database {
  my ($self) = @_;
}

# Added extra safety to insert and update queries, as these are likely to die
# sometimes.

sub save_record {
	my ($self, $database, $collection, $data, @options) = @_;
  my $result = eval {
    $database->get_collection($collection)->save($data, @options);
  };
  if ($@ && ! defined($result)) {
    carp($@);
  }
  return $result;
}

sub maybe_write_record {
  my ($self, $database, $write_collection, $resolved, $existing) = @_;
  my $reference_id_cache = $self->{_reference_id_cache};

  if (! deep_eq($resolved, $existing)) {

    foreach my $reference (@{$resolved->{references}}) {
      next if ($reference->{_id});

      if (my $id = $reference_id_cache->{$reference->{ref}}->{$reference->{name}}) {
        $reference->{_id} = $id;
      } else {
        my $collection = $reference->{ref};
        if (my $existing = $self->find_one_record($database, $collection, {name => $reference->{name}})) {
          $reference->{_id} = $existing->{_id};
          $reference_id_cache->{$reference->{ref}}->{$reference->{name}} = $reference->{_id};
        } else {
          my $copy = clone($reference);
          delete($copy->{ref});
          $reference->{_id} = $self->save_record($database, $collection, $copy, {w => 1, j => true});
          $reference_id_cache->{$reference->{ref}}->{$reference->{name}} = $reference->{_id};
        }
      }
      next;
    }

    $resolved->{version} = $resolved->{version} + 1;

    $self->save_record($database, $write_collection, $resolved, {w => 1, j => true});
  }
}

sub update_record {
  my ($self, $database, $collection, $query, $changes, @options) = @_;
  my $result = eval {
    $database->get_collection($collection)->update($query, $changes, @options);
  };
  if ($@ && ! defined($result)) {
    carp("$@: " . $database->last_error());
  }
  return $result;
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
