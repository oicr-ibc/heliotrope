Heliotrope
==========

Heliotrope is an integrated clinical genomics application, developed as the next generation of our
system for managing clinical genomics trials, as described in 
[Clinical genomics information management software linking cancer genome sequence and clinical decisions](http://www.ncbi.nlm.nih.gov/pubmed/23603536).

This second-generation implementation provides the following features:

*  A configurable tracking system, able to log actions to participants, samples, and observed variants
*  A flexible knowledge base, with information on genes and most frequent mutations
*  High-quality variant reports generated automatically
*  Knowledge base annotation, allowing clinical publication information to be attached to known variants
*  Direct import of sample results from VCF files

Heliotrope depends on these technologies:

*  node.js -- web server, providing core server systems (tested with node 0.10.7)
*  MongoDB -- data storage for the knowledge base and tracking system (tested with MongoDB 2.4.3)
*  Perl -- used to build the initial primary knowledge base from exterbal sources (tested with Perl 5.16.1)
*  Java runtime -- used by the reporting system to generate PDF files (tested with Oracle Java 1.7.0_11)


Installation
------------

First, install the dependencies (node.js, MongoDB, Perl, and a Java runtime). Check out Heliotrope using:

```shell
$ git clone git@github.com:oicr-ibc/heliotrope.git
$ cd heliotrope
$ npm install
$ cake build
$ cake server
```

Initializing the knowledge base
-------------------------------

Before Heliotrope can work effectively, it is a good idea to initialize the knowledge base. This takes a good
few hours, and requires a number of other dependencies. In particular, it requires the Ensembl variant 
effect predictor (VEP), which itself requires a copy of the human reference genome hg19 and databases for
SIFT and PolyPhen annotation of variants. 

The knowledge base initialization system is primarily written in Perl. Most recent Perl versions should be
able to do this, with the right modules installed, but it is usually a good idea to build a clean one using
`perlbrew`, mostly to avoid OS Perl contamination. 

Heliotrope currently includes adapters to read and draw on the following information sources when constructing
its knowledge base:

*  Boot -- always used first
*  Ensembl -- always used next, primary gene information source
*  COSMIC -- used to calculate variant frequencies
*  Entrez -- used as a source for gene descriptions
*  Sanger Cancer Gene Census -- cancer-specific gene-level annotation


Security
--------

Heliotrope uses separate databases for the tracking system (which may contain confidential patient-level information) and for the knowledge base (which
is derived entirely from public sources and curation). 

Authentication is based on LDAP. 

