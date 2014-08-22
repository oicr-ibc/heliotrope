package Heliotrope::Config;

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

use feature "state";

use Config::Any;

state $CONFIG;

sub merge_deeply {
  my ($obj1, $obj2) = @_;
  my @keys2 = keys %$obj2;
  foreach my $key2 (@keys2) {
    my $value1 = $obj1->{$key2};
    my $value2 = $obj2->{$key2};
    $obj1->{$key2} = (ref($value1) eq 'HASH' && ref($value2) eq 'HASH') ? merge_deeply($value1, $value2) : $value2
  }

  my @keys1 = keys %$obj1;
  foreach my $key1 (@keys1) {
    my $value1 = $obj1->{$key1};
    if ($value1 =~ s{__ENV\((\w+)\)__}{$ENV{$1}}eg) {
      $obj1->{$key1} = $value1;
    }
  }

  return $obj1;
}

sub get_config {
  if (! defined($CONFIG)) {
    my $config = Config::Any->load_files({files => ['build_data_local.yml', 'build_data.yml'], use_ext => 1, flatten_to_hash => 1});
    my $local = $config->{'build_data_local.yml'} // {};
    my $global = $config->{'build_data.yml'} // {};
    merge_deeply($global, $local);
    $CONFIG = $global;

  }
  return $CONFIG;
}

1;