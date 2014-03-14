#!/usr/bin/env perl -w

use strict;
use warnings;

use common::sense;

use Carp;
use MongoDB;
use Digest::SHA qw(sha1_hex);
use List::MoreUtils qw(indexes);
use Lingua::StopWords qw(getStopWords);
use Lingua::Stem::Snowball;
use Text::Unidecode;
use Text::CSV;

my $SAMPLE_COUNT = undef;

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

sub analyze_vectors {
  my ($table, $database, $publications, $csv) = @_;
  my $collection = $database->get_collection('weeber_publications');
  my $query = $collection->find();

  my $i = 0;
  while(! defined($SAMPLE_COUNT) || $i++ < $SAMPLE_COUNT) {
    my $publication = $query->next();
    last if (! defined($publication));
    next unless ($publications->{$publication->{_id}->value()});
    my ($class, $gene) = @{$publications->{$publication->{_id}->value()}};
    my ($journal, $title, $text) = get_abstract($database, $publication);
    
    my $vector = [];
    push @$vector, "$publication->{sections}->{pubmed}->{data}->{PMID}";
    push @$vector, $class;
    push @$vector, $gene;
    push @$vector, $journal;
    push @$vector, $title;
    push @$vector, $text;

    $csv->print(\*STDOUT, $vector);
  }
}

sub get_abstract {
  my ($database, $object) = @_;
  croak if (! defined($object));

  my $article = $object->{sections}->{pubmed}->{data}->{Article};
  my $title = $article->{ArticleTitle};
  my $abstract = $article->{Abstract}->{AbstractText};
  my $journal = $article->{Journal}->{ISOAbbreviation};

  return (unidecode($journal), unidecode($title), unidecode(join(" ", map { (exists($_->{Label}) ? $_->{Label} . ". " : "").($_->{value}); } @$abstract)));
}

sub get_tokens {
  my ($table, $text) = @_;
  my $stopwords = $table->{__stopwords};
  my $stemmer = $table->{__stemmer};
  my @words = map { lc($_); } $text =~ m{(\w+)}g;
  # return $stemmer->stem([grep { !$stopwords->{$_} } @words]);
  return grep { !$stopwords->{$_} && $_ !~ m{^\d+$} && length($_) > 1 } @words;
}

sub process {
  my $database_name = "heliotrope";
  my $local_server = "localhost:27017";

  my @options = (dt_type => undef, query_timeout => -1, auto_reconnect => 1, auto_connect => 0);

  my $conn = MongoDB::MongoClient->new(host => $local_server, @options);
  $conn->connect();
  my $database = $conn->get_database($database_name);

  my $genes = get_genes($database);
  my $publications = ();
  foreach my $gene (keys %$genes) {
    my $references = $genes->{$gene}->{references};
    foreach my $class (keys %$references) {
      foreach my $reference (@{$references->{$class}}) {
        $publications->{$reference->value()} = [$class, $gene];
      }
    }
  }

  my $table = {};
  $table->{__stopwords} = getStopWords('en');
  $table->{__stemmer} = Lingua::Stem::Snowball->new(lang => 'en');
  $table->{__vectors} = []; 

  my $csv = Text::CSV->new({ binary => 1 }) or die "Cannot use CSV: ".Text::CSV->error_diag();
  $csv->eol("\r\n");
  $csv->print(\*STDOUT, ['pmid', 'class', 'gene', 'journal', 'title', 'text']);

  analyze_vectors($table, $database, $publications, $csv);
}

process();

1;