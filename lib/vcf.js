/*
 * VCF file parsing module. This is designed to read data from VCF files, and identify 
 * variants and related sample information. The logic is relatively flexible, but that
 * is something of an issue, since VCF files are very open as to the information that
 * is stored in them. Heliotrope requires a number of mandatory fields in its VCF file
 * format (above and beyond the basic positional information), including:
 * 
 * - a sample identifier
 * 
 * And for mutations:
 * - HGVS nomenclature description of a mutation at protein level
 * - HGVS nomenclature description of a mutation at DNA level
 * - quality information
 * 
 * Note that the output from VEP is not a VCF file, but a specific format. We do want
 * to transform that into a VCF file, but we don't need to do that within Heliotrope. 
 * Fortunately, there is prior work on that:
 * https://github.com/VertebrateResequencing/vr-codebase/blob/develop/scripts/vcf2consequences_vep
 * 
 * Working with Brian's VCF, command used:
 * perl variant_effect_predictor.pl --input_file brian_sample.vcf \
 * --force_overwrite --output_file brian.out --format vcf --vcf \
 * --hgvs --offline --fasta ../annovar/humandb/hg19seq/ \
 * --compress "gunzip -c"
 */

var fs = require("fs");