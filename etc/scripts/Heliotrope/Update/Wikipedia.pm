package Heliotrope::Update::Wikipedia;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use boolean;
use WWW::Mechanize;
use URI;
use HTTP::Request;
use File::Temp;
use DateTime;
use JSON qw(decode_json);
use Carp;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

sub BUILD {
	my ($self) = @_;
	$self->{name} = "wikipedia";
}

sub maybe_update {
	my ($self, $registry, %options) = @_;
    return;
}

sub update {
	my ($self, $registry) = @_;

    say "About to update.";

    my $mech = WWW::Mechanize->new();

    my $root = URI->new("http://en.wikipedia.org/w/api.php");

    my $first = $root->clone();
    my $query = {action => 'query', format => 'json', list => 'categorymembers', cmtitle => 'Category:Human proteins', cmlimit => 'max'};
    $first->query_form($query);

    my @gene_pages = ();
    while(my $response = $mech->get($first)) {
        my $perl_scalar = decode_json($response->decoded_content());
        push @gene_pages, @{$perl_scalar->{query}->{categorymembers}};
        my $count = @gene_pages;
        say "Found $count genes";

        if ($perl_scalar->{'query-continue'}->{categorymembers}->{cmcontinue}) {
            $query->{cmcontinue} = $perl_scalar->{'query-continue'}->{categorymembers}->{cmcontinue};
            $first->query_form($query);
        } else {
            last;
        }
    }

    # Now we have the page identifiers for all the gene pages. And titles too. We are now in a position
    # where we can start to iterate through these pages and get the textual content, JSON representations, 
    # and so on. 

    foreach my $gene_page (@gene_pages) {
        my $query = {action => 'query', prop => 'revisions', format => 'json', rvprop => 'content|tags|timestamp', pageids => $gene_page->{pageid}};
        $first->query_form($query);
        my $response = $mech->get($first);
        my $content = $response->decoded_content();
        $DB::single = 1;
        my $perl_scalar = decode_json($response->decoded_content());
        say "$content";

        # We don't need everything, but we do want the contents of the PBB template, as this 
        # is provided by Protein Box Bot. This provides the Ensembl gene identifier and a bunch of
        # other useful identifying values. 

        $query = {action => 'query', prop => 'revisions', format => 'json', rvprop => 'content|tags|timestamp', titles => 'Template:PBB/3290'};
        $first->query_form($query);
        $response = $mech->get($first);
        $content = $response->decoded_content();
        say "$content";

        # $query = {action => 'expandtemplates',  format => 'json', text => '{{PBB|geneid=3290}}'}
    }
}

sub parse_wiki {
    my ($text) = @_;

    # We can use some of the neat Perl regular expression nested matching to handle this, as 
    # basically we are interested in both text and wiki macros/templates. 

    
}

sub output {
	my ($self, $registry) = @_;
	
    my $cached_data = $self->get_data($registry);
    
}

1;
