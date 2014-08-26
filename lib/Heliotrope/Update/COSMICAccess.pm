package Heliotrope::Update::COSMICAccess;

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

use HTTP::Request;
use HTML::TreeBuilder;
use DateTime;
use DateTime::Format::Natural;
use Carp;

use Heliotrope::Logging qw(get_logger);
use Heliotrope::Config;

my $log = get_logger();

sub base_url {
  my ($self) = @_;
  return "https://cancer.sanger.ac.uk/files/cosmic/";
}

sub login {
  my ($self, $registry) = @_;

  my $ua = $self->user_agent();
  my $config = Heliotrope::Config::get_config();

  $log->info("Logging in to COSMIC");
  my $response = $ua->post('https://cancer.sanger.ac.uk/cosmic/login',
    Content => {email => $config->{cosmic_email}, password => $config->{cosmic_password}});
}

sub get_cosmic_version_date {
  my ($self, $registry) = @_;

  my ($req, $result, $file);
  my $config = Heliotrope::Config::get_config();

  $log->info("Read list of files");
  my $base_url = $self->base_url();
  $req = HTTP::Request->new(GET => $base_url);
  $req->header(Accept => "text/ftp-dir-listing, */*;q=0.1");
  ($result, $file) = $self->get_resource($registry, $req);

  ## Cuts out the <pre> tag and naively processes it as a list of versions and dates
  my $tree = HTML::TreeBuilder->new();
  $tree->parse_file($file);
  my ($element) = $tree->find_by_tag_name('pre');
  if (! $element) {
    $log->error("Failed to get list of files, probably failed to login or something...");
    return;
  }
  my $string = $element->as_text();
  my @lines = map { [ split(/  +/, $_) ] } split("\n", $string);

  my $parser = DateTime::Format::Natural->new();
  my $versions = {};
  foreach my $line (@lines) {
    $versions->{$line->[0]} = $parser->parse_datetime($line->[1])->format_cldr("yyyy-MM-dd");
  }

  ## Allow a version to be specified through the config file
  my $release_directory = $config->{cosmic_release} // 'current_release';
  $release_directory .= '/';
  my $current = $versions->{$release_directory};
  my $version = undef;
  my $original = delete $versions->{$release_directory};
  delete $versions->{Name};
  foreach my $key (keys %$versions) {
    if ($versions->{$key} eq $current) {
      $version = $key;
      last;
    }
  }

  if (! defined($version)) {
    $version = $release_directory;
    $versions->{$release_directory} = $original;
  }

  my $version_date = $versions->{$version};
  my $version_string = ($version =~ s{\W}{}gr);
  $log->infof("Detected version: %s", $version_string);
  $log->infof("Detected date: %s", $version_date);

  return ($version_string, $version_date);
}

1;