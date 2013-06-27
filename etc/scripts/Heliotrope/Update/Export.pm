package Heliotrope::Update::Export;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use boolean;
use DBI;
use HTTP::Request;
use File::Slurp;
use File::Temp;
use DateTime;
use Carp;
use IO::File;
use MongoDB;
use IO::Uncompress::Gunzip;
use XML::LibXML;
use XML::LibXML::Reader;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);
use Heliotrope::Utilities qw(trim);

sub BUILD {
    my ($self) = @_;
    $self->{name} = "export";
}

sub maybe_update {
    my ($self, $registry, %options) = @_;
       
    $self->update($registry);
    
}

sub update {
    my ($self, $registry) = @_;

    say "About to update.";
    
    $self->output($registry);
}

sub output {
    my ($self, $registry) = @_;
    
    my $database = $self->open_database();
    my $collection = $database->variants;

    my $cached_data = $self->get_data($registry);
    
    my ($data_file) = $self->get_target_file($registry, "export.xml.gz");
    my $fh = IO::Uncompress::Gunzip->new($data_file);
    my $reader = XML::LibXML::Reader->new(IO => $fh);
    
    say "Reading export data from: $data_file";

    # Skip to first entry element
    while($reader->read() && $reader->name() ne 'mutation') {};
    
    do {
        if ($reader->name() eq 'mutation') {
            entry($self, $registry, $database, $reader)
        }
    } while($reader->nextSibling());
    $self->close_database($database);
}

sub entry { 
    my ($self, $registry, $database, $reader) = @_; 
    
    my $xml = $reader->readOuterXml();    
    my $dom = XML::LibXML->load_xml(string => $xml, clean_namespaces => 1);
    my $root = $dom->documentElement();
    
    my $gene = $root->getAttribute('gene');
    my $mutation = $root->getAttribute('mutation');
    
    my $last_edited_by = $root->findvalue('/mutation/lastEditedBy');
    return unless ($last_edited_by);
    
    my $start = $root->getAttribute('start');
    my $stop = $root->getAttribute('stop');
    my $chromosome = $root->getAttribute('chromosome');
    my $var_allele = $root->getAttribute('varAllele');
    
    my $reference_id_cache = {};
    
    my $existing = $self->find_one_record($database, 'variants', {gene => $gene, shortMutation => "p.$mutation"});
    if ($existing) {
    	update_mutation($self, $registry, $database, $existing, $root);
    } else {
    	say "Mutation: $gene $mutation -> not found";
    }
}

sub extract_references {
	my ($string) = @_;
	return [ map {
		my $reference = {};
		@{$reference}{qw(type id)} = split(":", trim($_));
		$reference;
	} (split(qr/[,;]/, $string)) ];
}

sub update_mutation {
	my ($self, $registry, $database, $existing, $root, $reference_id_cache) = @_;
	
    say "Updating Mutation: $existing->{gene} $existing->{shortMutation}";
    
    my $clinical_data = {
        data => {}
    };
    
    # Now we can update the clinical information, and even references to given drugs,
    # when we want to. That's probably a good plan eventually, but not quite yet.
    
    # First do the characteristics.
    my ($characteristics) = $root->findnodes('/mutation/annotation/characteristics');
    
    my $action_data = {};
    
    $action_data->{type} = trim($characteristics->findvalue('action'));
    if (my $reference = $characteristics->findvalue('actionReference')) {
    	$action_data->{reference} = extract_references(trim($reference));
    }
    if (my $comment = $characteristics->findvalue('actionComment')) {
    	$action_data->{comment} = trim($comment);
    }
    $clinical_data->{data}->{action} = $action_data;
    
    # Now do the sensitivies, there may be several...
    foreach my $sensitivity ($root->findnodes('/mutation/annotation/sensitivity')) {
    	my $sensitivity_data = {};
        $sensitivity_data->{_id} = new MongoDB::OID();
    	$sensitivity_data->{name} = trim($sensitivity->findvalue('agents'));
    	$sensitivity_data->{sensitivity} = trim($sensitivity->findvalue('sensitivityType'));
    	push @{$clinical_data->{data}->{agents}}, $sensitivity_data;
    }
    
    # Some metadata
    if (my $last_edited_by = $root->findvalue('/mutation/lastEditedBy')) {   	
        $clinical_data->{data}->{lastEditedBy} = $last_edited_by;
    }
    
    # And the clinical significances, again there may be several... The tumour type, at least, 
    # can and should be a reference. Not that it should really matter. 
    foreach my $significance ($root->findnodes('/mutation/annotation/significance')) {
        my $significance_data = {};
        $significance_data->{_id} = new MongoDB::OID();
        $significance_data->{tumourType} = trim($significance->findvalue('tumourType'));
        $significance_data->{studyType} = trim($significance->findvalue('type'));
        $significance_data->{levelOfEvidence} = trim($significance->findvalue('significanceEvidence'));
	    if (my $reference = $significance->findvalue('significanceReference')) {
	    	$significance_data->{reference} = extract_references(trim($reference));
        }
        if (my $comment = $significance->findvalue('significanceComment')) {
            $significance_data->{comment} = trim($comment);
        }
        
        push @{$clinical_data->{data}->{significance}}, $significance_data;
    }

    my $new = expand_references($existing);
    $new->{sections}->{clinical} = $clinical_data;
    my $resolved = resolve_references($new, $existing);
        
    if (! deep_eq($resolved, $existing)) {
          
        foreach my $reference (@{$resolved->{references}}) {
            next if ($reference->{_id});
              
            if (my $id = $reference_id_cache->{$reference->{ref}}->{$reference->{name}}) {
                $reference->{_id} = $id;
            } else {
                my $collection = $reference->{ref};
                if (my $existing = $self->find_one_record($database, $collection, {name => $reference->{name}})) {
                    $reference->{_id} = $existing->{_id};
                    $reference_id_cache->{$reference->{ref}}->{$reference->{name}} = $reference->{_id};
                } else {
                    my $copy = clone($reference);
                    delete($copy->{ref});
                    $reference->{_id} = $self->save_record($database, $collection, $copy, {w => 1, j => true});
                    $reference_id_cache->{$reference->{ref}}->{$reference->{name}} = $reference->{_id};
                }
            }
            next;
        }
          
        $resolved->{version} = $resolved->{version} + 1;
          
        $self->save_record($database, 'variants', $resolved, {w => 1, j => true});
    }
}

1;