#!/usr/bin/env perl -w

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