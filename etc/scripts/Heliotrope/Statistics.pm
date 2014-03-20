package Heliotrope::Statistics;

use common::sense;

use Exporter::Easy (
  OK => [ 'lexpected' ]
);

use PDL;

sub lbeta {
  my ($x, $y) = @_;
  my ($xp) = lgamma($x);
  my ($yp) = lgamma($y);
  my ($sp) = lgamma($x + $y);
  return $xp + $yp - $sp;
}

use constant f0 => lbeta(0.5, 0.5);

sub lexpected {
  my ($r, $a, $A, $n, $N) = @_;
  my $lbeta0 = lbeta($A + 0.5, $N - $A + 0.5);
  my $lbeta1 = lbeta(0.5, 0.5);

  my $lr = PDL::log($r);
  my $lrn = PDL::log(1 - $r);
  my $one = pdl(1.0);

  my $lv1 = $lr + lbeta($A + $a + 1.5, $N - $A + $n - $a + 0.5) - $lbeta0;
  my $lv2 = $lrn + lbeta($a + 1.5, $n - $a + 0.5) - $lbeta1;
  my $lv3 = $lr + lbeta($A + $a + 0.5, $N - $A + $n - $a + 0.5) - $lbeta0;
  my $lv4 = $lrn + lbeta($a + 0.5, $n - $a + 0.5) - $lbeta1;

  # We're getting overflow risks here This means we need to handle addition better.
  #
  # \log_b (a+c) = \log_b a + \log_b (1+b^{\log_b c - \log_b a})
  # http://en.wikipedia.org/wiki/List_of_logarithmic_identities

  my $numerator = $lv1 + PDL::log($one + PDL::exp($lv2 - $lv1));
  my $denominator = $lv3 + PDL::log($one + PDL::exp($lv4 - $lv3));

  my $result = $numerator - $denominator;
  return $result;
}

# say exp(lexpected(0.5, 0, 0, 10, 100));

1;