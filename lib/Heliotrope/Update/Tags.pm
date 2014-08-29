package Heliotrope::Update::Tags;

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

use boolean;
use common::sense;

use MooseX::Singleton;
use YAML;
use File::Spec;

use Heliotrope::Logging qw(get_logger);

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

my $log = get_logger();

my $tags;

BEGIN {
  my ($volume, $directory, $file) = File::Spec->splitpath(__FILE__);

  $tags = YAML::LoadFile(File::Spec->catpath($volume, $directory, "Tags.yml"));
}

sub BUILD {
  my ($self) = @_;
  $self->{name} = "tags";
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

  $log->info("Creating tags");
  my $database = $self->open_database();

  ## Indexes for the genes collection
  $self->ensure_index($database, "tags", Tie::IxHash->new("name" => 1), { unique => true, safe => true });

  my $tags_collection = $database->get_collection('tags');
  $tags_collection->remove({});
  foreach my $tag (@{$tags->{tags}}) {
    $tags_collection->insert({name => $tag});
  }

  $self->close_database();
}

1;