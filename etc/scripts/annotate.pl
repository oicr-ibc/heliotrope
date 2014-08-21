#!/usr/bin/env perl -w

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

use strict;
use warnings;

use common::sense;

use MongoDB;
use MongoDB::OID;
use Getopt::Long;

my $class;
GetOptions ("class=s" => \$class) or die("Error in command line arguments\n");

$| = 1;

sub process {
  my $database_name = $ENV{HELIOTROPE_DATABASE_NAME} || "heliotrope";
  my $database_server = $ENV{HELIOTROPE_DATABASE_SERVER} || "fervdb-dev.oicr.on.ca:27017";

	my @options = (dt_type => undef, host => $database_server, query_timeout => -1, auto_reconnect => 1, auto_connect => 0);
	my $conn = MongoDB::MongoClient->new(@options);
  $conn->connect();

  my $database = $conn->get_database($database_name);
  my $collection = $database->get_collection('publications');

  while(<>) {
    my $id = $_;
    chomp($id);

    $collection->update({'_id' => MongoDB::OID->new($id)}, {'$addToSet' => {'classes' => $class}}, {w => 1});
  }
}

process();

1;
