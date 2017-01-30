package Heliotrope::Update::Boot;

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
	$self->{name} = "boot";
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

	$log->info("Initializing indexes");
  my $dbh = $self->open_database();

  foreach my $collection ("genes", "variants") {
      $self->ensure_index($dbh, $collection, Tie::IxHash->new("name" => 1), { unique => true, safe => true });
  }

  ## Indexes for the genes collection
  $self->ensure_index($dbh, "genes", Tie::IxHash->new("id" => 1), { unique => true, safe => true });
  $self->ensure_index($dbh, "genes", Tie::IxHash->new("sections.transcripts.data.records.id" => 1), { unique => true, safe => true, sparse => true });
  $self->ensure_index($dbh, "genes", Tie::IxHash->new("sections.frequencies.data.all.total" => 1), { safe => true });

  ## Indexes for the variants collection
  $self->ensure_index($dbh, "variants", Tie::IxHash->new("gene" => 1, "shortMutation" => 1), { unique => true, safe => true });
  $self->ensure_index($dbh, "variants", Tie::IxHash->new("sections.identifiers.data.cosmic" => 1), { unique => true, safe => true });  
  $self->ensure_index($dbh, "variants", Tie::IxHash->new("sections.positions.data.position" => 1), {unique => false, safe =>true}); # Added this index in

  ## Indexes for the variantRecords collection
  $self->ensure_index($dbh, "variantRecords", Tie::IxHash->new("geneId" => 1, "sampleId" => 1, "mutationId" => 1), { unique => true, safe => true });

  ## Indexes for the annotations collection
  # Identity might need to get changed to ref
  $self->ensure_index($dbh, "annotations", Tie::IxHash->new("role" => 1, "identity" => 1), { unique => true, safe => true });

	$self->close_database($dbh);
}

1;
