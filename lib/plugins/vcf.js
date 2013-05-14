var fs = require("fs"),
    sys = require("sys"),
    lazy = require("lazy"),
    mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient,
    GridStore = mongo.GridStore,
    genomics = require("../genomics"),
    tracker = require("../tracker");

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

function recordObservations(db, data, callback) {
  var blocks = data["BLOCKS"];
  var studyId = data["studyId"];
  var role = data["role"];
  var identity = data["identity"];
  var responses = [];
  
  tracker.findEntity(db, studyId, "samples", identity, function(err, sample) {
    //console.log("Sample", sample);
    var fields = tracker.getEntityFields(sample);
    //console.log("Fields", fields);
    var sampleIdentifier = sample["_id"];
    var participantIdentifier = fields["participantEntityRef"]["ref"];

    function recordObservationList(db, blocks, callback) {
      if (blocks.length == 0) {
        data["responses"] = responses;
        delete data["BLOCKS"];
        return callback(null, data);
      }
      
      var block = blocks.shift();
      var request = {};
      request["params"] = {
        "study" : "id;" + studyId, 
        "role" : "observations", 
        "identity" : "id;new", 
        "step" : "observation"
      };

      // If it's synonymous, skip the block. We could have done this much sooner, I guess,
      // but thats a judgement call. 
      if (block["VARIANT"]["Consequence"] === "synonymous_variant") {
        return recordObservationList(db, blocks, callback);
      }

      var HGVSc = block["VARIANT"]["HGVSc"].replace(/^ENS\w[0-9\.]+:/, "");
      var HGVSp = block["VARIANT"]["HGVSp"].replace(/^ENS\w[0-9\.]+:/, "");
      
      request["body"] = {};
      request["body"]["data"] = {};
      request["body"]["data"]["step"] = {};
      request["body"]["data"]["step"]["fields"] = {
        "label" : {"value" : block["VARIANT"]["HGNC"] + " " + (HGVSp || HGVSc)},
        "sampleEntityRef" : {"value" : new BSON.ObjectID(sampleIdentifier.toString())},
        "participantEntityRef" : {"value" : new BSON.ObjectID(participantIdentifier.toString())},
        "genomicPosition" : {"value" : block["#CHROM"].substring(3) + ":" + block["POS"] + "-" + (parseInt(block["POS"]) + block["REF"].length)},
        "genomicChange" : {"value" : block["REF"] + "/" + block["ALT"]},
        "geneName" : {"value" : block["VARIANT"]["HGNC"]},
        "geneId" : {"value" : block["VARIANT"]["Gene"]},
        "transcriptId" : {"value" : block["VARIANT"]["Feature"]},
        "aminoAcidMutation" : {"value" : HGVSp},
        "dnaMutation" : {"value" : HGVSc},
        "depth" : {"value" : block["QUAL"]}
      };
      
      //console.log("About to write entity step", sys.inspect(request, null, 4));
      tracker.postEntityStep(err, db, request, function(db, err, url, statusCode) {
        //console.log("Maybe all is well", err, url, statusCode);
        if (! err) {
          return recordObservationList(db, blocks, callback);
        } else {
          return callback(err, null);
        }
      });
    }
    
    return recordObservationList(db, blocks, callback)
  });
} 

function parseVcfFile(db, data, callback) {
  
  // Oh noes. We don't have a file, we have some weird MongoDB thing.
  var identifier = data.files[0];
  //console.log("Reading from file", identifier);
  var gridStore = new GridStore(db, identifier, "r");
  
  gridStore.open(function(err, gs) {
    gridStore.readlines(function(ignore, lines) { 
      parseVcfLines(db, data, lines, function() {
        recordObservations(db, data, callback);
      });
    })
  });
}
  
function parseVcfLines(db, data, lines, callback) {
  var metadataPattern = new RegExp(/^##/);
  var infoMetadataPattern = new RegExp(/^##(INFO|FORMAT)=<ID=(\w+),([^>]+)>\s*$/);
  var csqFormatPattern = new RegExp(/Format: ([\w_|]+)/);
  var info = {};
  var header;
  var dataLine = 0;
  var lineNumber = 0;
  var infoMetadata = {};
  var formatMetadata = {};
  var blocks = [];
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
    
    var csq = infoMetadata["CSQ"];
    if (! csq) {
      throw new Error("Missing CSQ INFO properties");
    }
    
    var format = csq["Description"].match(csqFormatPattern);
    if (! format) {
      throw new Error("Missing CSQ Format setting in description");
    }
    
    csqFieldNames = format[1].split("|");
    //console.log("Field names", sys.inspect(csqFieldNames));
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

          // Discard any inconsequential consequences
          var consequence = csqData["Consequence"];
          if (consequence == "downstream_gene_variant" ||
              consequence == "upstream_gene_variant" ||
              consequence == "intron_variant" ||
              consequence.match(/\bnc_transcript_variant\b/)) {
            continue;
          }
          
          if (consequence == 'transcript_ablation' ||
             consequence == 'splice_donor_variant,coding_sequence_variant,5_prime_UTR_variant,intron_variant,feature_truncation' ||
             consequence == 'splice_donor_variant,splice_acceptor_variant,coding_sequence_variant,5_prime_UTR_variant,intron_variant,feature_truncation') {
            csqData["HGVSfallback"] = 'p.0';
          } else if (consequence == 'splice_acceptor_variant,coding_sequence_variant,3_prime_UTR_variant,intron_variant,feature_truncation' ||
                    consequence == 'splice_donor_variant,splice_acceptor_variant,coding_sequence_variant,3_prime_UTR_variant,intron_variant,feature_truncation') {
            csqData["HGVSfallback"] = 'p.?';
          }

          if (consequence == 'synonymous_variant') {
            if (csqData.hasOwnProperty("HGVSp")) {
              //console.log("synonymous_variant", csqData.HGVSp);
              csqData.HGVSp = csqData.HGVSp.replace(/^ENS[^:]+:[^\(]+\(p\.=\)$/, function(match) {
                //console.log("synonymous_variant replacement", csqData.HGVSp);
                var amino = genomics.convertCodesToNames(csqData["Allele"]);
                var variant = "p." + amino + csqData["Protein_position"] + amino;
                return csqData["Feature"] + ":" + variant;
              });
            }
          }
          
          // The CSQ - at ths stage we should really create a new observation, or some other
          // kind of a step execution. This is a plugin, so we can do that by modelling up and 
          // faking some kind of queued request. The result from that can hen be injected back. 
          // Only issue is, we should really be doing this asynchronously, and the easiest way
          // to manage that is to bundle up the requests into a data block and then pipeline 
          // them through at the end. We can wait until we have completed this entire file
          // before we do that. 
          //console.log("Data", sys.inspect({block: block, csq: csqData}));
          block["VARIANT"] = csqData;
        }
      }
    }
    
    var format = block["FORMAT"];
    var formatKeys = format.split(":");
    var formatKeysLength = formatKeys.length;
    
    // Chomp off the fixed columns. All that remain are sample columns
    var samples = Object.keys(block);
    samples.splice(0, 9);
    //console.log("Samples", sys.inspect(samples, null, 2));
    var sampleLength = samples.length;
    // If this isn't 1, we have an issue, and really ought to reject everything. 
    // In fact, we should have done so long before we get here. So for now, let's assume we
    // only have 1. 
    
    for(var i = 0; i < sampleLength; i++) {
      var sample = samples[i];
      var formatData = block[sample];
      var formatDataValues = formatData.split(":");
      var formatBlock = {};
      for(var j = 0; j < formatKeysLength; j++) {
        var formatKey = formatKeys[j];
        var formatDataValue = formatDataValues[j];
        var formatMetadataString = formatMetadata[formatKey];
        formatBlock[formatKey] = formatDataValue;
        //console.log("Format", sys.inspect({f: formatKey, l: formatDataValue, d: formatMetadataString}, null, 2));
      }
      block["SAMPLE"] = sample;
      block["DATA"] = formatBlock;
      break;
    }
    
    // By here, everything should be in the block. This is for a single data line, so if we bulk up the lines
    // info a block, we can inject them back as observations. 
    if (block["VARIANT"]) {
      blocks.push(block);      
    }
  }
  
  lines.forEach(function(input){
    //console.log("I", input);
    ++lineNumber;
    var line = input.toString();
    //console.log("line", line);
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

  data["BLOCKS"] = blocks;
  return callback(null, data);
}

/**
 * Export the main entry point. The component can be invoked dynamically
 * through a require and a method name. 
 */
module.exports.parseVcfFile = parseVcfFile;

function handleVcf(db, data, callback) {
  //console.log("Calling parseVcfFile", sys.inspect(data, null, 2));

  parseVcfFile(db, data, function(err, response) {
    //console.log("Callback from parseVcfFile", sys.inspect(response, null, 2));
    return callback(null, response);
  });
}

module.exports.handleVcf = handleVcf;

//parseVcfFile("/Users/swatt/variant_effect_predictor/GEN2-128-4ARC_out.vcf");