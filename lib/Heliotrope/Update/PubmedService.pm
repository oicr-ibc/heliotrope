package Heliotrope::Update::PubmedService;

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

with 'Heliotrope::Store';

use Carp;
use XML::LibXML;
use XML::LibXML::Reader;
use URI;

use Heliotrope::Decoders::Pubmed;

### This isn't a full updater in its own right. it's intended to be used as a component
### to provide pubmed articles on demand, with some caching. That avoids having to parse
### a huge amount of text, and it also avoids creating a huge database of publications.
### It should primarily provide a tool to "ensure" a publication (if possible).

### Needs access to the database
requires 'database';
requires 'user_agent';

## So first of all, we use caching, and only touch the database when we have a cache
## miss. Second, even if we do find a record in the database, we have a expiry date
## in the database. If that's expired, we check the service and then update if we need
## to, and reset the expiry date to two months in the future, plus a bit of randomness
## to avoid peaks of access. Finally, we return the document.

my $xmltojson = Heliotrope::Decoders::Pubmed->new();

sub get_publication {
  my ($self, $identifier) = @_;

  my ($source, $key) = split(':', $identifier, 2);

  die("Only Pubmed currently supported for publication sources") if ($source ne 'pmid');
  my $database = $self->database();

  my $query = {name => $identifier};
  my $collection = $database->get_collection('publications');
  my $found = $collection->find_one($query);
  my $now = DateTime->now();

  my $update_needed = 0;

  if ($found) {
    my $expiry = $found->{expires};
    if (DateTime->compare($expiry, $now) == -1) {
      ## We're expired
      $update_needed = 1;
    }
  } else {
    $update_needed = 1;
  }

  if ($update_needed) {
    my $data = $self->fetch_publication($key);

    my $updater = {};
    $updater->{expires} = $now->add(days => (50 + int(rand(20))));
    $updater->{data} = $data;
    $collection->update_record($query, {'$set' => $updater}, {"upsert" => 1, "multiple" => 0});
    return $data;
  } else {
    $found->{data};
  }

  # my @required_fields = qw(author title journal volume issue pages date);
  # return unless (grep { ! exists($citation->{$_}) } @required_fields);

  # my $name = "pmid:".$citation->{pmid};
  # $log->warnf("Missing publication details: checking against: $name");
  # my $existing = $self->find_one_record($database, 'publications', {"name" => $name});
  # if (! $existing) {
  #   carp("Can't find publication: $name");
  #   return;
  # }

  # my $publication = $existing->{sections}->{pubmed}->{data};
  # $citation->{author}  ||=  [ map { "$_->{LastName} $_->{Initials}" } @{$publication->{Article}->{AuthorList}->{Author}} ];
  # $citation->{title}   ||=  $publication->{ArticleTitle};
  # $citation->{journal} ||=  $publication->{Article}->{Journal}->{ISOAbbreviation};
  # $citation->{volume}  ||=  $publication->{Article}->{Journal}->{JournalIssue}->{Volume};
  # $citation->{issue}   ||=  $publication->{Article}->{Journal}->{JournalIssue}->{Issue};
  # $citation->{pages}   ||=  $publication->{Article}->{Pagination}->{MedlinePgn};
  # $citation->{date}    ||=  $publication->{Article}->{Journal}->{JournalIssue}->{PubDate}->{MedlineDate};

}

sub fetch_publication {
  my ($self, $pmid) = @_;

  my $ua = $self->user_agent();
  my $base_url = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";
  my $uri = URI->new($base_url);
  $uri->query_form(db => 'pubmed', id => $pmid, retmode => 'xml');
  my $response = $ua->get($uri);

  if ($response->is_error()) {
    carp("Failed to find publication: $pmid");
    return;
  }

  my $reader = XML::LibXML::Reader->new(string => $response->decoded_content());

  # Skip to first entry element
  while($reader->read() && $reader->name() ne 'MedlineCitation') {};

  do {
    if ($reader->name() eq 'MedlineCitation') {
      return _publication_entry($self, $reader)
    }
  } while($reader->nextSibling());

  return;
}

sub _publication_entry {
  my ($self, $reader) = @_;

  my $xml = $reader->readOuterXml();
  my $dom = XML::LibXML->load_xml(string => $xml, clean_namespaces => 1);
  my $root = $dom->documentElement();

  my $pmid = $root->findvalue('/MedlineCitation/PMID');

  return $xmltojson->convert_document_to_json($root);
}

1;
