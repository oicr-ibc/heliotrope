#!/bin/bash

export HELIOTROPE_DATABASE_NAME=test
perl -I. boot.pl --force
perl -I. ensembl.pl --force
perl -I. cosmic.pl --force
perl -I. entrez.pl --force
perl -I. cgc.pl --force
perl -I. export.pl --force
