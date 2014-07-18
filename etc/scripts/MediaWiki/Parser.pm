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
  $self->{_context} = [];
}

sub set_handler {
	my ($self, $event, $code) = @_;
	$self->{_handlers}->{$event} = $code;
}

sub get_context {
  my ($self) = @_;
  return $self->{_context};
}

sub parse {
	my ($self, $content) = @_;

	my $templates = qr{
                        (?:(?<TEMPLATE>\{\{(?:[^{}]++|(?-1))*+\}\})  |  # Find template calls
                           (?<LINK>\[\[(?:[^\[\]]++|(?-1))*+\]\])    |  # Find wiki-style links
                           (?<TAG></?\w[^>]*>)                       |  # Find HTML-style tags
                           (?<TEXT>[^{}\[\]\<\>]*+))

  }x;

  my $context = $self->get_context();

	while($content =~ m/$templates/g) {
		my $match_template = $+{TEMPLATE};
		my $match_link = $+{LINK};
		my $match_tag = $+{TAG};
    my $match_text = $+{TEXT};

		if (defined($match_template)) {
			# We have a template. We can now parse this recursively. Sort of. First of all,
			# we should get the command.


			# We can trim off the first and last two characters straightforwardly.
			$match_template = substr($match_template, 2, -2);

			# And now we can regex to find the tag.
			if (my ($tag, $body) = ($match_template =~ m{^(\w+)(.*)}s)) {
				$self->handle_event('template', $tag, $body);
			} else {
				$self->handle_event('error', 'template', $match_template);
			}

		} elsif (defined($match_link)) {

			$match_link = substr($match_link, 2, -2);
			$self->handle_event('link', $match_link);

		} elsif (defined($match_tag)) {
      # This is a tag

      if ($match_tag =~ m{^<!--}) {
        return '';
      } elsif ($match_tag =~ m{^</(\w+)}) {
        $self->handle_event('tag_end', lc($1), $match_tag);
        pop @$context;
      } elsif ($match_tag =~ m{^<(\w+).*/>$}) {
        push @$context, $match_tag;
        $self->handle_event('tag_start', lc($1), $match_tag);
        $self->handle_event('tag_end', lc($1), $match_tag);
        pop @$context;
      } elsif ($match_tag =~ m{^<(\w+)}) {
        push @$context, $match_tag;
        $self->handle_event('tag_start', lc($1), $match_tag);
      } else {
        die("Bad tag: $match_tag");
      }
    } elsif (defined($match_text)) {
			# This is text.

			$self->handle_event('text', $match_text);
    } else {

			die("Internal error");
		}
	}

}

sub unpack_keys {
  my ($self, $string) = @_;
  my $result = {};
  while($string =~ m{\|                                      # identifies an attribute
                     [ ]*(\w+)[ ]*=[ ]*((?:[^{}\[\]|]+|      # followed by an attribute name
                     \{\{(?:[^\r\n{}]++|(?-1))*+\}\}|        # possibly a template
                     \[\[(?:[^\r\n\[\]]++|(?-1))*+\]\])*)    # or a link
                     }gsx) {
	  my $key = $1;
	  my $value = $2;
	  $value =~ s/\s+$//;
    $result->{$key} = $value;
  }
  return $result;
}

sub unpack_attributes {
  my ($self, $string) = @_;
  my $result = {};
  while($string =~ m{(\w+)\s*=\s*("[^"]*"|\w+)}gs) {
    my $key = lc($1);
    my $value = $2;
    $value =~ s{^"(.*)"$}{$1};
    $result->{$key} = $value;
  }
  return $result;
}

sub handle_event {
	my ($self, $event, @args) = @_;
	my $handler = $self->{_handlers}->{$event};
	if (defined($handler)) {
		&$handler($self, $event, @args);
	}
}

sub clean {
	my ($self, $text) = @_;
	$text =~ s/'''?//g;
	$text =~ s/<[^>]+>//g;
	return $text;
}

1;
