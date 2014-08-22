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
use Heliotrope::Config;

my $log = get_logger();

has annotation_filename => (
  is  => 'rw'
);

has vep_home => (
  is  => 'rw'
);

has vep_cache_directory => (
  is  => 'rw'
);

has vep_fork_limit => (
  is  => 'rw',
  default => sub { 8; }
);

has vep_fork_buffer_size => (
  is  => 'rw',
  default => sub { 5000; }
);

has vep_decompress => (
  is  => 'rw',
  default => sub { 'gzcat'; }
);

has vep_options => (
  is  => 'rw',
  default => sub { [
    "--format", "vcf", "--vcf", "--offline", "--no_progress", "--canonical", "--check_existing", "--force_overwrite", "--numbers", "--hgvs",
    "--sift", "b", "--polyphen", "b"
  ] }
);

sub BUILD {
  my ($self) = @_;
  my $config = Heliotrope::Config::get_config();
  $self->vep_home($config->{vep_home} || File::Spec->rel2abs("variant_effect_predictor", File::HomeDir->my_home()));
  $self->vep_cache_directory($config->{vep_cache_directory} || File::Spec->rel2abs(".vep", File::HomeDir->my_home()));

  $self->vep_fork_limit($config->{vep_fork_limit}) if (exists($config->{vep_fork_limit}));
  $self->vep_fork_buffer_size($config->{vep_fork_buffer_size}) if (exists($config->{vep_fork_buffer_size}));
  $self->vep_decompress($config->{vep_decompress}) if (exists($config->{vep_decompress}));
  $self->vep_options($config->{vep_options}) if (exists($config->{vep_options}));
}

sub get_annotations {
  my ($self, $callback, @args) = @_;

  $DB::single = 1;
  my $var_filename = $self->annotation_filename();

  # In an ideal world, we'd use VEP and forking. We're not in an ideal world, so we do the forking
  # manually using Parallel::ForkManager. This is because VEP forking breaks far more often than
  # it should.

  my $output_filename = $self->_variant_effect_predictor("$var_filename");

  open(my $var_fh, "<", "$output_filename") or die("Can't open: $output_filename: $!");
  try {
    &$callback($var_fh, @args);
  } catch {
    $log->warn("caught error: $_");
    $var_fh->close();
  };
}

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

  my $vep_dir = $self->vep_home();
  my $cache_dir = $self->vep_cache_directory();
  my $options = $self->vep_options();
  my $executable = $^X;
  my $command = ["-X", "$vep_dir/variant_effect_predictor.pl",
                 @$options,
                 "--buffer_size", $self->vep_fork_buffer_size(),
                 "--compress", $self->vep_decompress(),
                 "--dir_cache", $cache_dir,
                 "--input_file", "$var_filename",
                 "--output_file", "$var_filename.out.vcf",
                 "--fork", $self->vep_fork_limit() ];

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

