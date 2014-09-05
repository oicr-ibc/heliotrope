async =           require('async')
temp =            require('temp')
fs =              require('fs')
log4js =          require('log4js')
Lazy =            require('lazy')
mongo =           require("mongodb")
MongoClient =     mongo.MongoClient
GridStore =       mongo.GridStore

spawn =           require("child_process").spawn

config = require('../lib/configuration').getConfiguration()

appEvents = require('../lib/events')
logger = log4js.getLogger('vcf')

logger.info "Loading plugin: vcf"

## This is where we can hook into the handling lifecycle. This allows us to get
## data from the system. The event gives us a few additional routines that we
## can use, as a convenience for the plugin framework.

pair = (keys, values) ->
  result = {}
  length = keys.length
  if length != values.length
    throw new Error("Key and value array lengths differ")

  for i in [0..length - 1]
    result[keys[i]] = values[i]

  result


createObservationRecord = (studyId, block) ->

  HGVSc = block["VARIANT"]["HGVSc"].replace(/^ENS\w[0-9\.]+:/, "")
  HGVSp = block["VARIANT"]["HGVSp"].replace(/^ENS\w[0-9\.]+:/, "")

  result =
    params:
      study: "id;" + studyId
      role: "observations"
      identity: "id;new"
      step: "observation"
    body:
      data:
        step:
          fields:
            label: {"value" : block["VARIANT"]["HGNC"] + " " + (HGVSp || HGVSc)}
            genomicPosition: {"value" : block["#CHROM"].substring(3) + ":" + block["POS"] + "-" + (parseInt(block["POS"]) + block["REF"].length)}
            genomicChange: {"value" : block["REF"] + "/" + block["ALT"]}
            geneName: {"value" : block["VARIANT"]["HGNC"]}
            geneId: {"value" : block["VARIANT"]["Gene"]}
            transcriptId: {"value" : block["VARIANT"]["Feature"]}
            aminoAcidMutation: {"value" : HGVSp}
            dnaMutation: {"value" : HGVSc}
            depth: {"value" : block["QUAL"]}


createVariantRecordRequest = (studyId, block) ->

  HGVSc = block["VARIANT"]["HGVSc"].replace(/^ENS\w[0-9\.]+:/, "")
  HGVSp = block["VARIANT"]["HGVSp"].replace(/^ENS\w[0-9\.]+:/, "")
  pos = parseInt(block["POS"])

  result =
    body:
      data:
        variantType: "mutation"
        consequence: block["VARIANT"]["Consequence"]
        type: "variant"
        gene: block["VARIANT"]["HGNC"]
        geneId: block["VARIANT"]["Gene"]

        ## There might not be a protein-level variant; if so, use a DNA-level name
        mutation: HGVSp || HGVSc

        transcript: block["VARIANT"]["Feature"]
        chromosome: block["#CHROM"].replace(/^chr/, "")
        cdsPosition: block["VARIANT"]["CDS_position"]
        codon: block["VARIANT"]["Protein_position"]
        start: pos + 1
        stop: pos + block["REF"].length
        HGVSc: HGVSc

        originStudyId: studyId
        originSample: block["SAMPLE"]


unpackInfoString = (string) ->
  result = {}
  keyPattern = new RegExp(/(\w+)=([^=,"]+|"[^"]*")/g)

  while true
    match = keyPattern.exec(string)
    break if match == null
    result[match[1]] = match[2]

  result


annotateVariants = (gridStore, callback) ->

  header = undefined
  csqFieldNames = undefined
  infoMetadata = {}
  formatMetadata = {}
  dataLine = 0
  blocks = []

  handleLine = (line) ->
    logger.debug line
    if line.match(/^##/)
      handleMetadataLine(line)
    else
      data = line.split("\t")
      if dataLine++ == 0
        handleHeaderRow(data)
      else
        handleDataRow(data)

  handleMetadataLine = (line) ->
    matches = line.match(/^##(INFO|FORMAT)=<ID=(\w+),([^>]+)>\s*$/)
    if matches
      key = matches[1]
      identifier = matches[2]
      if key == "INFO" && ! infoMetadata[identifier]
        infoMetadata[identifier] = unpackInfoString(matches[3])
      else if key == "FORMAT" && ! formatMetadata[identifier]
        formatMetadata[identifier] = unpackInfoString(matches[3])

  handleHeaderRow = (data) ->
    header = data
    csq = infoMetadata["CSQ"]
    if ! csq
      throw new Error("Missing CSQ INFO properties")
    format = csq["Description"].match(/Format: ([\w_|]+)/)
    if ! format
      throw new Error("Missing CSQ Format setting in description")
    csqFieldNames = format[1].split("|")


  handleDataRow = (data) ->
    if data.length != header.length
      throw new Error('Header and data rows have different number of columns at line: ' + lineNumber)
    block = pair(header, data)
    info = block["INFO"]
    if ! info
      throw new Error('Missing INFO field at line: ' + lineNumber)

    infoBlock = info.split(";")
    for infoBlock in info.split(";")
      values = infoBlock.split("=")
      infoKey = values.shift()
      infoValue = values.join("=")

      if infoKey == "CSQ"
        csqs = infoValue.split(",")
        for csq in csqs
          csqData = pair(csqFieldNames, csq.split("|"))
          continue if ! csqData["CANONICAL"]

          consequence = csqData["Consequence"]
          continue if consequence == "downstream_gene_variant" ||
                      consequence == "upstream_gene_variant" ||
                      consequence == "intron_variant" ||
                      consequence.match(/\bnc_transcript_variant\b/)

          if consequence == 'synonymous_variant' && csqData.HGVSp?
            csqData.HGVSp = csqData.HGVSp.replace /^ENS[^:]+:[^\(]+\(p\.=\)$/, (match) ->
              amino = genomics.convertCodesToNames(csqData["Allele"])
              variant = "p." + amino + csqData["Protein_position"] + amino
              csqData["Feature"] + ":" + variant

          block["VARIANT"] = csqData

    format = block["FORMAT"]
    formatKeys = format.split(":")

    samples = Object.keys(block)
    samples.splice(0, 9)

    for sample in samples
      formatData = block[sample]
      formatDataValues = formatData.split(":")
      formatBlock = {}
      for key, j in formatKeys
        formatBlock[key] = formatDataValues[j]
      block["SAMPLE"] = sample
      block["DATA"] = formatBlock
      break

    blocks.push(block) if block["VARIANT"]


  temporaryFile = temp.createWriteStream()

  temporaryFile.on 'finish', () ->
    inputPath = temporaryFile.path
    outputPath = inputPath + ".out.vcf"

    options = buildCommand(inputPath, outputPath)
    logger.info "Command", options.join(" ")
    executable = options.shift()

    vep = spawn executable, options
    vep.on 'close', (code) ->

      logger.info "Command status", code

      annotated = fs.createReadStream(outputPath)
      lazy = Lazy(annotated).lines
      lazy.map(String).forEach(handleLine)

      annotated.on 'end', () ->
        console.log "Blocks", blocks
        callback(null)

  gridStore.pipe(temporaryFile)


buildCommand = (input, output) ->
  ['perl', '-X', "#{config.plugin.vcf.vep_home}/variant_effect_predictor.pl", '--input_file', input, '--output_file', output,
   '--dir', "#{config.plugin.vcf.vep_cache_directory}",
   '--fasta', "#{config.plugin.vcf.fasta_path}",
   '--format', 'vcf', '--vcf', '--hgvs', '--offline', '--compress', 'gzcat',
   "--no_progress", "--canonical", "--check_existing", "--check_alleles",
   "--check_ref", "--force_overwrite", "--numbers", "--domains", "--cache",
   "--hgvs", "--pubmed", "--sift", "b", "--polyphen", "b"]


appEvents.on 'step:samples:recordResults', (evt) ->
  logger.info "Handling step:samples:recordResults", evt

  db = evt.db
  callback = evt.callback

  recordVcfResults = (identifier, callback) ->
    gridStore = new GridStore(db, identifier, "r")
    gridStore.open (err, gs) ->
      return callback(err) if err?

      annotateVariants gridStore, callback

  files = (v for own k, v of evt.data.identifiers)
  async.each files, recordVcfResults, (err) ->
    callback(null, evt.data)
