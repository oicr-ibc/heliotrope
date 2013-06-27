#!/bin/bash

# This script initializes the knowledge base. Best run when you have plenty of time
# to spare. 

perl -I. boot.pl
perl -I. ensembl.pl
perl -I. cosmic.pl
perl -I. entrez.pl
perl -I. cgc.pl
