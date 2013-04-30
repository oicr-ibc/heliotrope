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
 * 
 * The module creates data descriptions for observations and hands them to a callback.
 * The callback is called with a single object containing the following keys:
 * 
 * - type - one of: mutation/..., and only mutation is supported right now
 * - gene - gene name, basically there to make presentation easy; can be inferred
 * - chromosome - string 1-21, X, Y, MT, etc., can be inferred
 * - geneId - Ensembl gene identifier; can be inferred
 * - transcriptId - Ensembl transcript identifier
 * - sampleId - sample identifier (could be missing, if it can be inferred)
 * - HGVSc - nomenclature description of a mutation at DNA level (not guaranteed to exist)
 * - HGVSp - nomenclature description of a mutation at protein level
 * - positionCDS - coding sequence position, can be missing
 * - variantAllele - a string, or maybe "-"
 * - referenceAllele - a string, or maybe "-"
 * - positionAA - protein position, an integer, can be missing
 * - quality - a nested object of quality information
 * - details - a nested object, start, stop, genomic stuff
 */

var fs = require("fs"),
    lazy = require("lazy");

var sys = require("sys");

/**
 * A handy utility function: takes an array of keys and an array of values, and returns
 * a new object by pairing them.
 * @param keys
 * @param values
 * @returns new object
 */
function pair(keys, values) {
  var result = {};
  var length = keys.length;
  if (length !== values.length) {
    throw new Error("Key and value array lengths differ");
  }
  for(var i = 0; i < length; i++) {
    result[keys[i]] = values[i];
  }
  return result;
}

function parseVcfFile(filename) {
  var lazyLines = new lazy(fs.createReadStream(filename)).lines;
  var metadataPattern = new RegExp(/^##/);
  var infoMetadataPattern = new RegExp(/^##(INFO|FORMAT)=<ID=(\w+),([^>]+)>\s*$/);
  var csqFormatPattern = new RegExp(/Format: ([\w_|]+)/);
  var info = {};
  var header;
  var dataLine = 0;
  var lineNumber = 0;
  var infoMetadata = {};
  var formatMetadata = {};
  var csqFieldNames;
  
  /**
   * Used to unpack an info string into an object, using the keyPattern
   * @param string
   * @returns a new object
   */
  function unpackInfoString(string) {
    var result = {};
    
    var match;
    var keyPattern = new RegExp(/(\w+)=([^=,"]+|"[^"]*")/g);
    while (true) {
      var match = keyPattern.exec(string);
      if (match == null) {
        break;
      }
      result[match[1]] = match[2];
    }
    return result;
  }
  
  /**
   * Handler for a line of metadata
   * @param line
   */
  function handleMetadataLine(line) {
    var matches = line.match(infoMetadataPattern);
    debugger;
    if (matches) {
      var key = matches[1];
      var identifier = matches[2];
      if (key == "INFO" && ! infoMetadata[identifier]) {
        infoMetadata[identifier] = unpackInfoString(matches[3]);
      } else if (key == "FORMAT" && ! formatMetadata[identifier]) {
        formatMetadata[identifier] = unpackInfoString(matches[3]);
      }
    }
  }
  
  /**
   * Handler for the header (first non-metadata) row
   * @param data
   */
  function handleHeaderRow(data) {
    header = data;
    
    debugger;
    var csq = infoMetadata["CSQ"];
    if (! csq) {
      throw new Error("Missing CSQ INFO properties");
    }
    
    var format = csq["Description"].match(csqFormatPattern);
    if (! format) {
      throw new Error("Missing CSQ Format setting in description");
    }
    
    csqFieldNames = format[1].split("|");
    console.log("Field names", sys.inspect(csqFieldNames));
  }
  
  /**
   * Handler for a data row
   * @param data
   */
  function handleDataRow(data) { 
    if (data.length !== header.length) {
      throw new Error('Header and data rows have different number of columns at line: ' + lineNumber);
    }
    var block = pair(header, data);
    var info = block["INFO"];
    if (! info) {
      throw new Error('Missing INFO field at line: ' + lineNumber);
    }
    
    var infoBlock = info.split(";");
    var infoBlockLength = infoBlock.length;
    for(var i = 0; i < infoBlockLength; i++) {
      
      // Unlike Perl, split with a limit just truncates, so we re-join to get back the
      // field body with additional = signs. 
      var values = infoBlock[i].split("=");
      var infoKey = values.shift();
      var infoValue = values.join("=");
      
      // CSQ is our field.
      if (infoKey === "CSQ") {
        var csqs = infoValue.split(",");
        var csqsLength = csqs.length;
        for(var j = 0; j < csqsLength; j++) {
          var csqData = pair(csqFieldNames, csqs[j].split("|"));
          
          // Discard data outside the canonical transcript.
          if (! csqData["CANONICAL"]) {
            continue;
          }
          console.log(sys.inspect(csqData));
        }
      }
    }
    
    var format = block["FORMAT"];
    var formatKeys = format.split(":");
    var formatKeysLength = formatKeys.length;
    
    // Chomp off the fixed columns. All that remain are sample columns
    var samples = Object.keys(block);
    samples.splice(0, 9);
    console.log("Samples", sys.inspect(samples, null, 2));
    var sampleLength = samples.length;
    
    for(var i = 0; i < sampleLength; i++) {
      var sample = samples[i];
      var formatData = block[sample];
      var formatDataValues = formatData.split(":");
      for(var j = 0; j < formatKeysLength; j++) {
        var formatKey = formatKeys[j];
        var formatDataValue = formatDataValues[j];
        var formatMetadataString = formatMetadata[formatKey];
        console.log("Format", sys.inspect({f: formatKey, l: formatDataValue, d: formatMetadataString}, null, 2));
      }
    }
  }
  
  /**
   * Iterates lazily through the file's input stream. As close to a
   * common file-based iteration as is easily possible. 
   */
  lazyLines.forEach(function(input){
    ++lineNumber;
    var line = input.toString();
    if (line.match(metadataPattern)) {
      return handleMetadataLine(line);
    } else {
      var data = line.split("\t");
      if (dataLine++ === 0) {
        return handleHeaderRow(data);
      } else {
        return handleDataRow(data);
      }
    }
  });
}

/**
 * Export the main entry point. The component can be invoked dynamically
 * through a require and a method name. 
 */
module.exports.parseVcfFile = parseVcfFile;

parseVcfFile("/Users/swatt/variant_effect_predictor/GEN2-128-4ARC_out.vcf");