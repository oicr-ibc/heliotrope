package Heliotrope::WorkingDatabase;

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

use common::sense;

use Moose::Role;

use Heliotrope::Logging qw(get_logger);

use DBI;

my $log = get_logger();

sub open_working_database {
	my ($self, $registry) = @_;

	my $name = $self->name();
	my $filename = $self->get_target_file($registry, "$name.db");

    $log->infof("Creating database: %s", $filename);

    unlink($filename) if (-e $filename);
    my $dbh = DBI->connect("dbi:SQLite:$filename") or die DBI->errstr();

    $dbh->do(qq{PRAGMA locking_mode = EXCLUSIVE}) or die($dbh->errstr());
    $dbh->do(qq{PRAGMA synchronous = OFF}) or die($dbh->errstr());
    $dbh->do(qq{PRAGMA cache_size = 10000}) or die($dbh->errstr());

    $self->{_dbh} = $dbh;

	return $dbh;
}

sub close_working_database {
	my ($self) = @_;
	delete($self->{_dbh})->disconnect();
}

sub reopen_working_database {
    my ($self, $registry) = @_;

    my $name = $self->name();
    my $filename = $self->get_target_file($registry, "$name.db");
    my $statement;

    my $dbh = DBI->connect("dbi:SQLite:$filename") or die DBI->errstr();

    $dbh->do(qq{PRAGMA locking_mode = EXCLUSIVE}) or die($dbh->errstr());
    $dbh->do(qq{PRAGMA synchronous = OFF}) or die($dbh->errstr());

    $self->{_dbh} = $dbh;

    return $dbh;
}

sub load_data {
    my ($self, $registry, $file, $insert_statement, $create_statement) = @_;

    my $dbh = $self->{_dbh};

    $log->infof("Loading from: %s", $file);

    my $fh = IO::Uncompress::Gunzip->new($self->get_target_file($registry, $file));

    foreach my $statement (split(/;/, $create_statement)) {
        $statement =~ s{^\s+}{}s;
        $statement =~ s{\s+$}{}s;
        next unless ($statement);
        $dbh->do($statement) or die($dbh->errstr());
    }

    $dbh->begin_work();
    my $prepared = $dbh->prepare($insert_statement) or die($dbh->errstr());
    while(my $line = <$fh>) {
        chomp($line);
        # Twisted special logic for embedded newlines in MySQL dump files
        while(substr($line, -2) eq "\r\\") {
            $line = substr($line, 0, -2) .  "\n" . <$fh>;
            chomp($line);
        }
        my @values = map { ($_ eq '\\N') ? undef : $_ } split(/\t/, $line, -1);
        $prepared->execute(@values) or die("Error in $line: " . $dbh->errstr());
    }

    $dbh->commit();

    $fh->close();
}

sub execute_sql {
    my ($self, $statement) = @_;
    # say STDERR "$statement";
    my $dbh = $self->{_dbh};
    $dbh->begin_work();
    $dbh->do($statement) or die($dbh->errstr());
    $dbh->commit();
}

sub execute_delimited_sql {
    my ($self, $statement) = @_;
    foreach my $sql (split(/;/, $statement)) {
        $sql =~ s/^\s+//;
        $sql =~ s/\s+$//;
        $sql .= "\n";
        $self->execute_sql($sql);
    }
}

1;

=head1 NAME

Heliotrope::WorkingDatabase

=head1 SYNOPSIS

  with 'Heliotrope::WorkingDatabase';

  my $dbh = $self->open_working_database($registry);
  ... Do some stuff
  $self->close_working_database($dbh);

=head1 DESCRIPTION

Encapsulates the code which opens a database connection to an appropriately
named working database. The returned value is a L<DBI> handle to a database,
almost always using L<DBD::SQLite>. This is not very safe for persistent
storage, but is intended for use within a script to run all sorts of local
data management and calculation, to take the burden off the local memory.

=head1 AUTHOR

Stuart Watt E<lt>stuart.watt@oicr.on.caE<gt>

=head1 COPYRIGHT AND LICENSE

This program is free software; you can redistribute it and/or modify it
under the same terms as Perl itself.
