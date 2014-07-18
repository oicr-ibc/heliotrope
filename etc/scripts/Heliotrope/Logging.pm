package Heliotrope::Logging;

use Log::Log4perl;
use Log::Any::Adapter;

use Sub::Exporter -setup => {
  exports => [ qw(get_logger) ],
};

Log::Log4perl::init('log4perl.conf');
Log::Any::Adapter->set('Log4perl');

use Log::Any qw($log);

sub get_logger {
  my ($package, $filename, $line) = caller();
  return Log::Any->get_logger(category => $package);
}

1;