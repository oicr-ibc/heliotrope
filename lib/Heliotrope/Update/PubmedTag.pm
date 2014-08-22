package Heliotrope::Update::PubmedTag;

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

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use boolean;
use Carp;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

$| = 1;

sub BUILD {
    my ($self) = @_;
    $self->{name} = "pubmed_tag";
}

sub maybe_update {
    my ($self, $registry, %options) = @_;
    return;
}

sub _is_article {
    my ($object) = @_;

    my $data = $object->{sections}->{pubmed}->{data};

    my $article = $data->{Article};
    return 0 unless ($article);
    return 0 unless (exists $article->{Abstract});

    my $title = $article->{ArticleTitle};
    my $abstract = $article->{Abstract};

    if (ref($abstract->{AbstractText}) eq '') {
      $abstract = $abstract->{AbstractText}
    } else {
      my @fragments = @{$abstract->{AbstractText}};
      my @texts = map {
        my $body = $_->{value};
        my $label = exists($_->{Label}) ? "$_->{Label}. " : "";
        $label.$body;
      } @fragments;
      $abstract = join(" ", @texts);
    }

    my $title_abstract = "$title\n$abstract";

    my @publication_types = exists($data->{Article}->{PublicationTypeList}->{PublicationType}) ? @{$data->{Article}->{PublicationTypeList}->{PublicationType}} : ();
    my @mesh_terms = exists($data->{MeshHeadingList}->{MeshHeading}) ? @{$data->{MeshHeadingList}->{MeshHeading}} : ();

    if (grep { /trial/i } @publication_types) {
      print "c";
    } else {
      print ".";
    }

    # say $object->{name};

    # eval {
    #     my $fh = IO::Uncompress::Gunzip->new($file);
    #     my $reader = XML::LibXML::Reader->new(IO => $fh);
    #     $self->{_element_count} = 0;
    #     $self->{_count} = 0;
    #     $self->{_skip_count} = 0;

    #     # Skip to first entry element
    #     say "$file";
    #     while($reader->read() && $reader->name() ne 'MedlineCitation') {};

    #     do {
    #         if ($reader->name() eq 'MedlineCitation') {
    #             entry($self, $collection, $reader);
    #             $self->{_element_count}++;
    #         }
    #     } while($reader->nextSibling());

    #     close($fh);
    #     say "$file: loaded $self->{_count} items, skipped $self->{_skip_count} items";
    # };

    # if ($@) {
    #     carp "$@";
    # }
    return 0;
}

sub update {
	my ($self, $registry) = @_;

  say "About to update.";
  my $database = $self->open_database();
  my $collection = $database->get_collection('publications');

  my $query = $collection->find({});
  while (my $object = $query->next()) {
    if (_is_article($object)) {
      say $object->{name};
    }
  }

  $self->close_database($database);
}

1;
