package Heliotrope::Update::Wikipedia;

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
with 'Heliotrope::Update::PubmedService';

use boolean;
use WWW::Mechanize;
use URI;
use HTTP::Request;
use File::Temp;
use DateTime;
use JSON qw(decode_json);
use Carp;
use Data::GUID;
use Tie::IxHash;
use Data::Dumper;

use Heliotrope::Logging qw(get_logger);
use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

use MediaWiki::Parser;

my $log = get_logger();

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

    $log->info("About to update");

    my $mech = WWW::Mechanize->new();

    my $root = URI->new("http://en.wikipedia.org/w/api.php");

    my $url = $root->clone();
   # Added the continue parameter to the query
   # Using Category: Genes by Human Chromsome now with ~12500 pages
    my $chrom = 0;
    while (1) {    
    if ( $chrom =~ /(\d+)/ ) {
	$chrom++;
    }
    # Switching from numbers to letters makes the comparator complain but for now it will do
    if ($chrom == 23) {
        $chrom = 'M';
    } elsif ($chrom eq 'M') {
        $chrom = 'Y';
    } elsif ($chrom eq 'Y') {
        $chrom = 'X';
    } elsif ($chrom eq 'X') {
	last;
    }
    my $query = {action => 'query', format => 'json', list => 'categorymembers', cmtitle => "Category:Genes on human chromosome $chrom", cmlimit => 'max', cmcontinue => ''};

    $url->query_form($query);
    
    my @gene_pages = ();
    while($log->debugf("Requesting: %s", $url->as_string()), my $response = $mech->get($url)) {
        my $perl_scalar = decode_json($response->decoded_content()); #J Source of malformed JSON string error
        push @gene_pages, @{$perl_scalar->{query}->{categorymembers}};
        my $count = @gene_pages;
	$log->debugf("Found %d genes", $count);
        #print Dumper $perl_scalar;	

    # Adapted code to new format for continuing queries
        if ($perl_scalar->{continue}) {
           $query->{cmcontinue} = $perl_scalar->{continue}->{cmcontinue};
           $url->query_form($query);
        } else {
            last;
        }
    }

    # Now we have the page identifiers for all the gene pages. And titles too. We are now in a position
    # where we can start to iterate through these pages and get the textual content, JSON representations,
    # and so on.
     
    my $database = $self->open_database();
    foreach my $gene_page (@gene_pages) {
    # decoded_content sometimes causes program to terminate based on malformed json string error
    # Put an eval function around it so that the program can continue should the error occur
    eval {
        _build_article($self, $database, $mech, $root, $gene_page);
	}
    }
    $self->close_database($database);
  }
}

sub _build_article {
    
    my ($self, $database, $mech, $root, $gene_page) = @_;
    
    my $url = $root->clone();
    my $query = {action => 'query', prop => 'revisions', format => 'json', rvprop => 'content|tags|timestamp', pageids => $gene_page->{pageid}};
    $url->query_form($query);
    $log->debugf("Requesting: %s", $url->as_string());
    my $response = $mech->get($url);
    my $content = $response->decoded_content();
    my $perl_scalar = decode_json($response->decoded_content()); #J Source of malformed JSON string error

    my $page_body = $perl_scalar->{query}->{pages}->{$gene_page->{pageid}}->{revisions}->[0]->{"*"};
    
    # And we're into the Wikipedia handling logic here. This is all getting quote domain-specific.
    my $box_page;
    my @citations;
    my @body;
    my $in_references = 0;
    my $current_citation;
    my $named_citations = Tie::IxHash->new();
    
    
    my $template_handler = sub {
	 
        my ($self, $event, $tag, $body) = @_;
              
     # The PBB tag has been changed to PDB. I found that the PBB tag 
     # appeared much less frequently then the NCBI 'web cite' tag that contained the
     # numerical code for the gene. Once the code has been switched to the
     # human genes pages, I will look again and change if needed. 
     
      # This grabs the gene id from the 'cite web' tag     	
	if ($tag =~ /[Cc]ite/ && $body =~ /^\sweb/) {
	        if ($body =~ /ncbi/) {
			if ($body =~ /TermToSearch\=(\d+)/) { 
				$box_page = "Template:PBB\/$1";
			} elsif ($body =~ /\/gene\/(\d+)/)  {
				$box_page = "Template:PBB\/$1"; 
			} elsif ($body =~ /list_uids\=(\d+)/) {
				$box_page = "Template:PBB\/$1";
			}


	    #$box_page = $body;
            #$box_page =~ s/\|geneid=(\d+)/Template:$tag\/$1/;
	  } else { print ""; }  
}  	
 # Not sure if SWL tag exists either
	if ($tag eq 'SWL') {
            my $link = $self->unpack_keys($body);
            push @body, $link->{label} // $link->{target} // carp("Can't find link label");
        } elsif ($tag eq 'refbegin') {
            $in_references = 1;
        } elsif ($tag eq 'refend') {
            $in_references = 0;
        } elsif ($tag eq 'PBB_Further_reading') {
	    $self->parse($body);
        } elsif ($tag eq 'cite') {
            my $citation = $self->unpack_keys($body);
            
            _clean_authorship($citation);
            
            my $pmid = $citation->{pmid};
            
            $current_citation = $citation;
            push @citations, $citation if ($in_references);
            my $context = $self->get_context();
            
            my $name;
            if (@$context) {
              my $attributes = $self->unpack_attributes($context->[-1]);
              $name = $attributes->{name};
  	       
            }
            if (! defined($name)) {
              $name = Data::GUID->new()->as_string();
            }
            $citation->{name} = $name;
            # say "In context: $context->[-1] $name => ".($pmid // "undef");
            # say "Writing named citation: $name";
            if (@$context && $context->[-1] =~ m{<ref}i) {
              $citation->{referenced} = true;
            }
            if ($named_citations->EXISTS($name)) {
              $log->warnf("Overwriting citation: %s -> %s", $name, $citation);
            }
            $named_citations->STORE($name, $citation);
	}        
    };

    my $link_handler = sub {
         
        my ($self, $event, $text) = @_;
        return if ($text =~ m{^\s*(?:File|Image):});
        if ($text =~ m{\|(.+)$}s) {
          $text = $1;
        }
        push @body, $text;
        
    };
    my $text_handler = sub {
        my ($self, $event, $text) = @_;
        my $context = $self->get_context();
        
	if (@$context && $context->[-1] =~ m{<ref}i) {
          ## Text immediately inside a <ref> tag isn't included. Instead, we should probably skim for a
          ## PMID, at least. Would be better still to parse the citation and extract a title and
          ## authors, but this will do for a minimum version. After all, we'll eventually pair up with
          ## the PubMed source for much of this.
          my $name;
          if ($text =~ m{PMID\s+(\d{6,})}) {
            my $citation = {pmid => $1};
            my $attributes = $self->unpack_attributes($context->[-1]);
            $name = $attributes->{name} // Data::GUID->new()->as_string();
            $citation->{referenced} = true;
            $citation->{name} = $name;
            if ($named_citations->EXISTS($name)) {
              $log->warnf("Overwriting citation: %s -> %s", $name, $citation);
            }
            $named_citations->STORE($name, $citation);
            $current_citation = $citation;
          }
        } else {
          push @body, $text;
        }
    };
    my $tag_start_handler = sub {
      my ($self, $event, $tag, $text) = @_;
      # say "tag_start_handler, $text";
      
      if ($tag eq 'ref') {
        undef($current_citation);
      } else {
        push @body, $text;
	
      }
    };
    my $tag_end_handler = sub {
      my ($self, $event, $tag, $text) = @_;
      # say "tag_end_handler, $text";
      if ($tag eq 'ref') {
        if (! $current_citation) {
          my $attributes = $self->unpack_attributes($text);
          if (! exists($attributes->{name})) {
            return;
          } else {
            $current_citation = $named_citations->FETCH($attributes->{name});
          }
        }
        if ($current_citation && $current_citation->{pmid}) {
          push @body, qq{<ref refId="$current_citation->{name}"/>};
          undef($current_citation);
        }
      } else {
        push @body, $text;
      }
    };
    
    my $parser = MediaWiki::Parser->new({handlers => {
      template => $template_handler,
      link => $link_handler,
      text => $text_handler,
      tag_start => $tag_start_handler,
      tag_end => $tag_end_handler,
    }});
    $parser->parse($page_body);

    my $article = {};

    # We don't need everything, but we do want the contents of the PBB template, as this
    # is provided by Protein Box Bot. This provides the Ensembl gene identifier and a bunch of
    # other useful identifying values.
    
    if (! $box_page) {
	
        $log->debugf("Missing gene details box. Skipping record");
        return;
    }
    
    $query = {action => 'query', prop => 'revisions', format => 'json', rvprop => 'content|tags|timestamp', titles => $box_page};
    $url->query_form($query);
    $response = $mech->get($url);
    $content = $response->decoded_content();
    $perl_scalar = decode_json($content);

    my $pages = $perl_scalar->{query}->{pages};
    my @pages = keys %{$pages};
    my $box_page_body = $pages->{$pages[0]}->{revisions}->[0]->{"*"};

    my $box_body;
    my $gnf_template_handler = sub {
        my ($self, $event, $tag, $body) = @_;
	if ($tag eq 'GNF_Protein_box') {
            $box_body = $body;
	    
        }
    };
    $parser = MediaWiki::Parser->new({handlers => {template => $gnf_template_handler}});
    $parser->parse($box_page_body) if (defined($box_page_body));

    # If there's no box body, quit, as we'll not be able to find an Ensembl ID
    if (! $box_body) {
        $log->debugf("Missing protein details box. Skipping record");
        return;
    }
    
    $box_body =~ s/^\s*\|\s*//s;
    my $keys = $parser->unpack_keys($box_body);

    # Okay, now at this stage we can start processing the links to other items.
    my $gene_id = $keys->{Hs_Ensembl};
    
    $log->infof("Analyzing: %s - %s", $gene_id, $keys->{Symbol});

    my $existing = $self->find_one_record($database, 'genes', {"id" => $gene_id});
    if (! $existing) {
        $log->debugf("Can't find gene %s. Skipping record.", $gene_id);
        return;
    }

    # So now we have a gene record, and we can link to that effectively. That will enable
    # references to be resolved. That means we can now begin to assemble the additional
    # gene information, which we can add to the gene page.

    # It's useful for now to have a list of headers.
    my $body_text = join("", @body);

    # while($body_text =~ m{(?:\A|[^=])\K(===*[ ]*[\p{XPosixGraph} ]+[ ]*===*(?=\z|[^=]))}g) {
    #   $log->debugf("Heading: %s", $1);
    # }
   
    if ($body_text =~ m{==[ ]*(?:clinical[\w ]+|[\w ]*disease[\w ]*|[\w ]*cancer[\w ]*)[ ]*==\n(.*?)(?=[^=]==[^=]|$)}si) {
       
      my $significance = $1;
      my @ids = ();

      $significance =~ s{<ref refId="([^"]+)"/>}{
        my $id = $1;
        my $record = $named_citations->FETCH($id);
        if (! exists($record->{pmid})) {
          "";
        } else {
          my $ref = "pmid:$record->{pmid}";
          push @ids, $ref;
          qq{<ref refId="$ref"/>};
        }

      }eg;

      my $target = {collection => 'genes', query => {id => $gene_id}, role => 'wikipedia', name => $keys->{Symbol}};
      $self->write_annotation($database, $target, $significance, @ids);
      
      # _ensure_details($self, $database, $named_citations);

      # my @alert = (
      #   _alerts => [{
      #     level => "note",
      #     author => "wikipedia",
      #     text => "This information has been updated from Wikipedia",
      #     date => DateTime->now()
      #   }]
      # );

      # my $wikipedia_data = {_format => "wikipedia", @alert, data => { significance => $significance, references => $named_citations}};

      # my $new = expand_references($existing);
      # $new->{sections}->{wikipedia} = $wikipedia_data;
      # my $resolved = resolve_references($new, $existing);

      # $log->infof("Writing data if updated: %s - %s", $gene_id, $keys->{Symbol});
      # $self->maybe_write_record($database, 'genes', $resolved, $existing);
    }
}

sub write_annotation {
  my ($self, $database, $target, $significance, @identifiers) = @_;

  my $alert = {
    level => "note",
    author => "wikipedia",
    source => {name => "Wikipedia", url => "http://en.wikipedia.org"},
    text => "This information has been updated from Wikipedia",
    date => DateTime->now()
  };

  my @citations = ();
  foreach my $identifier (@identifiers) {
    my $publication = $self->get_publication($identifier);
    
    my $citation = {};
    $citation->{author}  =  [ map { "$_->{LastName} $_->{Initials}" } @{$publication->{Article}->{AuthorList}->{Author}} ];
    $citation->{title}   =  $publication->{Article}->{ArticleTitle};
    $citation->{journal} =  $publication->{Article}->{Journal}->{ISOAbbreviation};
    $citation->{volume}  =  $publication->{Article}->{Journal}->{JournalIssue}->{Volume};
    $citation->{issue}   =  $publication->{Article}->{Journal}->{JournalIssue}->{Issue};
    $citation->{pages}   =  $publication->{Article}->{Pagination}->{MedlinePgn};
    $citation->{date}    =  $publication->{Article}->{Journal}->{JournalIssue}->{PubDate};
    $citation->{identifier} = $identifier;
    
    push @citations, $citation;
  }

  # my $wikipedia_data = {_format => "wikipedia", @alert, data => { significance => $significance, references => $named_citations}};

  ## First find the source identifier...
  my $collection = $database->get_collection($target->{collection});
  my $found = $collection->find_one($target->{query});
  if (! $found) {
    $log->warnf("Failed to find record to annotate: %s", $target->{name});
    return;
  }

  my $annotation_collection = $database->get_collection('annotations');
  my $annotation_query = {ref => $found->{_id}, role => $target->{role}};
  my $annotation_body = {};
  $annotation_body->{annotation} = $significance;
  $annotation_body->{citations} = \@citations;
  $annotation_body->{alert} = $alert;
  # This wasn't working until replaced identity with ref in annotation index in Boot.pm  
  $annotation_collection->update($annotation_query, {'$set' => $annotation_body}, {"upsert" => 1, "multiple" => 0});
  
  $log->infof("Writing annotation: %s", $target->{name});
}
 
sub _ensure_details {
  my ($self, $database, $named_citations) = @_;
  my @keys = $named_citations->Keys();
  foreach my $key (@keys) {
    my $citation = $named_citations->FETCH($key);
    _ensure_citation_details($self, $database, $citation);
  }
}

sub _ensure_citation_details {
  my ($self, $database, $citation) = @_;
  my @required_fields = qw(author title journal volume issue pages date);
  return unless (grep { ! exists($citation->{$_}) } @required_fields);

  my $name = "pmid:".$citation->{pmid};
  $log->warnf("Missing publication details: checking against: $name");
  my $existing = $self->find_one_record($database, 'publications', {"name" => $name});
  if (! $existing) {
    carp("Can't find publication: $name");
    return;
  }

  my $publication = $existing->{sections}->{pubmed}->{data};
  $citation->{author}  ||=  [ map { "$_->{LastName} $_->{Initials}" } @{$publication->{Article}->{AuthorList}->{Author}} ];
  $citation->{title}   ||=  $publication->{ArticleTitle};
  $citation->{journal} ||=  $publication->{Article}->{Journal}->{ISOAbbreviation};
  $citation->{volume}  ||=  $publication->{Article}->{Journal}->{JournalIssue}->{Volume};
  $citation->{issue}   ||=  $publication->{Article}->{Journal}->{JournalIssue}->{Issue};
  $citation->{pages}   ||=  $publication->{Article}->{Pagination}->{MedlinePgn};
  $citation->{date}    ||=  $publication->{Article}->{Journal}->{JournalIssue}->{PubDate}->{MedlineDate};

  return;
}

# Managed to capture most authors under the vauthors tag.
# Need to implement second loop for 'authors' as well as for authors3+. Maybe retry a REGEX
sub _clean_authorship {
  my @authors;
  my ($citation) = @_;
  if (exists($citation->{author})) {
         @authors = split(/,\s*/, $citation->{author});
} elsif (exists($citation->{vauthors})) {
         @authors = split(/,\s*/, $citation->{vauthors});
} else { return; }

  my $index = 2; # Not sure if author3+ is captured due to it all being one string rather then a new tag
  while(1) {
    my $author = "author".$index;
    if (exists($citation->{$author})) {
      
      push @authors, $citation->{$author};
      delete $citation->{$author};
      $index++;
    } else {
      last;
    }
  }

  while(1) {
    my $first = "first".$index;
    my $last = "last".$index;
    if (exists($citation->{$first}) || exists($citation->{$last})) {
      push @authors, "$citation->{$last} $citation->{$first}";
      delete $citation->{$last};
      delete $citation->{$first};
      $index++;
    } else {
      last;
    }
  }
  $citation->{author} = \@authors;
  return;
}

sub output {
	my ($self, $registry) = @_;

  my $cached_data = $self->get_data($registry);

}

1;
