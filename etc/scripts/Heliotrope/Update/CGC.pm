package Heliotrope::Update::CGC;

use common::sense;

use MooseX::Singleton;

with 'Heliotrope::Updater';
with 'Heliotrope::Store';

use boolean;
use DBI;
use HTTP::Request;
use File::Slurp;
use File::Temp;
use Spreadsheet::ParseExcel;
use DateTime;
use Carp;
use IO::File;
use IO::Uncompress::Gunzip;
use File::Listing qw(parse_dir);

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

sub BUILD {
    my ($self) = @_;
    $self->{name} = "cancer_gene_census";
}

sub trim {
    my ($value) = @_;
    $value =~ s/^\s+//;
    $value =~ s/\s+$//;
    $value;
}

sub maybe_update {
    my ($self, $registry, %options) = @_;
    
    my ($req, $result, $file);
    
    # First of all, we need to locate the right directory
    my $base_url = "ftp://ftp.sanger.ac.uk/pub/CGP/cosmic/data_export/";
    $req = HTTP::Request->new(GET => $base_url);
    $req->header(Accept => "text/ftp-dir-listing, */*;q=0.1"); 
    ($result, $file) = $self->get_resource($registry, $req);
    my $listing = read_file($file);

    my @records = parse_dir($listing);
    my ($census) = grep { $_->[0] eq 'cancer_gene_census.xls' } @records;
    
    my $dt = DateTime->from_epoch(epoch => $census->[3]);
    my $normalized_date = $dt->format_cldr("yyyy-MM-dd");
    say "Normalized: $normalized_date.";
    
    my $cached_data = $self->get_data($registry);
    my $existing = $self->get_target_file($registry, "cancer_gene_census.xls");
    
    if (! -e $existing) {
        $cached_data = {};
    }
    
    if (exists($cached_data->{date}) && $cached_data->{date} ge $normalized_date) {
        say "Existing file is new.";
        say "Skipping update.";
        return;
    }

    my $cgc_url = $base_url . "cancer_gene_census.xls";
    say "Downloading $cgc_url.";
    $req = HTTP::Request->new(GET => $cgc_url);
    ($result, $file) = $self->get_resource($registry, $req);
    say "Download complete.";

    # Now we can store the data file in the right place and update the cache       
    $cached_data->{date} = $normalized_date;
    $cached_data->{url} = $cgc_url;
    $cached_data->{download_time} = DateTime->now()->iso8601();
    $self->relocate_file($registry, $file, "cancer_gene_census.xls");
    $self->set_data($registry, $cached_data);
   
    $self->update($registry);
    
}

sub update {
	my ($self, $registry) = @_;

    say "About to update.";
    $self->output($registry);
}

sub output {
	my ($self, $registry) = @_;
	
	my $cached_data = $self->get_data($registry);
	
	my ($data_file) = $self->get_target_file($registry, "cancer_gene_census.xls");
    my $parser   = Spreadsheet::ParseExcel->new();
    my $workbook = $parser->parse($data_file);
    
    my $abbreviations = {};
    my $abbreviations_worksheet = $workbook->worksheet('Abbreviations');
    
    my $get_abbreviation = sub {
        my ($value) = @_;
        $abbreviations->{$value} || $value;
    };
    
    my ($row_min, $row_max) = $abbreviations_worksheet->row_range();
    $row_min++;
    for my $row ( $row_min .. $row_max ) {
        my $key = trim($abbreviations_worksheet->get_cell($row, 0)->unformatted());
        my $value = trim($abbreviations_worksheet->get_cell($row, 1)->unformatted());
        $abbreviations->{$key} = $value;
    }
    
    my $worksheet = $workbook->worksheet('List');
    ($row_min, $row_max) = $worksheet->row_range();
    my ($col_min, $col_max) = $worksheet->col_range();
    
    my @headers = map { $worksheet->get_cell($row_min, $_)->unformatted(); } ($col_min .. $col_max);
    @headers = map { my $in = lc($_); $in = trim($in); $in =~ s/[()]//g; $in =~ s/(?:\b\s+\b|\/)/_/gr; } @headers;
    shift(@headers);
    
    $row_min++;
    my $data = {};
    for my $row ($row_min .. $row_max) {
        my @values = map { my $cell = $worksheet->get_cell($row, $_);  trim(($cell && $cell->unformatted()) || '');  } ($col_min .. $col_max);
        my $gene = shift(@values);
        my %block = ();
        @block{@headers} = @values;
        $data->{$gene} = \%block;
    }
    
    my $database = $self->open_database();
    
    my $reference_id_cache = {};
    
    my $date = $cached_data->{date};
    
    foreach my $gene (sort keys %$data) {
        my $gene_data = $data->{$gene};
        
        my $existing = $self->find_one_record($database, 'genes', {"name" => $gene});
        if (! defined($existing)) {
            carp("Can't locate: $gene");
            next;
        }
        
        $existing->{name} = $gene unless (exists($existing->{name}));
        $existing->{version} = 1 unless (exists($existing->{version}));
        
        my $gene_census_data = {
            _format => "gene_census_data",
            _alerts => [{
                level => "note", 
                author => "sanger",
                text => "This information has been updated in the Sanger Cancer Gene Census dated: $date",
                date => DateTime->now()
            }],
            data => {}
        };
        
        $gene_census_data->{data}->{somatic} = ($gene_data->{cancer_somatic_mut} eq 'yes' ? boolean::true : boolean::false);
        $gene_census_data->{data}->{germline} = ($gene_data->{cancer_germline_mut} eq 'yes' ? boolean::true : boolean::false);
        $gene_census_data->{data}->{chromosome_band} = $gene_data->{chr_band};
        $gene_census_data->{data}->{mutation_types} = [ map { &$get_abbreviation($_); } split(/\s*,\s+/, $gene_data->{mutation_type}) ];
        $gene_census_data->{data}->{tissue_types} = [ map { &$get_abbreviation($_); } split(/\s*,\s+/, $gene_data->{tissue_type}) ];
        $gene_census_data->{data}->{tumour_types_germline} = [ map { &$get_abbreviation($_); } split(/\s*,\s+/, $gene_data->{tumour_types_germline_mutations}) ];
        $gene_census_data->{data}->{tumour_types_somatic} = [ map { &$get_abbreviation($_); } split(/\s*,\s+/, $gene_data->{tumour_types_somatic_mutations}) ];
        $gene_census_data->{data}->{molecular_genetics} = &$get_abbreviation($gene_data->{cancer_molecular_genetics} || '');
        $gene_census_data->{data}->{name} = $gene_data->{name};
        $gene_census_data->{data}->{translocation_partners} = [ split(/\s*,\s+/, $gene_data->{translocation_partner}) ];
        
        # This bunch of stuff doesn't actually contain any relations, so we don't really need to expand
        # and resolve relations before we proceed. We can simply add in the new data and do a 
        # deep comparison. However, we probably should go through the same process, partly
        # because it's safe, and partly because it's the right thing to do as it does the right
        # kind of deep copying needed to test the result.
        
        my $new = expand_references($existing);
        $new->{sections}->{gene_census_data} = $gene_census_data;
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
            
            $self->save_record($database, 'genes', $resolved, {w => 1, j => true});
        }
    }
    
    $self->close_database($database);
}

1;