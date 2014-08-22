package Heliotrope::Update::ClinicalTrials;

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

use boolean;
use DBI;
use HTTP::Request;
use File::Slurp;
use File::Temp;
use DateTime;
use Carp;
use IO::File;
use File::Listing qw(parse_dir);
use IO::Uncompress::Unzip;
use XML::LibXML;
use XML::LibXML::Reader;
use JSON;

use Heliotrope::Registry;
use Heliotrope::Data qw(resolve_references expand_references deep_eq);


sub BUILD {
	my ($self) = @_;
	$self->{name} = "clinical_trials";
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

    my ($data_file) = $self->get_target_file($registry, "clinical_trials.zip");
    my $zip = IO::Uncompress::Unzip->new($data_file);

    die "Zipfile has no members" if ! defined $zip->getHeaderInfo;

    my $counts = {};

    for (my $status = 1; $status > 0; $status = $zip->nextStream) {
        my $name = $zip->getHeaderInfo->{Name};
        # say "Processing member $name" ;

        my $reader = XML::LibXML::Reader->new(IO => $zip);

        # Skip to first entry element
        my $first = 1;
        my $whole;
        my $attributes = {};
        while($reader->read()) {
            $whole = $reader->copyCurrentNode(1) if ($first);
            $DB::single = 1 if ($first && $whole->toString() =~ m{\bKRAS\b});
            $first = 0;

            my $name = $reader->name();
            if ($name eq 'results_reference') {
                my @value = $reader->copyCurrentNode(1)->findnodes(qq{PMID});
                push @{$attributes->{results}}, map { $_->textContent() } @value if (@value);
            } elsif ($name eq 'condition') {
                my $value = $reader->copyCurrentNode(1)->textContent();
                push @{$attributes->{conditions}}, $value if ($value);
            } elsif ($name eq 'intervention') {
                $attributes->{intervention} = 1;
                my @value = $reader->copyCurrentNode(1)->findnodes(qq{intervention_type[text() = 'Drug']/following-sibling::intervention_name});
                push @{$attributes->{drugs}}, map { $_->textContent() } @value if (@value);
            } elsif ($name =~ m{^(nct_id|phase|condition|study_type|overall_status)$}) {
                my $value = $reader->copyCurrentNode(1)->textContent();
                $attributes->{$name} = $value if ($value);
            }
        }
        $counts->{records}++;
        $counts->{results}++ if ($attributes->{results});

        # say join(", ", @{$attributes->{conditions}}) if (exists($attributes->{results}));
        my $is_cancer = grep { $_ =~ m{(?:lymphoma|leukemia|cancer|tumou?rs?|neoplasm|sarcoma|melanoma|metastatic)}i } @{$attributes->{conditions}};
        if ($is_cancer && exists($attributes->{results})) {
            say encode_json($attributes);
        }

        # We could close the file handle $zip, but really that's probably not the right thing
        # to do here.
    }
    say encode_json($counts);
}

## Relevant <condition>s: Sarcoma, *Cancer, *Tumor, Lymphoma, Leukemia, Multiple Myeloma and Plasma Cell Neoplasm, *Tumors,
## Melanoma, Neoplasm Metastasis

sub entry {
    my ($self, $database, $cached_data, $reader) = @_;

    my $root = $reader->copyCurrentNode(1);

    my $name = $root->findvalue(qq{/Entrezgene-Set/Entrezgene/Entrezgene_gene/Gene-ref/Gene-ref_locus});
    if (! $name) {
    	return;
    }

    my $ensembl_id = $root->findvalue(qq{/Entrezgene-Set/Entrezgene/Entrezgene_gene/Gene-ref/Gene-ref_db/descendant-or-self::Object-id_str[string(../../../Dbtag_db) = 'Ensembl']});
    my $summary = $root->findvalue(qq{/Entrezgene-Set/Entrezgene/Entrezgene_summary});
    return unless $ensembl_id;
#    say "$name, $ensembl_id: " . ($summary && "found summary");

    my $entrez_alert = {
        level => "note",
        author => "entrez",
        text => "This information has been updated from Entrez on: $cached_data->{date}",
        date => DateTime->now()
    };

    my $changes = {};
    $changes->{'$inc'}->{version} = 1;
    $changes->{'$set'}->{'sections.description.data.summary'} = $summary;
    $changes->{'$addToSet'}->{'sections.description._alerts'} = $entrez_alert;

    my $result = $self->update_record($database, 'genes', {id => $ensembl_id}, $changes, {upsert => 0, multiple => 0, w => 1, j => true});
}

1;
