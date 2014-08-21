package Heliotrope::Update::Statistics;

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

use boolean;
use Tie::IxHash;
use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use Heliotrope::Logging qw(get_logger);

my $log = get_logger();

sub BUILD {
  my ($self) = @_;
  $self->{name} = "statistics";
}

sub maybe_update {
  my ($self, $registry, %options) = @_;
  $self->update($registry);
}

sub update {
  my ($self, $registry) = @_;
  $self->output($registry);
}

sub output {
  my ($self, $registry) = @_;

  $log->info("Computing statistics");
  my $database = $self->open_database();

  $database->get_collection('statistics')->ensure_index({'tag' => 1});

  $log->info("Calculating gene mutation frequencies");
  my $result = $database->get_collection('variantRecords')->aggregate([
    { '$match' => { 'mutationId' => { '$ne' => undef } } },
    { '$group' => { '_id' => '$geneId', 'frequency' => { '$sum' => 1 }, 'geneSymbol' => { '$first' => '$geneSymbol' } } },
    { '$project' => { 'name' => '$geneSymbol', 'frequency' => 1 } },
    { '$sort' => { 'frequency' => -1 } },
    { '$limit' => 250 }
  ]);

  $database->get_collection('statistics')->update({'tag' => 'gene_frequencies'}, {'$set' => {'data' => $result}}, {'upsert' => 1, 'safe' => 1});

  $self->close_database();
}

1;