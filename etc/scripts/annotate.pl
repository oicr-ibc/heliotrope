#!/usr/bin/env perl -w

use strict;
use warnings;

use common::sense;

use MongoDB;
use MongoDB::OID;
use Getopt::Long;

my $class;
GetOptions ("class=s" => \$class) or die("Error in command line arguments\n");

$| = 1;

sub process {
  my $database_name = $ENV{HELIOTROPE_DATABASE_NAME} || "heliotrope";
  my $database_server = $ENV{HELIOTROPE_DATABASE_SERVER} || "localhost:27017";

	my @options = (dt_type => undef, host => $database_server);
	my $conn = MongoDB::MongoClient->new(@options);
  $conn->connect();

  my $database = $conn->get_database($database_name);
  my $collection = $database->get_collection('publications');

  while(<>) {
    my $id = $_;
    chomp($id);

    $collection->update({'_id' => MongoDB::OID->new($id)}, {'$addToSet' => {'classes' => $class}});
  }
}

process();

1;
