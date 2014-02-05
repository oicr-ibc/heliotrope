package MediaWiki::Parser;

use strict;
use warnings;

use Moose;

use Text::Balanced;

# Basic pattern handling involves some handling of content. We don't just generate
# HTML, that's not what we are here for.

sub parse {
	my ($self, $content) = @_;

	my $templates = qr/(\{\{(?:[^{}]++|(?-1))*+\}\}|[^{}]*+)/;

	while($content =~ m/$templates/g) {
		my $match = $1;
		if (substr($match, 0, 2) eq '{{') {
			# We have a template. We can now parse this recursively. Sort of. First of all,
			# we should get the command. 
		} else {
			# This is text. 
		}
	}

}