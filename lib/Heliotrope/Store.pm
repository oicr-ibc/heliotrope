package Heliotrope::Store;

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

use Carp;
use common::sense;
use boolean;
use Clone qw(clone);

use Moose::Role;

use MongoDB;

use Heliotrope::Config;
use Heliotrope::Data qw(deep_eq);
use Heliotrope::Logging qw(get_logger);

our $log = get_logger();

has 'database' => (
  is => 'rw',
  clearer => 'clear_database',
);

sub BUILD {
  my ($self) = @_;
  $self->{_reference_id_cache} = {};
}

sub open_database {
    my ($self, @args) = @_;

    my $config = Heliotrope::Config::get_config();

    my $database_name = $config->{heliotrope_database_name} || "heliotrope";
    my $database_server = $config->{heliotrope_database_server} || "localhost:27017";
    my $database_username = $config->{heliotrope_database_username};
    my $database_password = $config->{heliotrope_database_password};

    my @options = (@args, host => $database_server);
    push @options, username => $database_username if ($database_username);
    push @options, password => $database_password if ($database_password);
    push @options, query_timeout => 120000;
    push @options, auto_reconnect => 1;
    push @options, timeout => 10000;

    $log->debugf("Connecting to MongoDB: host: %s, database: %s", $database_server, $database_name);

    my $conn = MongoDB::MongoClient->new(@options);
    $conn->connect();
    my $database = $conn->get_database($database_name);
    $self->database($database);
    return $database;
}

sub close_database {
  my ($self) = @_;
  $self->clear_database();
}

# Added extra safety to insert and update queries, as these are likely to die
# sometimes.

sub save_record {
	my ($self, $database, $collection, $data, @options) = @_;
  my $result = eval {
    $database->get_collection($collection)->replace_one($data, @options, { upsert => 1} );
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
    $database->get_collection($collection)->update_one($query, $changes, @options);
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
  return $database->get_collection($collection)->indexes->create_one($index, @options);
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
