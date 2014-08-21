use common::sense;

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

use LWP::UserAgent;
use HTML::TreeBuilder 5 -weak;
use HTTP::Status qw(:constants :is status_message);
use URI;
use IO::File;
use XML::Writer;
use Time::HiRes qw(sleep);

my $base_url = "http://clinicaltrials.gov/ct2/crawl";

my $done = {};

sub crawl {
	my $http = LWP::UserAgent->new(keep_alive => 1);
	my $response;
	
	my @queue = ();
	push @queue, $base_url;
	
	my $output = IO::File->new(">clinical_trails_supA.xml");
	my $writer = XML::Writer->new(OUTPUT => $output, UNSAFE => 1);
	
	$writer->startTag("clinical_studies");
	
	while(@queue) {
		my $next = shift(@queue);
		$response = $http->get($next);
		die "Failed!\n" unless (is_success($response->code()));
		
		my $type = $response->content_type();
		if ($type eq 'text/html') {
            say STDERR "Crawling $next";
			my $root = HTML::TreeBuilder->new_from_content($response->content());
			my $links = $root->extract_links();
			foreach my $link_descriptor (@$links) {
				my ($link, $element, $attr, $tag) = @$link_descriptor;
				if ($attr eq 'href' && $tag eq 'a' && $link =~ m{ct2/crawl}) {
					my $uri = URI->new_abs($link, $next);
					push @queue, $uri->as_string unless $done->{$uri->as_string};
				} elsif ($attr eq 'href' && $tag eq 'a' && $link =~ m{ct2/show/NCT(\d+)} && $1 > 1357369) {
					my $uri = URI->new_abs($link, $next);
					$uri->query_form(displayxml => "true", resultsxml => "true");
					push @queue, $uri->as_string unless $done->{$uri->as_string};
				}
			}
		} elsif ($type = 'text/xml') {
            say STDERR "Writing XML from $next";
			# Grubby - and we assume no weird declarations
			$writer->raw($response->content());
            sleep(0.4);
		}
		
		$done->{$next} = 1;
	}

    $writer->endTag("clinical_studies");
    $writer->end();
    $output->close();
}

crawl();

1;
