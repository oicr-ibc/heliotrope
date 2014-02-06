package MediaWiki::Parser;

use strict;
use warnings;

use Moose;

use Text::Balanced;

# Basic pattern handling involves some handling of content. We don't just generate
# HTML, that's not what we are here for.

sub BUILD {
	my ($self, $args) = @_;
	$self->{_handlers} = $args->{handlers} // {};
}

sub set_handler {
	my ($self, $event, $code) = @_;
	$self->{_handlers}->{$event} = $code;
}

sub parse {
	my ($self, $content) = @_;

	my $templates = qr/(?:(\{\{(?:[^{}]++|(?-1))*+\}\})|(\[\[(?:[^\[\]]++|(?-1))*+\]\])|([^{}\[\]]*+))/;

	while($content =~ m/$templates/g) {
		my $match_template = $1;
		my $match_link = $2;
		my $match_text = $3;

		if (defined($match_template)) {
			# We have a template. We can now parse this recursively. Sort of. First of all,
			# we should get the command. 


			# We can trim off the first and last two characters straightforwardly.
			$match_template = substr($match_template, 2, -2);

			# And now we can regex to find the tag.
			if (my ($tag, $body) = ($match_template =~ m{^(\w+)(.*)})) {
				$self->handle_event('template', $tag, $body);
			} else {
				$self->handle_event('error', 'template', $match_template);
			}

		} elsif (defined($match_link)) {

			$match_link = substr($match_link, 2, -2);
			$self->handle_event('link', $match_link);

		} elsif (defined($match_text)) {
			# This is text. 

			$self->handle_event('text', $match_text);
		} else {

			die("Internal error");
		}
	}

}

sub handle_event {
	my ($self, $event, @args) = @_;
	my $handler = $self->{_handlers}->{$event};
	if (defined($handler)) {
		&$handler($self, $event, @args);
	}
}

1;
