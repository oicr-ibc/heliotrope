#!/usr/bin/env perl -w

use strict;
use warnings;

use common::sense;

use Carp;
use Digest::SHA qw(sha1_hex);
use List::MoreUtils qw(first_index indexes);
use Lingua::StopWords qw(getStopWords);
use Lingua::Stem::Snowball;
use Text::CSV;
use PDL;

use constant E_PMID => 0;
use constant E_INDEX => 1;
use constant E_LABEL => 2;
use constant E_CLASS => 3;
use constant E_SYMBOL => 4;
use constant E_TEXT => 5;
use constant E_RULE => 6;

use constant RULE_KEY => 0;
use constant RULE_PATTERN => 1;
use constant RULE_LABEL => 2;
use constant RULE_SCORE => 3;

use constant WINDOW_SIZE => 10;
use constant END_AFTER => 10;
use constant RULES_PER_ITERATION => 3;

use constant SEED_RULES => [
  [">gene", qr/__TARGET__ gene\b/, 'positive', 0],
  ["[wild type", qr/\bwild type __TARGET__/, 'positive', 0],
  ["<syndrome", qr/\bsyndrome __TARGET__/, 'negative', 0],
  [">treatment", qr/__TARGET__ \btreatment\b/, 'negative', 0],
  ["<acid", qr/\bacid\b __TARGET__/, 'negative', 0],
];

use Heliotrope::Statistics qw(lexpected);

my $FILE = "/Users/swatt/data.csv";

sub tokenized {
  my ($symbol, $text) = @_;
  $text =~ s{[\(\)]}{}g;
  $text =~ s{\b}{ }g;
  $text =~ s{(\p{PosixPunct})(\p{PosixPunct})}{$1 $2}g;
  $text =~ s{\b$symbol\b}{__TARGET__}g;
  $text =~ s{\s+}{ }g;
  return $text;
}

sub with_file {
  my ($code) = @_;
  my $csv = Text::CSV->new({binary => 1}) or die "Cannot use CSV: ".Text::CSV->error_diag();
  eval {
    open my $fh, "<", $FILE or die("Can't open $FILE: $!");
    my $row = $csv->getline($fh);
    &$code($fh, $csv);
    close($fh);
  };
}

sub process {
  my $table = {};
  $table->{__classes} = ['positive', 'negative'];
  step1($table);
  step2($table);
  apply($table);
  accuracy($table);

  $table->{__iterations} = 0;

  my $i = 0;
  while(1) {
    say "Iteration: $i";
    step3($table);
    print_rules($table);
    apply($table);
    accuracy($table);
    $i++;
    last if ($i == END_AFTER);
  }
};

sub step1 {
  my ($table) = @_;
  say STDERR "Step 1 - reading data";
  with_file(sub {
    my ($fh, $csv) = @_;
    my $i = 0;
    $table->{__entries} = [];
    $table->{__entries_by_discourse} = {};
    $table->{__global_term_frequencies} = {};
    $table->{__global_counts} = {};
    while (my $row = $csv->getline($fh)) {
      say STDERR "$i " if (++$i % 10000 == 0);
      last if ($i == 2000);
      
      my ($pmid, $class, $gene, $journal, $title, $text) = @$row;
      my $text = tokenized($gene, "$title $text");
      my @tokens = split(/\s/, $text);
      my $j = 0;

      # Build a table of where the targets are
      my @indexes = indexes { $_ eq '__TARGET__' } @tokens;
      my %index_table = ();
      @index_table{@indexes} = ((1) x @indexes);

      # Now make all the symbols concrete again. This means symbols show as 
      # tokens around each target. 
      for(my $index = 0; $index <= $#tokens; $index++) {
        $tokens[$index] = $gene if ($tokens[$index] eq '__TARGET__');
      }

      for(my $index = 0; $index <= $#tokens; $index++) {
        if ($index_table{$index}) {
          my $before_start = $index - WINDOW_SIZE;
          my $before_end = $index - 1;
          my $after_start = $index + 1;
          my $after_end = $index + WINDOW_SIZE;
          $before_start = 0 if ($before_start < 0);
          $before_end = 0 if ($before_end < 0);
          $after_start = $#tokens if ($after_start > $#tokens);
          $after_end = $#tokens if ($after_end > $#tokens);
          my $before = join(' ', @tokens[$before_start..$before_end]);
          my $after = join(' ', @tokens[$after_start..$after_end]);
          if ($before) {
            $table->{__global_term_frequencies}->{'<'.$tokens[$before_end]}++;
            $table->{__global_counts}->{'<'}++;
          }
          if ($after) {
            $table->{__global_term_frequencies}->{'>'.$tokens[$after_start]}++;
            $table->{__global_counts}->{'>'}++;
          }
          if ($before_end - $before_start > 0) {
            $table->{__global_term_frequencies}->{'['.$tokens[$before_end-1].' '.$tokens[$before_end]}++;
            $table->{__global_counts}->{'['}++;
          }
          if ($after_end - $after_start > 0) {
            $table->{__global_term_frequencies}->{']'.$tokens[$after_start].' '.$tokens[$after_start+1]}++;
            $table->{__global_counts}->{']'}++;
          }
          if ($before && $after) {
            $table->{__global_term_frequencies}->{'@'.$tokens[$before_end].' '.$tokens[$after_start]}++;
            $table->{__global_counts}->{'@'}++;
          }
          my $text = $before.' __TARGET__ '.$after;
          $text =~ s{^\s+}{};
          $text =~ s{\s+$}{};
          my $entry = [$pmid, $j, undef, $class, $gene, $text, undef];
          push @{$table->{__entries}}, $entry;
          push @{$table->{__entries_by_discourse}->{$pmid}}, $entry;
          $j++;
        }
        # In all cases, even when this is a gene symbol, we add the term
        $table->{__global_term_frequencies}->{'#'.$tokens[$index]}++;
        $table->{__global_counts}->{'#'}++;
      }
    };
  });
  return;
}

sub step2 {
  my ($table) = @_;
  say STDERR "Step 2 - setting seed rules";
  $table->{__rules} = SEED_RULES;
}

sub apply {
  my ($table) = @_;
  say STDERR "Applying rules";
  my $entries = $table->{__entries};
  my $rules = $table->{__rules};
  my $count = @$entries;
  my $label_count = {};

  my $discourses = {};
  ENTRY: foreach my $entry (@$entries) {
    # say $entry->[E_CLASS].': '. $entry->[E_TEXT] if (defined($entry->[E_LABEL]));
    foreach my $rule (@$rules) {
      my $pattern = $rule->[RULE_PATTERN];
      my $label = $rule->[RULE_LABEL];
      my $key = $rule->[RULE_KEY];
      while ($entry->[E_TEXT] =~ m{$pattern}g) {
        $entry->[E_LABEL] = $label;
        $entry->[E_RULE] = [$key, $rule->[RULE_SCORE]];
        $label_count->{$label}++;
        $discourses->{$entry->[E_PMID]}++;
        next ENTRY;
      }
      $entry->[E_LABEL] = undef;
      $entry->[E_RULE] = undef;
    }
  }

  # Now we can re-label according to the score heuristic. This is the one sense per discourse
  # constraint. Here we collect all the identifiers that have any label, and go through them
  # one at a time.

  foreach my $key (keys %$discourses) {
    my @scores = ();
    my @entries = @{$table->{__entries_by_discourse}->{$key}};
    my @matched_entries = grep { $_->[E_RULE] } @entries;
    @matched_entries = sort { $b->[E_RULE]->[1] <=> $a->[E_RULE]->[1] } @matched_entries;
    my $top = $matched_entries[0];

    # If there is "substantial disagreement" we are supposed to return everything to the residual,
    # whatever "substantial disagreement" is supposed to mean. 

    croak if (! defined($top));
    foreach my $entry (@entries) {
      next if ($top == $entry);
      $entry->[E_LABEL] = $top->[E_LABEL];
      $entry->[E_RULE] = ["...".$top->[E_RULE]->[0], $top->[E_RULE]->[1]];
    }
  }

  foreach my $label (sort keys %$label_count) {
    my $proportion = 100 * $label_count->{$label} / $count;
    say STDERR sprintf("Labelled %s: %0.2f%% (%d of %d)", $label, $proportion, $label_count->{$label}, $count);
  }
}

# The actual Yarowsky smoothing function isn't actually defined within the 1995 paper. This
# implementation is based on Abney 2004. 

sub step3 {
  my ($table) = @_;
  $table->{__iterations}++;

  say STDERR "Step 3 - training classifier - iteration $table->{__iterations}";
  my $entries = $table->{__entries};
  my $classes = $table->{__classes};
  my $frequencies = {};
  my $sample_frequencies = {};
  my $label_frequencies = {};
  foreach my $entry (@$entries) {
    my $label = $entry->[E_LABEL];
    if (defined($label)) {
      $label_frequencies->{$label}++;
    }
    $label_frequencies->{'*'}++;
    my $text = $entry->[E_TEXT];
    my @tokens = split(/\s/, $text);
    my $position = first_index { $_ eq '__TARGET__' } @tokens;
    my $length = @tokens;
    for(my $i = 0; $i <= $#tokens; $i++) {
      next if ($i == $position);
      my $token = $tokens[$i];
      if (defined($label)) {
        $frequencies->{'<'.$token}->{$label}++ if ($i == $position - 1); 
        $frequencies->{'>'.$token}->{$label}++ if ($i == $position + 1);
        $frequencies->{'#'.$token}->{$label}++;
        $frequencies->{'<'.$token}->{'+'}++ if ($i == $position - 1);
        $frequencies->{'>'.$token}->{'+'}++ if ($i == $position + 1);
        $frequencies->{'#'.$token}->{'+'}++;
        $sample_frequencies->{$label}->{'<'}++ if ($i == $position - 1);
        $sample_frequencies->{$label}->{'>'}++ if ($i == $position + 1);
        $sample_frequencies->{$label}->{'#'}++;
        $sample_frequencies->{'*'}->{'<'}++ if ($i == $position - 1);
        $sample_frequencies->{'*'}->{'>'}++ if ($i == $position + 1);
        $sample_frequencies->{'*'}->{'#'}++;
      }
    }
    # And the special cases for boundary positions. 
    if (defined($label)) {
      $frequencies->{'['.$tokens[$position-2].' '.$tokens[$position-1]}->{$label}++ if ($position >= 2);
      $frequencies->{'@'.$tokens[$position-1].' '.$tokens[$position+1]}->{$label}++ if ($position >= 1 && $position+1 < $length);
      $frequencies->{']'.$tokens[$position+1].' '.$tokens[$position+2]}->{$label}++ if ($position+2 < $length);
      $frequencies->{'['.$tokens[$position-2].' '.$tokens[$position-1]}->{'+'}++ if ($position >= 2);
      $frequencies->{'@'.$tokens[$position-1].' '.$tokens[$position+1]}->{'+'}++ if ($position >= 1 && $position+1 < $length);
      $frequencies->{']'.$tokens[$position+1].' '.$tokens[$position+2]}->{'+'}++ if ($position+2 < $length);
      $sample_frequencies->{$label}->{'['}++ if ($position >= 2);
      $sample_frequencies->{$label}->{'@'}++ if ($position >= 1 && $position+1 < $length);
      $sample_frequencies->{$label}->{']'}++ if ($position+2 < $length);
      $sample_frequencies->{'*'}->{'['}++ if ($position >= 2);
      $sample_frequencies->{'*'}->{'@'}++ if ($position >= 1 && $position+1 < $length);
      $sample_frequencies->{'*'}->{']'}++ if ($position+2 < $length);
    }
  }
  say "Step 3 - removing residual-only tokens";
  my @remove = ();
  while(my ($key, $value) = each %$frequencies) {
    push @remove, $key if ($value->{'+'} < 1);
  }
  delete($frequencies->{$_}) foreach (@remove);

  say STDERR "Step 3 - calculating decision list";
  my $label_count = @$classes;
  my $rules = {};
  while(my ($key, $value) = each %$frequencies) {
    foreach my $label (@$classes) {
      my $labelled_feature_count = $value->{'+'};
      my $this_label_feature_count = $value->{$label};
      next unless ($this_label_feature_count);

      my $pattern = substr($key, 1);
      my $rule_type = substr($key, 0, 1);

      # Scoring also depends on the relative sizes of the two labels, which are not equal, or
      # at least cannot be assumed to be. This, the actual probability needs to include the
      # different numbers of exemplars of each type. 

      my $a1 = $this_label_feature_count;
      my $A1 = $table->{__global_term_frequencies}->{$key} - $a1;
      my $n1 = $sample_frequencies->{$label}->{$rule_type};
      my $N1 = $table->{__global_counts}->{$rule_type} - $n1;
      my $r1 = $sample_frequencies->{$label}->{$rule_type} / $table->{__global_counts}->{$rule_type};
      $DB::single = 1 if ($a1 == 0 && $A1 == 0);
      my $lexp1 = lexpected($r1, $a1, $A1, $n1, $N1);

      my $a2 = $labelled_feature_count - $this_label_feature_count;
      my $A2 = $table->{__global_term_frequencies}->{$key} - $a2;
      my $n2 = $sample_frequencies->{'*'}->{$rule_type} - $sample_frequencies->{$label}->{$rule_type};
      my $N2 = $table->{__global_counts}->{$rule_type} - $n2;
      $DB::single = 1 if ($a2 == 0 && $A2 == 0);
      my $lexp2 = lexpected($r1, $a2, $A2, $n2, $N2);

      my $diff = $lexp1 - $lexp2;
      my $score = $diff->at();

      push @{$rules->{$label}}, [$key, $label, $score];
    }
  }

  my $rule_limit = RULES_PER_ITERATION * $table->{__iterations};
  my @all_rules = ();
  while (my ($key, $value) = each %$rules) {
    push @all_rules, select_rules($rule_limit, @$value);
  }
  @all_rules = sort { $b->[RULE_SCORE] <=> $a->[RULE_SCORE] } @all_rules;
  $DB::single = 1;
  $table->{__rules} = \@all_rules;
}

sub select_rules {
  my ($rule_limit, @rules) = @_;
  my @sorted = sort { $b->[2] <=> $a->[2] } @rules;
  @sorted = @sorted[0..($rule_limit - 1)] if ($#sorted > $rule_limit);
  my @rules = map {
    my $rule = $_;
    my $key = $rule->[0];
    my $label = $rule->[1];
    my $score = $rule->[2];
    [$key, build_rule_pattern($key), $label, $score];
  } @sorted;
  return @rules;  
}

sub build_rule_pattern {
  my ($key) = @_;
  my $pattern = quotemeta(substr($key, 1));
  my $rule_type = substr($key, 0, 1);
  if ($rule_type eq '#') {
    $pattern = "(?:\^|\\s)$pattern(?:\$|\\s)";
  } elsif ($rule_type eq '<') {
    $pattern = "(?:\^|\\s)$pattern __TARGET__";
  } elsif ($rule_type eq '>') {
    $pattern = "__TARGET__ $pattern(?:\$|\\s)";
  } elsif ($rule_type eq '[') {
    my @tokens = split(/ /, $pattern);
    $pattern = "(?:\^|\\s)$tokens[0] $tokens[1] __TARGET__";
  } elsif ($rule_type eq ']') {
    my @tokens = split(/ /, $pattern);
    $pattern = "__TARGET__ $tokens[0] $tokens[1](?:\$|\\s)";
  } elsif ($rule_type eq '@') {
    my @tokens = split(/ /, $pattern);
    $pattern = "(?:\^|\\s)$tokens[0] __TARGET__ $tokens[1](?:\$|\\s)";
  } else {
    croak "Invalid rule: $key";
  }
  say $pattern;
  return qr/$pattern/;
}

sub accuracy {
  my ($table) = @_;
  my $entries = $table->{__entries};
  my $true_count = 0;
  my $classified_count = 0;
  my $entry_count = @$entries;
  foreach my $entry (@$entries) {
    if (defined($entry->[E_LABEL])) {
      $classified_count++;
      if ($entry->[E_LABEL] eq $entry->[E_CLASS]) {
        $true_count++; 
      } else {
        my $pmid = $entry->[E_PMID];
        my $symbol = $entry->[E_SYMBOL];
        my $label = $entry->[E_LABEL];
        my $class = $entry->[E_CLASS];
        my $text = $entry->[E_TEXT];
        my $rule = "$entry->[E_RULE]->[0]: $entry->[E_RULE]->[1]";
        say "Mismatched: $pmid, $symbol, $label, $class ($rule) => $text";
      }
    }
  }

  my $accuracy = 100 * $true_count / $classified_count;
  my $classified = 100 * $classified_count / $entry_count;
  say sprintf("Accuracy: %0.2f%% (coverage: %0.2f%%: %d of %d)", $accuracy, $classified, $classified_count, $entry_count);
}

sub print_rules {
  my ($table) = @_;
  say "Current rules";
  my $rules = $table->{__rules};
  foreach my $rule (@$rules) {
    my $key = $rule->[RULE_KEY];
    my $label = $rule->[RULE_LABEL];
    my $pattern = $rule->[RULE_PATTERN];
    my $score = $rule->[RULE_SCORE];
    say sprintf("%s %s %2.4f - %s", $key, $label, $score, $pattern);
  }
}

process();

1;