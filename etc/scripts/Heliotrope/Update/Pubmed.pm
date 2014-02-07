package Heliotrope::Update::Pubmed;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use boolean;
use Carp;
use File::Find;
use IO::Uncompress::Gunzip;
use XML::LibXML;
use XML::LibXML::Reader;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

$| = 1;

sub BUILD {
    my ($self) = @_;
    $self->{name} = "pubmed";
}

sub maybe_update {
    my ($self, $registry, %options) = @_;
    return;
}

sub _handle_file {
    my ($self, $collection, $file) = @_;
    return unless ($file =~ /n\d{4,4}\.xml\.gz$/);

    say "Reading $file";
    my $fh = IO::Uncompress::Gunzip->new($file);
    my $reader = XML::LibXML::Reader->new(IO => $fh);

    # Skip to first entry element
    while($reader->read() && $reader->name() ne 'MedlineCitation') {};
    
    do {
        if ($reader->name() eq 'MedlineCitation') {
            entry($self, $collection, $reader)
        }
    } while($reader->nextSibling());

    close($fh);
}

sub _is_article {
    my ($root) = @_;

    my ($article) = ($root->findnodes('/MedlineCitation/Article'));
    return 0 unless ($article);
    return 0 unless ($article->exists("Abstract"));

    my $title = $article->findvalue("ArticleTitle");
    my $abstract = $article->findvalue("Abstract");
    my $title_abstract = "$title\n$abstract";

    my @publication_types = $article->findnodes("PublicationTypeList/*");
    my @mesh_terms = $article->findnodes("MeshHeadingList/*");

    my $trial_publication_type = grep { $_->textContent() eq 'Clinical Trial' } @publication_types;
    my $trial_mesh_term = grep { $_->textContent() =~ /^clinical trial/i } @mesh_terms;

    my $trial_terms = $title_abstract =~ /\bclinical\b/i && $title_abstract =~ /\btrial\b/i;

    if ($trial_terms || $trial_publication_type || $trial_mesh_term) {
        return 1;
    }
    return 0;

        #   isArticle = (article) ->
        # articleData = article["Article"]
        # if articleData.hasOwnProperty 'Abstract'
        #   articleTitle = getElementText(articleData["ArticleTitle"])
        #   articleAbstractText = getElementText(articleData["Abstract"])
        #   articleTitleAndAbstractText = articleTitle + "\n" + articleAbstractText

        #   publicationTypes = if articleData["PublicationTypeList"]? then articleData["PublicationTypeList"]["$children"] else []
        #   meshTerms = if article["MeshHeadingList"]? then article["MeshHeadingList"]["$children"] else []

        #   trialPublicationType = publicationTypes.some((type) -> getElementText(type) == 'Clinical Trial')
        #   trialMeshTerm = meshTerms.some (mesh) -> clinicalTrialRegexp.test(getElementText(mesh["DescriptorName"]))

        #   trialTerms = clinicalRegexp.test(articleTitleAndAbstractText) && trialRegexp.test(articleTitleAndAbstractText)

        #   trialTerms || trialPublicationType || trialMeshTerm
        # else
        #   false

}

sub entry {
    my ($self, $collection, $reader) = @_; 
    
    my $xml = $reader->readOuterXml();    
    my $dom = XML::LibXML->load_xml(string => $xml, clean_namespaces => 1);
    my $root = $dom->documentElement();
    
    my $pmid = $root->findvalue('/MedlineCitation/PMID');

    if (_is_article($root)) {
        my $encoded = convert_document_to_json($root, "");
        $encoded->STORE('PMID', "$pmid");

        my $query = {name => "pmid:$pmid"};

        my $action = {'$set' => Tie::IxHash->new()};
        $action->{'$set'}->STORE('id', "pmid:$pmid");
        $action->{'$set'}->STORE('name', "pmid:$pmid");
        $action->{'$set'}->STORE('sections.pubmed', {"data" => $encoded});

        my $result = $collection->update($query, $action, {upsert => true, w => 1, j => true});
        say "Written: pmid:$pmid, updated $result->{n} records";
    };
}

sub update {
	my ($self, $registry) = @_;

    say "About to update.";

    my $database = $self->open_database();
    my $collection = $database->get_collection('publications');
    $collection->ensure_index({"name" => 1}, { unique => true, sparse => true, safe => true });

    my $base = "/Users/swatt/pubmed_xml";
    my $wanted = sub {
        _handle_file($self, $collection, $File::Find::name);
    };
    find({wanted => $wanted, nochdir => 1}, $base);

    $self->close_database($database);

    # $self->output($registry);
}

my $element_list_entries = {
  "/Article/AuthorList/Author" => 1,
  "/Article/Abstract/AbstractText" => 1,
  "/Article/PublicationTypeList/PublicationType" => 1,
  "/Article/DataBankList/DataBank" => 1,
  "/Article/DataBankList/DataBank/AccessionNumberList/AccessionNumber" => 1,
  "/Article/Language" => 1,
  "/Article/ELocationID" => 1,
  "/ChemicalList/Chemical" => 1,
  "/MeshHeadingList/MeshHeading" => 1,
  "/MeshHeadingList/MeshHeading/QualifierName" => 1,
  "/CitationSubset" => 1,
  "/Article/GrantList/Grant" => 1,
  "/OtherID" => 1,
  "/CommentsCorrectionsList/CommentsCorrections" => 1,
  "/KeywordList/Keyword" => 1,
  "/GeneralNote" => 1,
  "/InvestigatorList/Investigator" => 1,
  "/SupplMeshList/SupplMeshName" => 1,
  "/PersonalNameSubjectList/PersonalNameSubject" => 1,
  "/GeneSymbolList/GeneSymbol" => 1
};

my $object_list_entries = {
  "/Article/Abstract/AbstractText" => 1
};

my $date_list_entries = {
  "/DateCreated" => 1,
  "/DateCompleted" => 1,
  "/DateRevised" => 1,
  "/Article/ArticleDate" => 1
};

sub convert_document_to_json {
    my ($element, $path) = @_;

    my $result = Tie::IxHash->new();

    my @children = $element->findnodes("*");
    my @attributes = $element->findnodes("@*");
    foreach my $child (@children) {

        foreach my $attr (@attributes) {
            $result->STORE($attr->nodeName(), $attr->getValue());
        }

        my $field = $child->nodeName();
        my $new_path = $path . "/" . $field;
        my $child_result = convert_document_to_json($child, $new_path);

        if ($element_list_entries->{$new_path}) {
            if (! $result->EXISTS($field)) {
                $result->STORE($field, []);
            }
            my $list = $result->FETCH($field);
            push @$list, $child_result;
        } else {
            if ($result->EXISTS($field)) {
                carp("Duplicate entry in: $new_path, " . $element->toString());
            }
            $result->STORE($field, $child_result);
        }
        if ($date_list_entries->{$new_path}) {
            my $date = $result->FETCH($field);
            my $datetime = DateTime->new(year => $date->FETCH('Year'), month => $date->FETCH('Month'), day => $date->FETCH('Day'), time_zone => "UTC");
            $result->STORE($field, $datetime);
        }
    }
    if (! @children && defined($element->textContent())) {

        if (@attributes || $object_list_entries->{$path}) {
            foreach my $attr (@attributes) {
                $result->STORE($attr->nodeName(), $attr->textContent());
            }
            $result->STORE('value', $element->textContent());
        } else {
            return $element->textContent();
        }
    } else {
        foreach my $attr (@attributes) {
            $result->STORE($attr->nodeName(), $attr->getValue());
        }
    }
    return $result;
}

sub output {
	my ($self, $registry) = @_;
	
    my $database = $self->open_database();
    my $collection = $database->get_collection('pubmed');

    $collection->ensure_index({"name" => 1}, { unique => true, sparse => true, safe => true });

    my $query = $collection->find({name => {'$exists' => false}}, {PMID => 1});
    my @pmids = ();
    while (my $object = $query->next()) {
        push @pmids, $object->{PMID};
    }

    my $count = @pmids;
    say "About to update $count documents";

    $DB::single = 1;
    foreach my $pmid (@pmids) {
        my $result = $collection->update({PMID => "$pmid"}, {'$set' => {name => "pmid:$pmid", id => "pmid:$pmid"}}, {w => 1, j => true});
        say "Update: $pmid updated $result->{n} documents";
    }

    $collection->drop_index({name => 1});
    $collection->ensure_index({id => 1});
    $collection->ensure_index({name => 1});

    $self->close_database($database);
}

1;