use common::sense;

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
