package Heliotrope::Analyse::Publications;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Store';

use boolean;
use Carp;
use DateTime::Tiny;

use Heliotrope::Data qw(resolve_references expand_references deep_eq);

$| = 1;

sub _is_article {
  my ($document) = @_;

  my $body = $document->{sections}->{pubmed}->{data};
  return 0 unless $body;
  my $article = $body->{Article};
  return 0 unless ($article);
  return 0 unless (defined($article->{Abstract}));

  my $title = $article->{ArticleTitle};
  my $abstract = $article->{Abstract};
  my $abstract_text = join(" ", map { $_->{value} } @{$abstract->{AbstractText}});
  my $title_abstract = "$title\n$abstract_text";

  my $trial_terms = $title_abstract =~ /\bclinical\b/i && $title_abstract =~ /\btrial\b/i;
  return 1 if ($trial_terms);

  my @publication_types = @{$article->{PublicationTypeList}->{PublicationType}};
  my $trial_publication_type = @publication_types && grep { $_ eq 'Clinical Trial' } @publication_types;
  return 1 if ($trial_publication_type);

  my @mesh_terms = $body->{MeshHeadingList} ? @{$body->{MeshHeadingList}->{MeshHeading}} : ();
  my $trial_mesh_term = @mesh_terms && grep { $_->{DescriptorName}->{value} =~ /^clinical trial/i } @mesh_terms;
  return 1 if ($trial_mesh_term);

  return 0;
}

sub analyse {
  my ($self) = @_;
  my $database = $self->open_database(dt_type => undef);
  my $publications = $database->get_collection('publications');
  my $tags = $database->get_collection('tags');

  my $cursor = $publications->find({});
  while (my $object = $cursor->next()) {
    if (_is_article($object)) {
      $tags->update({_id => $object->{_id}}, {'$addToSet' => {'classes' => "ct:haynes"}}, {upsert => true});
      say "$object->{_id}";
    }
  }

  $self->close_database();
}

1;
