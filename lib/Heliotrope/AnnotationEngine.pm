package Heliotrope::AnnotationEngine;

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

use Moose;

use Carp;
use File::Spec;
use File::HomeDir;
use File::Temp;
use File::Copy;
use Storable;
use IO::CaptureOutput qw(capture);
use Try::Tiny;

use Heliotrope::Logging qw(get_logger);
use Heliotrope::Utilities qw(convert_codes_to_names);

my $log = get_logger();

has annotation_filename => (
  is  => 'rw'
);

has vep_directory => (
  is  => 'rw'
);

has cache_directory => (
  is  => 'rw'
);

sub BUILD {
  my ($self) = @_;
  $self->vep_directory($ENV{VEP_HOME} || File::Spec->rel2abs("variant_effect_predictor", File::HomeDir->my_home()));
  $self->cache_directory($ENV{VEP_CACHE_DIRECTORY} || File::Spec->rel2abs(".vep", File::HomeDir->my_home()));
}

sub get_annotations {
  my ($self, $callback, @args) = @_;

  my $var_filename = $self->annotation_filename();

  # In an ideal world, we'd use VEP and forking. We're not in an ideal world, so we do the forking
  # manually using Parallel::ForkManager. This is because VEP forking breaks.

  # my $output_filename = $self->_variant_effect_predictor("$var_filename");
  my $output_filename = "/Users/swatt/CosmicCodingMuts.out.vcf";

  open(my $var_fh, "<", "$output_filename") or die("Can't open: $output_filename: $!");
  try {
    &$callback($var_fh, @args);
  } catch {
    $log->warn("caught error: $_");
    $var_fh->close();
  };
}

#     my $previous_variation = "";
#     my @records = ();
#     my $merge = {};

#     while(my $line = <$var_fh>) {
#         chomp($line);
#         next if (substr($line, 0, 1) eq '#');
#         my ($variation, $location, $allele, $gene, $feature, $feature_type, $consequence, $cdna_position, $cds_position,
#             $protein_position, $admin_acid_change, $codon_change, $colocated, $extra) = split("\t", $line);

#         my @fields = split(";", $extra);
#         my $extra_fields = { map { split("=", $_, 2) } @fields };
#         next if (! exists($extra_fields->{CANONICAL}));
#         next if ($consequence eq 'downstream_gene_variant' ||
#                  $consequence eq 'upstream_gene_variant' ||
#                  $consequence eq 'intron_variant' ||
#                  $consequence =~ m{\bnc_transcript_variant\b});

#         # The HGVS variants are reported against a transcript or translation. We don't like that, as it's too fine
#         # when we are only using canonical transcripts, which we are. So we change them to the gene identifier,
#         # if they are present. The good news is this also serves for the fallbacks.

#         $extra_fields->{HGVSporiginal} = $extra_fields->{HGVSp}, $extra_fields->{HGVSp} =~ s{^ENS[^:]+}{$gene} if (exists($extra_fields->{HGVSp}));
#         $extra_fields->{HGVScoriginal} = $extra_fields->{HGVSc}, $extra_fields->{HGVSc} =~ s{^ENS[^:]+}{$gene} if (exists($extra_fields->{HGVSc}));

#         # Fix the NN's in the c. and n. variant descriptions - we really shouldn't have to do this, it is
#         # a VEP issue, probably or possibly.
#         my (undef, undef, $reference, $variant) = ($variation =~ m{^([0-9XYMT]+)_(\d+)_([ACGTN-]+)/([ACGTN-]+)});
#         if (exists($extra_fields->{HGVSc})) {
#             $DB::single = 1 if (! defined($reference));
#             $extra_fields->{HGVSc} =~ s{([cn]\.(?:\d|\*)+[^N]*)(N+)}{$1$reference};
#             $extra_fields->{_variant_allele} = $variant;
#             $extra_fields->{_reference_allele} = $reference;
#         }

#         # One more thing. Synonymous variants are reported as a DNA change and p.=. We should make these more
#         # COSMIC like. This ought to be dead code, as we skip them sooner than this, but the code may come
#         # in handy of we change that policy.

#         if ($consequence eq 'synonymous_variant') {
#             if (exists($extra_fields->{HGVSp}) && $extra_fields->{HGVSp} =~ m{^ENS[^:]+:[^\(]+\(p\.=\)$}) {
#                 my $amino = convert_codes_to_names($admin_acid_change);
#                 my $variant = "p.".$amino.$protein_position.$amino;
#                 $extra_fields->{HGVSp} = $gene.":".$variant;
#             }
#         }

#         # If there's nothing there, add this as a fallback label. These are something of a hack. Some of these are
#         # classed in COSMIC as whole gene deletions. They tend to be large scale deletions which are hard to
#         # handle. The only special case to be concerned about is the transcript_ablation, which is deliberately
#         # used in a fallback role, so any other values in HGVSp or HGVSc take priority.
#         if ($consequence eq 'transcript_ablation' ||
#             $consequence eq 'splice_donor_variant,coding_sequence_variant,5_prime_UTR_variant,intron_variant,feature_truncation' ||
#             $consequence eq 'splice_donor_variant,splice_acceptor_variant,coding_sequence_variant,5_prime_UTR_variant,intron_variant,feature_truncation') {
#             $extra_fields->{HGVSfallback} = 'p.0';
#         } elsif ($consequence eq 'splice_acceptor_variant,coding_sequence_variant,3_prime_UTR_variant,intron_variant,feature_truncation' ||
#                  $consequence eq 'splice_donor_variant,splice_acceptor_variant,coding_sequence_variant,3_prime_UTR_variant,intron_variant,feature_truncation') {
#             $extra_fields->{HGVSfallback} = 'p.?';
#         }

#         if ($variation ne $previous_variation) {
#             $previous_variation = $variation;
#             _handle_variant_block($merge, \@records) if (@records);
#             @records = ();
#         }

#         push @records, {
#             location => $location, allele => $allele, gene => $gene, feature => $feature,
#             feature_type => $feature_type, consequence => $consequence, cdna_position => $cdna_position,
#             cds_position => $cds_position, protein_position => $protein_position, amino_acid_change => $admin_acid_change,
#             codon_change => $codon_change, colocated => $colocated, extra => $extra_fields
#         };
#     }

#     _handle_variant_block($merge, \@records) if (@records);
#     close($var_fh);

#     return $merge;
# }

# sub _handle_variant_block {
#     my ($merge, $records) = @_;

#     # This is where we need to handle a block of useful records. We probably want to write all
#     # of these somewhere, as they are likely to be relevant. However, we also want to accumulate
#     # them by the protein change when we can, so that means building up some kind of a data
#     # record by protein change in memory.

#     # The sort is required for stability. Unless we do this, two identical sets of records can
#     # end up in a different order, and then be considered as distinct variants. The heuristic
#     # is a simple gene protein existence and gene identifier order. All will be listed under
#     # that variant anyway, this just ensures stability at this stage. We then can decide which
#     # gene to use later on.

#     my @records = sort { (exists($b->{extra}->{HGVSp}) <=> exists($a->{extra}->{HGVSp})) ||
#                          (exists($b->{extra}->{HGVSc}) <=> exists($a->{extra}->{HGVSc})) ||
#                          (exists($b->{extra}->{HGVSfallback}) <=> exists($a->{extra}->{HGVSfallback})) ||
#                          ($a->{gene} cmp $b->{gene}) } @$records;
#     foreach my $record (@records) {
#         my $key = $record->{extra}->{HGVSp} || $record->{extra}->{HGVSc} || $record->{extra}->{HGVSfallback};
#         push @{$merge->{$key}}, Storable::freeze(\@records);
#         last;
#     }
# }

sub _variant_effect_predictor {
  my ($self, $var_filename) = @_;

  my $stdout;
  my $stderr;
  my $status;

  # Before we run, we should really sort the input file, and preferably numerically by field, as
  # this means we handle data more efficiently in the prediction code. It's typically going to be a
  # few hundred megabytes or so, so let's spin it to the shell.
  #
  # We would gain if we could either (a) filter, or (b) fork. Both seem to be broken in the October
  # 2012 version. Filtering deletes variants which are missense because of up/downstream stuff,
  # and fork simply crashes. There is a performance issue here, but there isn't much we can do about
  # it.

  my $vep_dir = $self->vep_directory();
  my $cache_dir = $self->cache_directory();
  my $executable = $^X;
  my $command = ["-X", "$vep_dir/variant_effect_predictor.pl",
                 "--format", "vcf", "--vcf", "--offline", "--no_progress", "--canonical", "--check_existing",
                 "--force_overwrite", "--numbers", "--buffer_size", "5000", "--sift", "b", "--polyphen", "b",
                 "--compress", "gzcat",
                 "--dir_cache", $cache_dir,
                 "--input_file", "$var_filename",
                 "--output_file", "$var_filename.out.vcf",
                 "--hgvs",
                 "--fork", "8"];

  $log->info("Executing: ".$executable." ".join(" ", map { qq{"$_"}; } @$command));

  # We could probably dispense with some of this.
  capture {
    system($executable, @$command);
    $status = $?;
  } \$stdout, \$stderr, "$var_filename.stdout", "$var_filename.stderr";
  $status == 0 || croak("variant_effect_predictor.pl failed: exit status: $status; output: $stdout; error: $stderr");
}

1;

=head1 NAME

Heliotrope::AnnotationEngine

=head1 SYNOPSIS

  use Heliotrope::AnnotationEngine;

  my $engine = Heliotrope::AnnotationEngine->new();
  $engine->add_annotation_request("3", 178936082, 178936082, "G", "A", "+");
  $engine->add_annotation_request("12", 25398284, 25398284, "G", "A", "-");

  my $data = $engine->get_annotations();

=head1 DESCRIPTION

Abstracts logic for annotations. This allows a more flexible approach with different
annotation tools. It's important we do this, because there may be several components
that generate variant information, and each needs to work consistently.

=head1 NOTES

TBD.

=head1 AUTHOR

Stuart Watt E<lt>stuart.watt@oicr.on.caE<gt>

=head1 COPYRIGHT AND LICENSE

This program is free software; you can redistribute it and/or modify it
under the same terms as Perl itself.
