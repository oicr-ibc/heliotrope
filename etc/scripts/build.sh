#!/bin/bash

# This script initializes the knowledge base. Best run when you have plenty of time
# to spare.

export TMPDIR=

export HELIOTROPE_DATABASE_NAME=heliotrope_new
export HELIOTROPE_DATABASE_SERVER=localhost:27017
export HELIOTROPE_DATABASE_USERNAME=
export HELIOTROPE_DATABASE_PASSWORD=

export HELIOTROPE_CACHE_ROOT=/Volumes/LaCie/data/heliotrope

export VEP_HOME=
export VEP_CACHE_DIRECTORY=

perl boot.pl --force
perl ensembl.pl --force
perl cosmic.pl --force
perl entrez.pl --force
perl cancer_gene_census.pl --force
