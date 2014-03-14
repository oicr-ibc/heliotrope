#!/usr/bin/env perl -w

use strict;
use warnings;

use common::sense;

use Carp;
use MongoDB;
use Digest::SHA qw(sha1_hex);
use List::MoreUtils qw(indexes);
use Lingua::StopWords qw(getStopWords);

$| = 1;

sub get_genes {
  my ($database) = @_;
  my $collection = $database->get_collection('weeber_genes');
  my $query = $collection->find();
  my $result = {};
  while(my $object = $query->next()) {
    my $digest = sha1_hex($object->{name});
    next unless $digest =~ m{^[0-7]};
    $result->{$object->{name}} = $object;
  }
  return $result;
}

sub analyze {
  my ($table, $database, $genes) = @_;
  my @genes = sort keys %$genes;
  @genes = @genes[0..4];
  foreach my $gene (@genes) {
    analyze_gene($table, $database, $genes->{$gene});
  }
}

sub get_abstract {
  my ($database, $publication) = @_;
  my $collection = $database->get_collection('weeber_publications');
  my $object = $collection->find_one({_id => $publication});
  croak if (! defined($object));

  my $article = $object->{sections}->{pubmed}->{data}->{Article};
  my $title = $article->{ArticleTitle};
  my $abstract = $article->{Abstract}->{AbstractText};

  return join(" ", map { (exists($_->{Label}) ? $_->{Label} . ". " : "").($_->{value}); } @$abstract);
}

sub get_tokens {
  my ($table, $text) = @_;
  my $stopwords = $table->{__stopwords};
  my @words = $text =~ m{(\w+)}g;
  return grep { !$stopwords->{$_} } @words;
}

sub with_tokens {
  my ($tokens, $index, $code) = @_;
  my $end = $#$tokens;
  my %windows = (
    'LW' => [-20..-2],
    'LA' => [-1..-1],
    'UA' => [1..1],
    'UW' => [2..20],
  );
  foreach my $window (keys %windows) {
    foreach my $point (@{$windows{$window}}) {
      my $entry = $index + $point;
      next if ($entry < 0 || $entry > $end);
      &$code($tokens, $window, $entry);
    }
  }
}

sub analyze_gene_publication {
  my ($table, $database, $gene, $class, $publication) = @_;
  my $abstract = get_abstract($database, $publication);

  # Now we can mock the gene symbol in the text into a generic placeholder, __TARGET__.
  my $symbol = $gene->{name};
  $abstract =~ s{$symbol}{__TARGET__}g;

  # Now we tokenize. 
  my @tokens = get_tokens($table, $abstract);
  $DB::single = 1;

  # Now we compute the windows. 
  my @indexes = indexes { $_ eq '__TARGET__' } @tokens;
  foreach my $index (@indexes) {
    with_tokens(\@tokens, $index, sub {
      my ($tokens, $window, $entry) = @_;
      my $token = $tokens->[$entry];
      $table->{$token}->{$class}->{$window}++;
    })
  }

  return;
}

sub analyze_gene {
  my ($table, $database, $gene) = @_;
  say $gene->{name};
  my $references = $gene->{references};
  foreach my $class (sort keys %$references) {
    my $publications = $references->{$class};
    foreach my $publication (@$publications) {
      analyze_gene_publication($table, $database, $gene, $class, $publication);
    }
  }
}

sub process {
  my $database_name = "heliotrope";
  my $local_server = "localhost:27017";

  my @options = (dt_type => undef, query_timeout => -1, auto_reconnect => 1, auto_connect => 0);

  my $conn = MongoDB::MongoClient->new(host => $local_server, @options);
  $conn->connect();
  my $database = $conn->get_database($database_name);
  my $weeber_publications_collection = $database->get_collection('weeber_publications');

  my $genes = get_genes($database);
  my $table = {};
  $table->{__stopwords} = getStopWords('en');
  analyze($table, $database, $genes);

  say "token,PLW,PLA,PUA,PUW,NLW,NLA,NUA,NUW";
  foreach my $token (sort keys %$table) {
    my $data = $table->{$token};
    my @classes = qw(positive negative);
    my @windows = qw(LW LA UA UW);
    my @result = ();
    foreach my $class (@classes) {
      my $cdata = $data->{$class};
      foreach my $window (@windows) {
        if (exists($data->{$class}->{$window})) {
          push @result, $data->{$class}->{$window};
        } else {
          push @result, 0;
        }
      }
    }
    say join(",", ($token, @result));
  }
}

process();

1;