#!/usr/bin/env perl -w

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

use Carp;
use DBI;
use Spreadsheet::XLSX;

sub generate_schema  {
	my ($dbh, $file) = @_;
	
    my $excel = Spreadsheet::XLSX->new ($file);

	# First of all, let's build up the variable information
	
	my $variables = {};
	my $sheet = $excel->worksheet('Current_Variables');
	$sheet->{MaxRow} ||= $sheet->{MinRow};
	
	foreach my $row ($sheet->{MinRow} .. $sheet->{MaxRow}) {
		my $variable_name = $sheet->get_cell($row, 0);
        my $variable_label = $sheet->get_cell($row, 1);
        my $table_name = $sheet->get_cell($row, 3);
        my $data_type = $sheet->get_cell($row, 6);
        my $length = $sheet->get_cell($row, 7);
        $variables->{$table_name}->{$variable_name} = {label => $variable_label, type => $data_type, length => $length};
	}
	
	# Next, we need the constraints.
    $sheet = $excel->worksheet('Constraints');
    $sheet->{MaxRow} ||= $sheet->{MinRow};
	
	foreach my $row ($sheet->{MinRow} .. $sheet->{MaxRow}) {
        my $variable_name = $sheet->get_cell($row, 0);
        my $table_name = $sheet->get_cell($row, 1);
        my $constraint_name = $sheet->get_cell($row, 2);
        my $constraint_type = $sheet->get_cell($row, 3);
        my $references_table = $sheet->get_cell($row, 4);
        carp("Can't find variable $variable_name in table $table_name") unless (exists($variables->{$table_name}->{$variable_name}));
        push @{$variables->{$table_name}->{$variable_name}->{constraints}}, {name => $constraint_name, type => $constraint_type, references => $references_table};
    }
	
	# So now we can start to build the SQL, in a slightly encoded form to make 
	# it easier to assemble later; e.g., dependencies are easier to use in a
	# structure rather than plain text.
	
	my $tables = {};
	foreach my $table (keys %$variables) {
		$tables->{$table}->{identifier} = $dbh->quote_identifier($table);
		my @columns = sort keys %{$variables->{$table}};
		foreach my $column (@columns) {
			my $variable = $variables->{$table}->{$column};
			push @{$tables->{$table}->{clauses}}, _generate_clause($variable);
		}
	}
}

sub _generate_type {
	my ($variable) = @_;
	my $type = $variable->{type};
	my $length = $variable->{length};
	given ($type) {
		when('VARCHAR2') {
			return "VARCHAR($length)"
		}
		when('NUMBER') {
            return "INT";
        }
	}
}

sub _generate_clause {
	my ($variable) = @_;
	my $type = $variable->{type};
}

1;