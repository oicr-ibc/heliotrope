package Heliotrope::Update::CancerGeneCensus;

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
with 'Heliotrope::Update::COSMICAccess';

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

use Net::SFTP::Foreign;
use HTML::TreeBuilder;
use LWP::Simple;
use LWP::UserAgent;
use HTTP::Request::Common;
use Text::CSV_PP;
use Data::Dumper;

use Heliotrope::Logging qw(get_logger);
use Heliotrope::Config;
use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);

my $log = get_logger();

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

    my $config = Heliotrope::Config::get_config();

    #$self->login($registry);
    #my ($version_string, $version_date) = $self->get_cosmic_version_date($registry);

    my $cached_data = $self->get_data($registry);
    my $existing = $self->get_target_file($registry, "cancer_gene_census.xls");

    #my $cached_data;
    #my $existing;
    my $version_date;
    my $cgc_url;

    if (! -e $existing) {
        $cached_data = {};
    }

    if (exists($cached_data->{date}) && $cached_data->{date} ge $version_date) {
        say "Existing file is new.";
        say "Skipping update.";
        return;
    }
    # COSMIC now offers the Cancer Gene Census in .csv format so
    # that file will be downloaded from their SFTP server
    use Net::SFTP::Foreign;
    my $host = "sftp-cancer.sanger.ac.uk";
    my %args = (
	"user"     => "jcook04\@uoguelph.ca",
	"password" => "H34rth1ng",
	"port"	   => "22" ) ;

    my $sftp = Net::SFTP::Foreign->new($host, %args);

    $log->infof("Downloading cancer_gene_census.csv");
    my $remote = "/files/grch38/cosmic/v79/cancer_gene_census.csv";
    my $locale = "../../../../.heliotrope/cancer_gene_census/cancer_gene_census.csv";
    $sftp->get($remote, $locale) or die "Unable to download cancer_gene_census.csv\n";

    #my $base_url = $self->base_url();
    #my $cgc_url = $base_url . "$version_string/cancer_gene_census.xls";
    #$log->infof("Downloading %s", $cgc_url);
    #$req = HTTP::Request->new(GET => $cgc_url);
    #my ($cgc_result, $cgc_file) = $self->get_resource($registry, $req);
    #$log->info("Download complete");

    # Now we can store the data file in the right place and update the cache
    $cached_data->{date} = $version_date;
    $cached_data->{url} = $cgc_url;
    $cached_data->{download_time} = DateTime->now()->iso8601();
    #$self->relocate_file($registry, $file, "cancer_gene_census.xls");
    #$self->set_data($registry, $cached_data);

    $self->update($registry);

}

sub update {
	my ($self, $registry) = @_;

    $log->info("About to update");
    $self->output($registry);
}

sub output {
	my ($self, $registry) = @_;

	my $cached_data = $self->get_data($registry);

	my ($data_file) = $self->get_target_file($registry, "cancer_gene_census.csv");

  # Since the Gene Census is now offered in CSV format, the abbreviations
  # will have to be acquired from the website directly
  open (my $fh, '<', $data_file) or die "Unable to open cancer_gene_census.csv\n";
  my $abbreviations = {};

  # Turn HTML source into string
  my $url = "https://cancer.sanger.ac.uk/census/abbreviations";
  my $t = HTML::TreeBuilder->new_from_url($url);
  my $tree = $t->as_HTML;

  # Defining abbreviation dictionary
  my $get_abbreviation = sub {
      my ($value) = @_;
      $abbreviations->{$value} || $value;
  };

  #J Creating Abbreviation-Term Hash
  #J Each row of the table has the string class="c", so I split based on this
  my $pattern = "class=\"c\"";
  my @rows = split /$pattern/, $tree;
  shift @rows; #J Removing headers

  foreach(@rows) {
          my $string = $_;
          my @strings;
          $string =~ /<td>(\N+)<\/td><td>(\N+)<\/td>/g;
	  my $key = $1;
	  my $value = $2;

	  $abbreviations->{$key} = $value;
  }

  ##J Get headers

 my $headers = <$fh>;
 my @headers = split /,/, $headers;

 @headers = map { my $in = lc($_); $in = trim($in); $in =~ s/[()]//g; $in =~ s/(?:\b\s+\b|\/)/_/gr; } @headers;
 shift(@headers); #J GeneID column used on its own, header not needed

 #foreach my $element (@headers) { print "$element\n"; } #J Uncomment this to see all headers after this line of code

 #my $worksheet = $workbook->worksheet('List');
 my $data = {};

 # Puts all values into @values array, making sure to account for commas found within double quotes and replacing spaces with _ using trim() function
 # Takes the gene symbol and makes the gene symbol the key for the rest of its line
 while (<$fh>) {
  my $parser = Text::CSV_PP->new();
  my $string = $_;
  $parser->parse($string);
  my @value = $parser->fields();
  @value = map { trim($_); } @value;
  my $gene = shift(@value);
  my %block = ();
  @block{@headers} = @value;
  $data->{$gene} = \%block;
  #print Dumper \%block; #J Uncomment this to see how the hash of arrays is structured
}

# Data now structured the same as it was with original code
# This is as far as it goes to organize values

  my $database = $self->open_database();

  my $reference_id_cache = {};

  my $date = $cached_data->{date};
  my $count = 0;
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
        text => "This information has been updated in the Sanger Cancer Gene Census dated:", #J The value $date was here, obtained from cache?
        date => DateTime->now()
      }],
      data => {}
    };
# Some of the headers had to be changed to match the files headers
    $gene_census_data->{data}->{somatic} = ($gene_data->{somatic} eq 'yes' ? boolean::true : boolean::false);
    $gene_census_data->{data}->{germline} = ($gene_data->{germline} eq 'yes' ? boolean::true : boolean::false);
    $gene_census_data->{data}->{chromosome_band} = $gene_data->{chr_band};
    $gene_census_data->{data}->{mutation_types} = [ map { &$get_abbreviation($_); } split(/\s*,\s+/, $gene_data->{mutation_types}) ];
    $gene_census_data->{data}->{tissue_types} = [ map { &$get_abbreviation($_); } split(/\s*,\s+/, $gene_data->{tissue_type}) ];
    $gene_census_data->{data}->{tumour_types_germline} = [ map { &$get_abbreviation($_); } split(/\s*,\s+/, $gene_data->{tumour_typesgermline}) ];
    $gene_census_data->{data}->{tumour_types_somatic} = [ map { &$get_abbreviation($_); } split(/\s*,\s+/, $gene_data->{tumour_typessomatic}) ];
    $gene_census_data->{data}->{molecular_genetics} = &$get_abbreviation($gene_data->{molecular_genetics} || '');
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
