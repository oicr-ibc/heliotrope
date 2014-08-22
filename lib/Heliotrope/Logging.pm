package Heliotrope::Logging;

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

use Log::Log4perl;
use Log::Any::Adapter;
use File::Spec;

state $CONFIG_PATH = do {
  my $found = 'log4perl.conf';
  foreach my $path (@INC) {
    my $full = File::Spec->rel2abs($found, $path);
    if (-f $full) {
      $found = $full;
      last;
    }
  }
  $found;
};

use Sub::Exporter -setup => {
  exports => [ qw(get_logger) ],
};

Log::Log4perl::init($CONFIG_PATH);
Log::Any::Adapter->set('Log4perl');

use Log::Any qw($log);

sub get_logger {
  my ($package, $filename, $line) = caller();
  return Log::Any->get_logger(category => $package);
}

1;