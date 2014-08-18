db.studies.drop()
db.steps.drop()
db.views.drop()
db.entities.drop()

db.createCollection("studies")
db.createCollection("steps")
db.createCollection("views")
db.createCollection("entities")

db.fs.files.drop()
db.fs.chunks.drop()

identifiers = {}

getId = (name) ->
  if identifiers[name]?
    identifiers[name]
  else
    identifiers[name] = ObjectId()

toFloatingISOString = (date) ->
  string = date.toISOString()
  if string.endsWith("Z")
    string.slice(0, -1)
  else
    string

numberOfParticipants = 42

db.studies.insert
  "_id" : getId('study')
  "version": 1
  "name": "GPS"
  "access" :
    "modify" : ["swatt", "acavender"]
    "read": ["oloudon", "mweisner", "sboon"]
  "notes" :
    "observations" :
      "ownerFields" : ["sampleEntityRef", "participantEntityRef"]
    "samples" :
      "ownerFields" : ["participantEntityRef"]

db.steps.insert
  "_id" : getId('step_participant')
  "studyId" : getId('study')
  "appliesTo" : "participants"
  "weight" : 0
  "name" : "participant"
  "showSummary" : false
  "isRepeatable" : false
  "stepOptions" :
    "method" : "CreateEntity"
  "access" :
    "modify" : ["swatt"]
    "none" : ["oloudon", "mweisner"]
  "label" : { "default" : "Create participant" }
  "redoLabel" : { "default" : "Update participant" }
  "fields" :
    "identifier" :
      "controlType" : "identity"
      "type" : "String"
      "isRequired" : true
      "isIdentity" : true
      "pattern" : "TST-\\d{3,3}"
      "pattern-message" : "Must have the format TST-nnn"
      "label" : { "default" : "Identifier" }
    "institution" :
      "controlType" : "select"
      "type" : "String"
      "range" : ["PMH/UHN", "London", "Ottawa", "Thunder Bay"]
      "isRequired" : true
      "label" : { "default" : "Institution" }

db.steps.insert
  "_id" : getId('step_enrolment')
  "studyId" : getId('study')
  "weight" : 10
  "appliesTo" : "participants"
  "name" : "enrolment"
  "showSummary" : true
  "isRepeatable" : false
  "label" :
    "default" : "Enrolment"
  "access" :
    "modify" : ["swatt", "oloudon"]
    "read" : ["acavender", "mweisner"]
  "fields" :
    "enrolmentDate" :
      "controlType" : "date"
      "type" : "Date"
      "isRequired" : true
      "label" : { "default" : "Enrolment date" }

db.steps.insert
  "_id" : getId('step_consent')
  "studyId" : getId('study')
  "appliesTo" : "participants"
  "weight" : 20
  "name" : "consent"
  "showSummary" : true
  "isRepeatable" : false
  "label" : { "default" : "Consent" }
  "access" :
    "modify" : ["swatt", "acavender"]
    "read" : ["oloudon", "mweisner"]
  "fields" :
    "consentDate" :
      "controlType" : "date"
      "type" : "Date"
      "isRequired" : true
      "label" : { "default" : "Consent date" }

db.steps.insert
  "_id" : getId('step_biopsy')
  "studyId" : getId('study')
  "appliesTo" : "participants"
  "weight" : 30
  "name" : "biopsy"
  "showSummary" : true
  "isRepeatable" : true
  "label" : { "default" : "Biopsy" }
  "access" :
    "modify" : ["swatt", "mweisner"]
    "none" : ["oloudon", "acavender"]
  "fields" :
    "biopsyDate" :
      "controlType" : "date"
      "type" : "Date"
      "isRequired" : true
      "label" : { "default" : "Biopsy date" }
    "biopsyCores" :
      "controlType" : "integer",
      "type" : "Integer"
      "isRequired" : true
      "label" : { "default" : "Number of cores" }

db.steps.insert
  "_id" : getId('step_pathology')
  "studyId" : getId('study')
  "appliesTo" : "participants"
  "weight" : 40
  "name" : "pathology"
  "showSummary" : true
  "isRepeatable" : false
  "label" : { "default" : "Pathology" }
  "fields" :
    "pathologyDate" :
      "controlType" : "date"
      "type" : "Date"
      "isRequired" : true
      "label" : { "default" : "Pathology date" }

db.steps.insert
  "_id" : getId('step_clinicalHistory')
  "studyId" : getId('study')
  "appliesTo" : "participants"
  "weight" : 200
  "name" : "clinicalHistory"
  "showSummary" : true
  "isRepeatable" : false
  "label" : { "default" : "Clinical history" }
  "fields" :
    "clinicalHistory" :
      "controlType" : "textarea"
      "controlArguments" : { "html" : true }
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "History" }

db.steps.insert
  "_id" : getId('step_genomics')
  "studyId" : getId('study')
  "appliesTo" : "participants"
  "weight" : 300
  "name" : "genomics"
  "showSummary" : false
  "isRepeatable" : false
  "label" : { "default" : "Genomics" }
  "fields" :
    "file" :
      "controlType" : "file"
      "type" : "File"
      "isRequired" : true
      "label" : { "default" : "File" }

db.steps.insert
  "_id" : getId('step_addSample')
  "studyId" : getId('study')
  "appliesTo" : "participants"
  "name" : "addSample"
  "showSummary" : false
  "isRepeatable" : false
  "label" : { "default" : "Add sample" }
  "access" :
    "modify" : ["swatt", "mweisner"]
    "none" : ["oloudon", "acavender"]
  "weight" : 400
  "url" : "{{study.url}}/samples/id;new/step/sample?participantEntityRef={{identity}}"

db.steps.insert
  "_id" : getId('step_expertPanel')
  "studyId" : getId('study')
  "appliesTo" : "participants"
  "weight" : 500
  "name" : "expertPanel"
  "showSummary" : true
  "isRepeatable" : true
  "label" : { "default" : "Expert panel decision" }
  "access" :
    "modify" : ["swatt", "oloudon"]
    "none" : ["mweisner", "acavender"]
  "fields" :
    "observationRef" :
      "controlType" : "chooser"
      "entity" : "observations"
      "type" : "Reference"
      "isRequired" : true
      "isReadonly" : false
      "label" : { "default" : "Observation" }
    "reportable" :
      "controlType" : "checkbox"
      "type" : "Boolean"
      "default" : false
      "isRequired" : true
      "label" : { "default" : "Reportable" }
    "actionable" :
      "controlType" : "checkbox"
      "type" : "Boolean"
      "default" : false
      "isRequired" : true
      "label" : { "default" : "Actionable" }
    "expertPanelDate" :
      "controlType" : "date"
      "type" : "Date"
      "isRequired" : true
      "label" : { "default" : "Expert panel date" }
    "expertPanelDecision" :
      "controlType" : "textarea"
      "controlArguments" : { "html" : true }
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "Expert panel decision" }

db.steps.insert
  "_id" : getId('step_sample')
  "studyId" : getId('study')
  "appliesTo" : "samples"
  "weight" : 0
  "stepOptions" :
    "method" : "CreateEntity"
    "parentField": "participantEntityRef"
  "name" : "sample"
  "showSummary" : false
  "isRepeatable" : false
  "label" : { "default" : "Create sample" }
  "redoLabel" : { "default" : "Update sample" }
  "fields" :
    "identifier" :
      "controlType" : "identity"
      "type" : "String"
      "isRequired" : true
      "isIdentity" : true
      "label" : { "default" : "Barcode" }
    "participantEntityRef" :
      "controlType" : "reference"
      "entity" : "participants"
      "type" : "Reference"
      "isRequired" : true
      "isReadonly" : true
      "label" : { "default" : "Participant" }
    "source" :
      "controlType" : "select"
      "type" : "String"
      "range" : ["Biopsy", "Archival", "Control"]
      "isRequired" : true
      "label" : { "default" : "Source" }
    "type" :
      "controlType" : "select"
      "type" : "String"
      "range" : ["FFPE", "Frozen", "Blood", "Fluid", "FNA"]
      "isRequired" : true
      "label" : { "default" : "Type" }
    "site" :
      "controlType" : "select"
      "type" : "String"
      "range" : ["Primary", "Metastates"]
      "label" : { "default" : "Site" }
    "requiresCollection" :
      "controlType" : "checkbox"
      "type" : "Boolean"
      "default" : true
      "isRequired" : true
      "label" : { "default" : "Requires collection" }

db.steps.insert
  "_id" : getId('step_assessSample')
  "studyId" : getId('study')
  "appliesTo" : "samples"
  "weight" : 10
  "name" : "assessSample"
  "showSummary" : true
  "label" : { "default" : "Record sample quality" }
  "description" :
    "default" : "Record this sample's DNA quality and concentration."
  "fields" :
    "dnaConcentration" :
      "controlType" : "float"
      "type" : "Float"
      "label" : { "default" : "DNA concentration" }
    "dnaQuality" :
      "controlType" : "select"
      "type" : "String"
      "range" : ["Good", "Moderate", "Poor"]
      "label" : { "default" : "DNA quality" }

db.steps.insert
  "_id" : getId('step_markAsCollected')
  "studyId" : getId('study')
  "appliesTo" : "samples"
  "weight" : 20
  "name" : "markAsCollected"
  "showSummary" : true
  "isRepeatable" : false
  "label" : { "default" : "Mark as collected" }
  "description" :
    "default" : "Mark this sample as collected."

db.steps.insert
  "_id" : getId('step_recordResults')
  "studyId" : getId('study')
  "appliesTo" : "samples"
  "weight" : 10
  "name" : "recordResults"
  "showSummary" : true
  "isRepeatable" : false
  "label" : { "default" : "Record results" }
  "description" :
    "default" : "Records results for a sample. Choose a VCF file generated by the Emsembl <code>VEP</code> tool, using options:<br>" +
                "<code>perl variant_effect_predictor.pl --input_file x.vcf --output_file out.vcf --format vcf --vcf --hgvs ...</code>"
  "access" :
    "modify" : ["acavender"]
    "none" : ["mweisner", "oloudon"]
  "plugin" :
    "module" : "vcf"
    "method" : "handleVcf"
  "fields" :
    "dataFile" :
      "controlType" : "file"
      "type" : "File"
      "label" : { "default" : "Data file" }

db.steps.insert
  "_id" : getId('step_observation')
  "studyId" : getId('study')
  "appliesTo" : "observations"
  "weight" : 0
  "name" : "observation"
  "showSummary" : false
  "isRepeatable" : false
  "stepOptions" :
    "method" : "CreateEntity"
    "parentField": "sampleEntityRef"
  "label" : { "default" : "Create observation" }
  "redoLabel" : { "default" : "Update observation" }
  "fields" :
    "label" :
      "controlType" : "hidden"
      "type" : "String"
      "name" : true
      "label" : { "default" : "Name" }
    "participantEntityRef" :
      "controlType" : "reference"
      "type" : "Reference"
      "entity" : "participants"
      "isRequired" : true
      "label" : { "default" : "Participant" }
    "sampleEntityRef" :
      "controlType" : "reference"
      "type" : "Reference"
      "entity" : "samples"
      "isRequired" : true
      "label" : { "default" : "Sample" }
    "genomicPosition" :
      "controlType" : "text"
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "Genomic position" }
    "genomicChange" :
      "controlType" : "text"
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "Genomic change" }
    "geneName" :
      "controlType" : "text"
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "Gene" }
    "geneId" :
      "controlType" : "text"
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "Gene ID" }
    "transcriptId" :
      "controlType" : "text"
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "Transcript ID" }
    "aminoAcidMutation" :
      "controlType" : "text"
      "type" : "String"
      "isRequired" : false
      "label" : { "default" : "Protein mutation" }
    "dnaMutation" :
      "controlType" : "text"
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "DNA mutation" }
    "depth" :
      "controlType" : "text"
      "type" : "String"
      "isRequired" : true
      "label" : { "default" : "Depth" }

db.steps.insert
  "_id" : getId('step_clinicallyVerified')
  "studyId" : getId('study')
  "appliesTo" : "observations"
  "weight" : 100
  "name" : "clinicallyVerified"
  "showSummary" : true
  "isRepeatable" : false
  "label" : { "default" : "Clinical verification" }
  "fields" :
    "verified" :
      "controlType" : "checkbox"
      "type" : "Boolean"
      "default" : false
      "isRequired" : true
      "label" : { "default" : "Verified" }
    "frequency" :
      "controlType" : "integer"
      "type" : "Integer"
      "isRequired" : false
      "label" : { "default" : "Frequency" }

db.views.insert
  "studyId" : getId('study'),
  "name" : "summary",
  "role" : "studies",
  "label" : { "default" : "Summary" },
  "weight" : 0,
  "body" :
    "<dl>\n" +
    "  <dt>Number of participants</dt>\n" +
    "  <dd>{{study.data.counts.participants}}</dd>\n" +
    "  <dt>Number of samples</dt>\n" +
    "  <dd>{{study.data.counts.samples}}</dd>\n" +
    "  <dt>Observed mutations</dt>\n" +
    "  <dd>{{study.data.counts.observations}}</dd>\n" +
    "</dl>\n"

db.views.insert
  "studyId" : getId('study')
  "name" : "participants"
  "role" : "studies"
  "label" : { "default" : "Participants" }
  "weight" : 100
  "body" :
    "<div heli-study-entities role='participants' label='Participants'>\n" +
    "</div>\n" +
    "<br>\n"

db.views.insert
  "studyId" : getId('study')
  "name" : "samples"
  "role" : "studies"
  "label" : { "default" : "Samples" }
  "weight" : 200
  "body" :
    "<div heli-study-entities role='samples' label='Samples'>\n" +
    "</div>\n" +
    "<br>\n"

db.views.insert
  "studyId" : getId('study')
  "name" : "summary"
  "role" : "participants"
  "label" : { "default" : "Summary" }
  "weight" : 0
  "body" :
    "<dl>\n" +
    "  <dt>Registered</dt>\n" +
    "  <dd>{{entity.data.values.enrolmentDate | field}}</dd>\n" +
    "  <dt>Consent</dt>\n" +
    "  <dd>{{entity.data.values.consentDate | field}}</dd>\n" +
    "  <dt>Biopsy</dt>\n" +
    "  <dd>{{entity.data.values.biopsyDate | field}}</dd>\n" +
    "  <dt>Pathology</dt>\n" +
    "  <dd>{{entity.data.values.pathologyDate | field}}</dd>\n" +
    "  <dt>Clinical lab</dt>\n" +
    "  <dd>{{entity.data.values.clinicalLaboratoryDate | field}}</dd>\n" +
    "  <dt>Research lab</dt>\n" +
    "  <dd>{{entity.data.values.researchLaboratoryDate | field}}</dd>\n" +
    "  <dt>Expert panel</dt>\n" +
    "  <dd>{{entity.data.values.expertPanelDate | field}}</dd>\n" +
    "</dl>\n"

db.views.insert
  "studyId" : getId('study')
  "name" : "enrolment"
  "role" : "participants"
  "label" : { "default" : "Enrolment" }
  "weight" : 100
  "body" :
    "<dl>\n" +
    "  <dt>Registered</dt>\n" +
    "  <dd>{{entity.data.values.enrolmentDate | field}}</dd>\n" +
    "  <dt>Consent</dt>\n" +
    "  <dd>{{entity.data.values.consentDate | field}}</dd>\n" +
    "</dl>"

db.views.insert
  "studyId" : getId('study')
  "name" : "samples"
  "role" : "participants"
  "label" : { "default" : "Samples" }
  "weight" : 200
  "body" :
    "<table>\n" +
    "  <thead></thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat='sample in entity.data.related.samples'>\n" +
    "      <td><a href='{{sample.url}}'>{{sample.identity}}</a>\n" +
    "    </tr>\n" +
    "  <tbody>\n" +
    "</table>"

db.views.insert
  "studyId" : getId('study')
  "name" : "history"
  "role" : "participants"
  "label" : { "default" : "Clinical history" }
  "weight" : 300
  "body" :
    "<div>\n" +
    "{{entity.data.values.clinicalHistory | field}}\n" +
    "</div>"

db.views.insert
  "studyId" : getId('study')
  "name" : "observations"
  "role" : "participants"
  "label" : { "default" : "Observations" }
  "weight" : 400
  "body" :
    "<table heli-observations>\n" +
    "</table>"

db.views.insert
  "studyId" : getId('study')
  "name" : "steps"
  "role" : "participants"
  "label" : { "default" : "Steps" }
  "weight" : 500
  "body" :
    "<div>\n" +
    "<div heli-entity-steps></div>\n" +
    "</div>"

db.views.insert
  "studyId" : getId('study')
  "name" : "summary"
  "role" : "samples"
  "label" : { "default" : "Summary" }
  "weight" : 0
  "body" :
    "<dl>\n" +
    "  <dt>Requires collection</dt>\n" +
    "  <dd>{{entity.data.values.requiresCollection | field}}</dd>\n" +
    "  <dt>DNA quality</dt>\n" +
    "  <dd>{{entity.data.values.dnaQuality | field}}</dd>\n" +
    "</dl>"

db.views.insert
  "studyId" : getId('study')
  "name" : "participants"
  "role" : "samples"
  "label" : { "default" : "Participant" }
  "weight" : 100
  "body" :
    "<table>\n" +
    "  <thead></thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat='participant in entity.data.related.participants'>\n" +
    "      <td><a href='{{participant.url}}'>{{participant.identity}}</a>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>"

db.views.insert
  "studyId" : getId('study')
  "name" : "observations"
  "role" : "samples"
  "label" : { "default" : "Observations" }
  "weight" : 400
  "body" :
    "<table heli-observations>\n" +
    "</table>"

db.views.insert
  "studyId" : getId('study')
  "name" : "steps"
  "role" : "samples"
  "label" : { "default" : "Steps" }
  "weight" : 500
  "body" :
    "<div>\n" +
    "<div heli-entity-steps></div>\n" +
    "</div>"

db.views.insert
  "studyId" : getId('study')
  "name" : "summary"
  "role" : "observations"
  "label" : { "default" : "Summary" }
  "weight" : 0
  "body" :
    "<dl>\n" +
    "  <dt>Gene name</dt>\n" +
    "  <dd>{{entity.data.values.geneName | field}}</dd>\n" +
    "  <dt>Ensembl gene id</dt>\n" +
    "  <dd><a href='http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g={{entity.data.values.geneId | field}}' rel='external'>{{entity.data.values.geneId | field}}</a></dd>\n" +
    "  <dt>Ensembl transcript id</dt>\n" +
    "  <dd><a href='http://useast.ensembl.org/Homo_sapiens/Transcript/Summary?t={{entity.data.values.geneId | field}}' rel='external'>{{entity.data.values.transcriptId | field}}</a></dd>\n" +
    "  <dt>Amino acid mutation</dt>\n" +
    "  <dd ng-show='entity.data.values.aminoAcidMutation'>{{entity.data.values.aminoAcidMutation | field}}</dd>\n" +
    "  <dd ng-hide='entity.data.values.aminoAcidMutation'>Not available</dd>\n" +
    "  <dt>DNA mutation</dt>\n" +
    "  <dd>{{entity.data.values.dnaMutation | field}}</dd>\n" +
    "  <dt>Depth</dt>\n" +
    "  <dd>{{entity.data.values.depth | field}}</dd>\n" +
    "  <dt>Open in knowledge base</dt>\n" +
    "  <dd heli-knowledge-base-search term='entity.data.values.geneName.value + &quot;+&quot; + (entity.data.values.aminoAcidMutation.value || entity.data.values.dnaMutation.value)' entity='entity'>Not available</dd>\n" +
    "</dl>"

db.views.insert
  "studyId" : getId('study')
  "name" : "steps"
  "role" : "observations"
  "label" : { "default" : "Steps" }
  "weight" : 500
  "body" :
    "<div>\n" +
    "<div heli-entity-steps></div>\n" +
    "</div>"

## mutations
knownMutations = [
  { "gene": "ABCA7", "mutation": "A2045S", "dna": "chr19:g.1065018G>T", "geneId": "ENSG00000064687", "transcriptId": "ENST00000263094" },
  { "gene": "ADAD2", "mutation": "G44E", "dna": "chr16:g.84224967G>A", "geneId": "ENSG00000140955", "transcriptId": "ENST00000268624" },
  { "gene": "ANKLE1", "mutation": "L83Q", "dna": "chr19:g.17393530T>A", "geneId": "ENSG00000160117", "transcriptId": "ENST00000394458" },
  { "gene": "ARHGAP5", "mutation": "V474A", "dna": "chr14:g.32561296T>C", "geneId": "ENSG00000100852", "transcriptId": "ENST00000345122" },
  { "gene": "BRAF", "mutation": "V600E", "dna": "chr7:g.140453136A>T", "geneId": "ENSG00000157764", "transcriptId": "ENST00000288602" },
  { "gene": "CHEK2", "mutation": "K344E", "dna": "chr22:g.29091840T>C", "geneId": "ENSG00000183765", "transcriptId": "ENST00000382580" },
  { "gene": "CTNNB1", "mutation": "S33C", "dna": "chr3:g.41266101C>G", "geneId": "ENSG00000168036", "transcriptId": "ENST00000349496" },
  { "gene": "CTNNB1", "mutation": "S37C", "dna": "chr3:g.41266113C>G", "geneId": "ENSG00000168036", "transcriptId": "ENST00000349496" },
  { "gene": "CTNNB1", "mutation": "S37F", "dna": "chr3:g.41266113C>T", "geneId": "ENSG00000168036", "transcriptId": "ENST00000349496" },
  { "gene": "CTNNB1", "mutation": "S38F", "dna": "chr3:g.41266137C>T", "geneId": "ENSG00000168036", "transcriptId": "ENST00000349496" },
  { "gene": "CTNNB1", "mutation": "T34A", "dna": "chr3:g.41266124A>G", "geneId": "ENSG00000168036", "transcriptId": "ENST00000349496" },
  { "gene": "DOT1L", "mutation": "G266S", "dna": "chr19:g.2226676G>A", "geneId": "ENSG00000104885", "transcriptId": "ENST00000398665" },
  { "gene": "EEF1B2", "mutation": "S43G", "dna": "chr2:g.207025358A>G", "geneId": "ENSG00000114942", "transcriptId": "ENST00000392222" },
  { "gene": "EGFR", "mutation": "A244V", "dna": "chr7:g.55221822C>T", "geneId": "ENSG00000146648", "transcriptId": "ENST00000275493" },
  { "gene": "EGFR", "mutation": "G553V", "dna": "chr7:g.55233043G>T", "geneId": "ENSG00000146648", "transcriptId": "ENST00000275493" },
  { "gene": "FAM194B", "mutation": "E135G", "dna": "chr13:g.46170737T>C", "geneId": "ENSG00000165837", "transcriptId": "ENST00000298738" },
  { "gene": "FAM194B", "mutation": "E136K", "dna": "chr13:g.46170735C>T", "geneId": "ENSG00000165837", "transcriptId": "ENST00000298738" },
  { "gene": "FAM194B", "mutation": "E138G", "dna": "chr13:g.46170728T>C", "geneId": "ENSG00000165837", "transcriptId": "ENST00000298738" },
  { "gene": "FAM194B", "mutation": "Y139H", "dna": "chr13:g.46170726A>G", "geneId": "ENSG00000165837", "transcriptId": "ENST00000298738" },
  { "gene": "FBXW7", "mutation": "R347C", "dna": "chr4:g.153249385G>A", "geneId": "ENSG00000109670", "transcriptId": "ENST00000281708" },
  { "gene": "FEZ2", "mutation": "P50L", "dna": "chr2:g.36825137G>A", "geneId": "ENSG00000171055", "transcriptId": "ENST00000379245" },
  { "gene": "FRG1B", "mutation": "A41T", "dna": "chr20:g.29625877G>A", "geneId": "ENSG00000149531", "transcriptId": "ENST00000278882" },
  { "gene": "FRG1B", "mutation": "A88T", "dna": "chr20:g.29628245G>A", "geneId": "ENSG00000149531", "transcriptId": "ENST00000278882" },
  { "gene": "FRG1B", "mutation": "I45T", "dna": "chr20:g.29625875T>C", "geneId": "ENSG00000149531", "transcriptId": "ENST00000278882" },
  { "gene": "FRG1B", "mutation": "L87S", "dna": "chr20:g.29628243T>C", "geneId": "ENSG00000149531", "transcriptId": "ENST00000278882" },
  { "gene": "GLTPD2", "mutation": "D209E", "dna": "chr17:g.4693342C>A", "geneId": "ENSG00000182327", "transcriptId": "ENST00000331264" },
  { "gene": "GPRIN2", "mutation": "V241M", "dna": "chr10:g.46999601G>A", "geneId": "ENSG00000204175", "transcriptId": "ENST00000374314" },
  { "gene": "GSG2", "mutation": "R82C", "dna": "chr17:g.3627473C>T", "geneId": "ENSG00000177602", "transcriptId": "ENST00000325418" },
  { "gene": "HRAS", "mutation": "Q61R", "dna": "chr11:g.533874T>C", "geneId": "ENSG00000174775", "transcriptId": "ENST00000451590" },
  { "gene": "IDH1", "mutation": "R132C", "dna": "chr2:g.209113113G>A", "geneId": "ENSG00000138413", "transcriptId": "ENST00000415913" },
  { "gene": "IDH1", "mutation": "R132G", "dna": "chr2:g.209113113G>C", "geneId": "ENSG00000138413", "transcriptId": "ENST00000415913" },
  { "gene": "IDH1", "mutation": "R132H", "dna": "chr2:g.209113112C>T", "geneId": "ENSG00000138413", "transcriptId": "ENST00000415913" },
  { "gene": "IRF5", "mutation": "R175Q", "dna": "chr7:g.128587374G>A", "geneId": "ENSG00000128604", "transcriptId": "ENST00000357234" },
  { "gene": "KCNN3", "mutation": "L66H", "dna": "chr1:g.154842244A>T", "geneId": "ENSG00000143603", "transcriptId": "ENST00000271915" },
  { "gene": "KLHL30", "mutation": "A195V", "dna": "chr2:g.239050033C>T", "geneId": "ENSG00000168427", "transcriptId": "ENST00000409223" },
  { "gene": "KRAS", "mutation": "G12A", "dna": "chr12:g.25398284C>G", "geneId": "ENSG00000133703", "transcriptId": "ENST00000256078" },
  { "gene": "KRAS", "mutation": "G12C", "dna": "chr12:g.25398285C>A", "geneId": "ENSG00000133703", "transcriptId": "ENST00000256078" },
  { "gene": "KRAS", "mutation": "G12D", "dna": "chr12:g.25398284C>T", "geneId": "ENSG00000133703", "transcriptId": "ENST00000256078" },
  { "gene": "KRAS", "mutation": "G12R", "dna": "chr12:g.25398285C>G", "geneId": "ENSG00000133703", "transcriptId": "ENST00000256078" },
  { "gene": "KRAS", "mutation": "G12V", "dna": "chr12:g.25398284C>A", "geneId": "ENSG00000133703", "transcriptId": "ENST00000256078" },
  { "gene": "KRAS", "mutation": "G13D", "dna": "chr12:g.25398281C>T", "geneId": "ENSG00000133703", "transcriptId": "ENST00000256078" },
  { "gene": "KRAS", "mutation": "Q61H", "dna": "chr12:g.25380275T>G", "geneId": "ENSG00000133703", "transcriptId": "ENST00000256078" },
  { "gene": "LATS2", "mutation": "A324V", "dna": "chr13:g.21562948G>A", "geneId": "ENSG00000150457", "transcriptId": "ENST00000382592" },
  { "gene": "LATS2", "mutation": "G363S", "dna": "chr13:g.21562832C>T", "geneId": "ENSG00000150457", "transcriptId": "ENST00000382592" },
  { "gene": "MTX1", "mutation": "T63S", "dna": "chr1:g.155178782A>T", "geneId": "ENSG00000173171", "transcriptId": "ENST00000368376" },
  { "gene": "MUC4", "mutation": "H4205Q", "dna": "chr3:g.195505836G>C", "geneId": "ENSG00000145113", "transcriptId": "ENST00000463781" },
  { "gene": "NBPF10", "mutation": "E3455K", "dna": "chr1:g.145367767G>A", "geneId": "ENSG00000163386", "transcriptId": "ENST00000342960" },
  { "gene": "NEFH", "mutation": "E645K", "dna": "chr22:g.29885562G>A", "geneId": "ENSG00000100285", "transcriptId": "ENST00000310624" },
  { "gene": "NOTCH2", "mutation": "A21T", "dna": "chr1:g.120611960C>T", "geneId": "ENSG00000134250", "transcriptId": "ENST00000256646" },
  { "gene": "NRAS", "mutation": "Q61K", "dna": "chr1:g.115256530G>T", "geneId": "ENSG00000213281", "transcriptId": "ENST00000369535" },
  { "gene": "NRAS", "mutation": "Q61R", "dna": "chr1:g.115256529T>C", "geneId": "ENSG00000213281", "transcriptId": "ENST00000369535" },
  { "gene": "NTSR2", "mutation": "A54V", "dna": "chr2:g.11810095G>A", "geneId": "ENSG00000169006", "transcriptId": "ENST00000306928" },
  { "gene": "OPRD1", "mutation": "C27F", "dna": "chr1:g.29138975G>T", "geneId": "ENSG00000116329", "transcriptId": "ENST00000234961" },
  { "gene": "OTUD4", "mutation": "T974I", "dna": "chr4:g.146059006G>A", "geneId": "ENSG00000164164", "transcriptId": "ENST00000454497" },
  { "gene": "PARG", "mutation": "A99T", "dna": "chr10:g.51093329C>T", "geneId": "ENSG00000227345", "transcriptId": "ENST00000402038" },
  { "gene": "PCDHA7", "mutation": "L352I", "dna": "chr5:g.140215022C>A", "geneId": "ENSG00000204963", "transcriptId": "ENST00000525929" },
  { "gene": "PGM5", "mutation": "I98V", "dna": "chr9:g.70993145A>G", "geneId": "ENSG00000154330", "transcriptId": "ENST00000396396" },
  { "gene": "PIK3CA", "mutation": "E542K", "dna": "chr3:g.178936082G>A", "geneId": "ENSG00000121879", "transcriptId": "ENST00000263967" },
  { "gene": "PIK3CA", "mutation": "E545K", "dna": "chr3:g.178936091G>A", "geneId": "ENSG00000121879", "transcriptId": "ENST00000263967" },
  { "gene": "PIK3CA", "mutation": "E726K", "dna": "chr3:g.178938934G>A", "geneId": "ENSG00000121879", "transcriptId": "ENST00000263967" },
  { "gene": "PIK3CA", "mutation": "G118D", "dna": "chr3:g.178917478G>A", "geneId": "ENSG00000121879", "transcriptId": "ENST00000263967" },
  { "gene": "PIK3CA", "mutation": "H1047L", "dna": "chr3:g.178952085A>T", "geneId": "ENSG00000121879", "transcriptId": "ENST00000263967" },
  { "gene": "PIK3CA", "mutation": "H1047R", "dna": "chr3:g.178952085A>G", "geneId": "ENSG00000121879", "transcriptId": "ENST00000263967" },
  { "gene": "PIK3CA", "mutation": "N345K", "dna": "chr3:g.178921553T>A", "geneId": "ENSG00000121879", "transcriptId": "ENST00000263967" },
  { "gene": "PIK3CA", "mutation": "R88Q", "dna": "chr3:g.178916876G>A", "geneId": "ENSG00000121879", "transcriptId": "ENST00000263967" },
  { "gene": "PTEN", "mutation": "R130G", "dna": "chr10:g.89692904C>G", "geneId": "ENSG00000171862", "transcriptId": "ENST00000371953" },
  { "gene": "PTEN", "mutation": "R130Q", "dna": "chr10:g.89692905G>A", "geneId": "ENSG00000171862", "transcriptId": "ENST00000371953" },
  { "gene": "PTPLA", "mutation": "E29K", "dna": "chr10:g.17659149C>T", "geneId": "ENSG00000165996", "transcriptId": "ENST00000361271" },
  { "gene": "PTPLA", "mutation": "V35F", "dna": "chr10:g.17659131C>A", "geneId": "ENSG00000165996", "transcriptId": "ENST00000361271" },
  { "gene": "RGPD8", "mutation": "P1620A", "dna": "chr2:g.113127775G>C", "geneId": "ENSG00000169629", "transcriptId": "ENST00000302558" },
  { "gene": "SBK2", "mutation": "A298P", "dna": "chr19:g.56041255C>G", "geneId": "ENSG00000187550", "transcriptId": "ENST00000413299" },
  { "gene": "SF3B1", "mutation": "K700E", "dna": "chr2:g.198266834T>C", "geneId": "ENSG00000115524", "transcriptId": "ENST00000335508" },
  { "gene": "SP5", "mutation": "A75T", "dna": "chr2:g.171572940G>A", "geneId": "ENSG00000204335", "transcriptId": "ENST00000375281" },
  { "gene": "TMPRSS13", "mutation": "A77G", "dna": "chr11:g.117789345G>C", "geneId": "ENSG00000137747", "transcriptId": "ENST00000524993" },
  { "gene": "TP53", "mutation": "C83F", "dna": "chr17:g.7578403C>A", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "G245S", "dna": "chr17:g.7577548C>T", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "H179R", "dna": "chr17:g.7578394T>C", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "H61R", "dna": "chr17:g.7578271T>C", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "I102T", "dna": "chr17:g.7578265A>G", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "R141H", "dna": "chr17:g.7577120C>T", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "R150W", "dna": "chr17:g.7577094G>A", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "R155Q", "dna": "chr17:g.7577538C>T", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "R155W", "dna": "chr17:g.7577539G>A", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "R175H", "dna": "chr17:g.7578406C>T", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "R273C", "dna": "chr17:g.7577121G>A", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "Y163C", "dna": "chr17:g.7578442T>C", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "TP53", "mutation": "Y220C", "dna": "chr17:g.7578190T>C", "geneId": "ENSG00000141510", "transcriptId": "ENST00000269305" },
  { "gene": "UBBP4", "mutation": "R73L", "dna": "chr17:g.21730916G>T", "geneId": "ENSG00000263563", "transcriptId": "ENST00000578713" },
  { "gene": "ZNF814", "mutation": "A337V", "dna": "chr19:g.58385748G>A", "geneId": "ENSG00000204514", "transcriptId": "ENST00000435989" },
  { "gene": "ZNF814", "mutation": "D404E", "dna": "chr19:g.58385546G>T", "geneId": "ENSG00000204514", "transcriptId": "ENST00000435989" },
  { "gene": "ZNF814", "mutation": "G320E", "dna": "chr19:g.58385799C>T", "geneId": "ENSG00000204514", "transcriptId": "ENST00000435989" },
  { "gene": "ZNF814", "mutation": "P323H", "dna": "chr19:g.58385790G>T", "geneId": "ENSG00000204514", "transcriptId": "ENST00000435989" },
  { "gene": "ZNF814", "mutation": "R322K", "dna": "chr19:g.58385793C>T", "geneId": "ENSG00000204514", "transcriptId": "ENST00000435989" },
  { "gene": "ZNF837", "mutation": "A242T", "dna": "chr19:g.58879976C>T", "geneId": "ENSG00000152475", "transcriptId": "ENST00000427624" }
]

aminoAcidCodes = {
  "Ala" : "A",
  "Arg" : "R",
  "Asn" : "N",
  "Asp" : "D",
  "Cys" : "C",
  "Gln" : "Q",
  "Glu" : "E",
  "Gly" : "G",
  "His" : "H",
  "Ile" : "I",
  "Leu" : "L",
  "Lys" : "K",
  "Met" : "M",
  "Phe" : "F",
  "Pro" : "P",
  "Ser" : "S",
  "Thr" : "T",
  "Trp" : "W",
  "Tyr" : "Y",
  "Val" : "V",
};

aminoAcidNames = {}
for own key, value of aminoAcidCodes
  aminoAcidNames[aminoAcidCodes[key]] = key

codePattern = new RegExp("[" + (key for own key of aminoAcidNames).join("") + "]", "g")

convertCodesToNames = (string) ->
  string.replace codePattern, (match) -> aminoAcidNames[match]

generateMutationCount = () ->
  Math.ceil(- 2 * Math.log(Math.random()) / Math.LN2)

## Marsaglia polar method
generateRandomNormal = (mean, stdDev) ->
  U = (Math.random()) * 2 - 1
  V = (Math.random()) * 2 - 1
  S = U * U + V * V
  if S < 1
    mul = Math.sqrt((-2 * Math.log(S)) / S)
    mean + stdDev * U * mul
  else
    generateRandomNormal(mean, stdDev)

boundedRandomNormal = (mean, stdDev, lower, upper) ->
  raw = generateRandomNormal(mean, stdDev)
  if raw >= lower && raw <= upper
    raw
  else
    boundedRandomNormal(mean, stdDev, lower, upper)

boundedRandomWorkingDate = (mean, stdDev, lower, upper) ->
  raw = boundedRandomNormal(mean.getTime(), stdDev, lower.getTime(), upper.getTime())
  raw = new Date(raw)
  hours = raw.getHours()
  if hours >= 9 && hours <= 17
    raw
  else
    boundedRandomWorkingDate(mean, stdDev, lower, upper)

dateDelta = (date, delta) ->
  new Date(date.getTime() + delta)

lastDate = new Date(2014, 6, 23, 10, 17)

participantDeltaMean = 1000 * 60 * 60 * 24 * 4
participantDeltaStdDev = 1000 * 60 * 60 * 24 * 2
participantDeltaLower = 1000 * 60 * 60 * 24 * 0
participantDeltaUpper = 1000 * 60 * 60 * 24 * 7

consentDeltaMean = 1000 * 60 * 60 * 24 * 2
consentDeltaStdDev = 1000 * 60 * 60 * 24 * 1
consentDeltaLower = 1000 * 60 * 60 * 24 * 0
consentDeltaUpper = 1000 * 60 * 60 * 24 * 7

biopsyDeltaMean = 1000 * 60 * 60 * 24 * 0.2
biopsyDeltaStdDev = 1000 * 60 * 60 * 24 * 0.1
biopsyDeltaLower = 1000 * 60 * 60 * 24 * 0
biopsyDeltaUpper = 1000 * 60 * 60 * 24 * 1

pathologyDeltaMean = 1000 * 60 * 60 * 24 * 2
pathologyDeltaStdDev = 1000 * 60 * 60 * 24 * 1
pathologyDeltaLower = 1000 * 60 * 60 * 24 * 0
pathologyDeltaUpper = 1000 * 60 * 60 * 24 * 7

sampleDeltaMean = 1000 * 60 * 60 * 24 * 0.3
sampleDeltaStdDev = 1000 * 60 * 60 * 24 * 0.2
sampleDeltaLower = 1000 * 60 * 60 * 24 * 0
sampleDeltaUpper = 1000 * 60 * 60 * 24 * 2

for i in [1..numberOfParticipants]
  identifier = i.toString()
  identifier = "TST-000".substring(0, 7 - identifier.length) + identifier

  participantDate = boundedRandomWorkingDate(
    dateDelta(lastDate, participantDeltaMean)
    participantDeltaStdDev
    dateDelta(lastDate, participantDeltaLower)
    dateDelta(lastDate, participantDeltaUpper)
  )
  consentDate = boundedRandomWorkingDate(
    dateDelta(participantDate, consentDeltaMean)
    consentDeltaStdDev
    dateDelta(participantDate, consentDeltaLower)
    dateDelta(participantDate, consentDeltaUpper)
  )
  biopsyDate = boundedRandomWorkingDate(
    dateDelta(consentDate, biopsyDeltaMean)
    biopsyDeltaStdDev
    dateDelta(consentDate, biopsyDeltaLower)
    dateDelta(consentDate, biopsyDeltaUpper)
  )
  pathologyDate = boundedRandomWorkingDate(
    dateDelta(biopsyDate, pathologyDeltaMean)
    pathologyDeltaStdDev
    dateDelta(biopsyDate, pathologyDeltaLower)
    dateDelta(biopsyDate, pathologyDeltaUpper)
  )
  sampleDate = boundedRandomWorkingDate(
    dateDelta(pathologyDate, sampleDeltaMean)
    sampleDeltaStdDev
    dateDelta(pathologyDate, sampleDeltaLower)
    dateDelta(pathologyDate, sampleDeltaUpper)
  )

  steps = []

  ## Create a participant
  steps.push
    "id" : ObjectId()
    "stepRef" : getId('step_participant')
    "stepDate" : participantDate
    "stepUser" : "swatt"
    "fields" :
      "key" : "identifier"
      "identity" : identifier

  steps.push
    "id" : ObjectId()
    "stepRef" : getId('step_enrolment')
    "stepDate" : participantDate
    "stepUser" : "swatt"
    "fields" :
      "key" : "enrolmentDate"
      "value" : toFloatingISOString(participantDate)

  steps.push
    "id" : ObjectId()
    "stepRef" : getId('step_consent')
    "stepDate" : consentDate
    "stepUser" : "swatt"
    "fields" :
      "key" : "consentDate",
      "value" : toFloatingISOString(consentDate)

  steps.push
    "id" : ObjectId()
    "stepRef" : getId('step_biopsy')
    "stepDate" : biopsyDate
    "stepUser" : "swatt"
    "fields" : [{
      "key" : "biopsyDate"
      "value" : toFloatingISOString(biopsyDate)
    }, {
      "key" : "biopsyCores"
      "value" : Math.round(boundedRandomNormal(4, 1, 3, 6))
    }]

  steps.push
    "id" : ObjectId(),
    "stepRef" : getId('step_pathology')
    "stepDate" : pathologyDate
    "stepUser" : "swatt",
    "fields" :
      "key" : "pathologyDate",
      "value" : toFloatingISOString(pathologyDate)


  db.entities.insert
    "_id": getId('participant_' + identifier)
    "studyId" : getId('study')
    "lastModified" : participantDate
    "role" : "participants"
    "identity" : identifier
    "steps" : steps

  ## Okay. Now we have a participant, let's add some samples. Two, as per protocol.

  ## Right, and let's also work out some mutations. These might vary slightly between
  ## samples. Work out a core list and then vary them.
  mutationCount = generateMutationCount()
  mutations = for i in [1..mutationCount]
    knownMutations[Math.floor(knownMutations.length * Math.random())]

  # Each sample might vary slightly in what is observed
  for sampleNumber in [1..2]
    sampleIdentifier = identifier.replace('-', '') + "BIOXPAR" + sampleNumber

    observed = (m for m in mutations when Math.random() > 0.05)

    db.entities.insert
      "_id" : getId('sample_' + sampleIdentifier)
      "studyId" : getId('study')
      "lastModified" : sampleDate
      "role" : "samples",
      "identity" : sampleIdentifier
      "steps" :
        "id" : ObjectId(),
        "stepRef" : getId('step_sample')
        "stepDate" : sampleDate
        "stepUser" : "swatt",
        "fields" : [{
          "key" : "identifier",
          "identity" : sampleIdentifier
        }, {
          "key" : "participantEntityRef",
          "ref" : getId('participant_' + identifier)
        }, {
          "key" : "source",
          "value" : "Biopsy"
        }, {
          "key" : "type",
          "value" : "FFPE"
        }]

    for mutation in observed

      mutationName = "p." + convertCodesToNames(mutation.mutation)

      db.entities.insert
        "studyId" : getId('study')
        "lastModified" : sampleDate
        "role" : "observations",
        "name" : mutation.gene + " " + mutationName
        "identity" : ObjectId().str
        "steps" :
          "id" : ObjectId()
          "stepRef" : getId('step_observation')
          "stepDate" : sampleDate
          "stepUser" : "swatt"
          "fields": [{
            "key" : "sampleEntityRef"
            "ref" : getId('sample_' + sampleIdentifier)
          }, {
            "key" : "participantEntityRef"
            "ref" : getId('participant_' + identifier)
          }, {
            "key" : "aminoAcidMutation"
            "value" : mutationName
          }, {
            "key" : "geneName"
            "value" : mutation.gene
          }, {
            "key" : "label"
            "value" : mutation.gene + " " + mutationName
          }, {
            "key" : "geneId"
            "value" : mutation.geneId
          }, {
            "key" : "transcriptId"
            "value" : mutation.transcriptId
          }]


  lastDate = participantDate


## Now we can generate and dump out the various collections.
collections = ['studies', 'steps', 'views', 'entities']
for collection in collections
  print "db.#{collection}.drop();"
for collection in collections
  print "db.createCollection('#{collection}');"

for collection in collections
  cursor = db.getCollection(collection).find()
  cursor.forEach (element) ->
    json = tojson(element)
    print "db.#{collection}.insert(#{json});"