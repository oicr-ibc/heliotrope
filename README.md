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

*  node.js -- web server, providing core server systems
*  MongoDB -- data storage for the knowledge base and tracking system
*  Perl -- used to build the initial primary knowledge base from exterbal sources
*  Java runtime -- used by the reporting system to generate PDF files


Installation
------------

First, install the dependencies (node.js, MongoDB, Perl, and a Java runtime). Check out Heliotrope using:

  $ git clone git@github.com:oicr-ibc/heliotrope.git
  $ cd heliotrope


Initializing the knowledge base
-------------------------------

To be written.


Security
--------

Heliotrope uses separate databases for the tracking system (which may contain confidential patient-level information) and for the knowledge base (which
is derived entirely from public sources and curation). 

Authentication is based on LDAP. 

