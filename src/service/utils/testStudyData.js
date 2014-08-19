db.studies.drop();
db.steps.drop();
db.views.drop();
db.entities.drop();
db.createCollection('studies');
db.createCollection('steps');
db.createCollection('views');
db.createCollection('entities');
db.studies.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8d7"),
	"version" : 1,
	"name" : "Test Study",
	"access" : {
		"modify" : [
			"swatt",
			"acavender"
		],
		"read" : [
			"oloudon",
			"mweisner",
			"sboon"
		]
	},
	"notes" : {
		"observations" : {
			"ownerFields" : [
				"sampleEntityRef",
				"participantEntityRef"
			]
		},
		"samples" : {
			"ownerFields" : [
				"participantEntityRef"
			]
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8d8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "participants",
	"weight" : 0,
	"name" : "participant",
	"showSummary" : false,
	"isRepeatable" : false,
	"stepOptions" : {
		"method" : "CreateEntity"
	},
	"access" : {
		"modify" : [
			"swatt"
		],
		"none" : [
			"oloudon",
			"mweisner"
		]
	},
	"label" : {
		"default" : "Create participant"
	},
	"redoLabel" : {
		"default" : "Update participant"
	},
	"fields" : {
		"identifier" : {
			"controlType" : "identity",
			"type" : "String",
			"isRequired" : true,
			"isIdentity" : true,
			"pattern" : "TST-\\d{3,3}",
			"pattern-message" : "Must have the format TST-nnn",
			"label" : {
				"default" : "Identifier"
			}
		},
		"institution" : {
			"controlType" : "select",
			"type" : "String",
			"range" : [
				"PMH/UHN",
				"London",
				"Ottawa",
				"Thunder Bay"
			],
			"isRequired" : true,
			"label" : {
				"default" : "Institution"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8d9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"weight" : 10,
	"appliesTo" : "participants",
	"name" : "enrolment",
	"showSummary" : true,
	"isRepeatable" : false,
	"label" : {
		"default" : "Enrolment"
	},
	"access" : {
		"modify" : [
			"swatt",
			"oloudon"
		],
		"read" : [
			"acavender",
			"mweisner"
		]
	},
	"fields" : {
		"enrolmentDate" : {
			"controlType" : "date",
			"type" : "Date",
			"isRequired" : true,
			"label" : {
				"default" : "Enrolment date"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8da"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "participants",
	"weight" : 20,
	"name" : "consent",
	"showSummary" : true,
	"isRepeatable" : false,
	"label" : {
		"default" : "Consent"
	},
	"access" : {
		"modify" : [
			"swatt",
			"acavender"
		],
		"read" : [
			"oloudon",
			"mweisner"
		]
	},
	"fields" : {
		"consentDate" : {
			"controlType" : "date",
			"type" : "Date",
			"isRequired" : true,
			"label" : {
				"default" : "Consent date"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8db"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "participants",
	"weight" : 30,
	"name" : "biopsy",
	"showSummary" : true,
	"isRepeatable" : true,
	"label" : {
		"default" : "Biopsy"
	},
	"access" : {
		"modify" : [
			"swatt",
			"mweisner"
		],
		"none" : [
			"oloudon",
			"acavender"
		]
	},
	"fields" : {
		"biopsyDate" : {
			"controlType" : "date",
			"type" : "Date",
			"isRequired" : true,
			"label" : {
				"default" : "Biopsy date"
			}
		},
		"biopsyCores" : {
			"controlType" : "integer",
			"type" : "Integer",
			"isRequired" : true,
			"label" : {
				"default" : "Number of cores"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8dc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "participants",
	"weight" : 40,
	"name" : "pathology",
	"showSummary" : true,
	"isRepeatable" : false,
	"label" : {
		"default" : "Pathology"
	},
	"fields" : {
		"pathologyDate" : {
			"controlType" : "date",
			"type" : "Date",
			"isRequired" : true,
			"label" : {
				"default" : "Pathology date"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8dd"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "participants",
	"weight" : 200,
	"name" : "clinicalHistory",
	"showSummary" : true,
	"isRepeatable" : false,
	"label" : {
		"default" : "Clinical history"
	},
	"fields" : {
		"clinicalHistory" : {
			"controlType" : "textarea",
			"controlArguments" : {
				"html" : true
			},
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "History"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8de"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "participants",
	"weight" : 300,
	"name" : "genomics",
	"showSummary" : false,
	"isRepeatable" : false,
	"label" : {
		"default" : "Genomics"
	},
	"fields" : {
		"file" : {
			"controlType" : "file",
			"type" : "File",
			"isRequired" : true,
			"label" : {
				"default" : "File"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8df"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "participants",
	"name" : "addSample",
	"showSummary" : false,
	"isRepeatable" : false,
	"label" : {
		"default" : "Add sample"
	},
	"access" : {
		"modify" : [
			"swatt",
			"mweisner"
		],
		"none" : [
			"oloudon",
			"acavender"
		]
	},
	"weight" : 400,
	"url" : "{{study.url}}/samples/id;new/step/sample?participantEntityRef={{identity}}"
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "participants",
	"weight" : 500,
	"name" : "expertPanel",
	"showSummary" : true,
	"isRepeatable" : true,
	"label" : {
		"default" : "Expert panel decision"
	},
	"access" : {
		"modify" : [
			"swatt",
			"oloudon"
		],
		"none" : [
			"mweisner",
			"acavender"
		]
	},
	"fields" : {
		"observationRef" : {
			"controlType" : "chooser",
			"entity" : "observations",
			"type" : "Reference",
			"isRequired" : true,
			"isReadonly" : false,
			"label" : {
				"default" : "Observation"
			}
		},
		"reportable" : {
			"controlType" : "checkbox",
			"type" : "Boolean",
			"default" : false,
			"isRequired" : true,
			"label" : {
				"default" : "Reportable"
			}
		},
		"actionable" : {
			"controlType" : "checkbox",
			"type" : "Boolean",
			"default" : false,
			"isRequired" : true,
			"label" : {
				"default" : "Actionable"
			}
		},
		"expertPanelDate" : {
			"controlType" : "date",
			"type" : "Date",
			"isRequired" : true,
			"label" : {
				"default" : "Expert panel date"
			}
		},
		"expertPanelDecision" : {
			"controlType" : "textarea",
			"controlArguments" : {
				"html" : true
			},
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "Expert panel decision"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "samples",
	"weight" : 0,
	"stepOptions" : {
		"method" : "CreateEntity",
		"parentField" : "participantEntityRef"
	},
	"name" : "sample",
	"showSummary" : false,
	"isRepeatable" : false,
	"label" : {
		"default" : "Create sample"
	},
	"redoLabel" : {
		"default" : "Update sample"
	},
	"fields" : {
		"identifier" : {
			"controlType" : "identity",
			"type" : "String",
			"isRequired" : true,
			"isIdentity" : true,
			"label" : {
				"default" : "Barcode"
			}
		},
		"participantEntityRef" : {
			"controlType" : "reference",
			"entity" : "participants",
			"type" : "Reference",
			"isRequired" : true,
			"isReadonly" : true,
			"label" : {
				"default" : "Participant"
			}
		},
		"source" : {
			"controlType" : "select",
			"type" : "String",
			"range" : [
				"Biopsy",
				"Archival",
				"Control"
			],
			"isRequired" : true,
			"label" : {
				"default" : "Source"
			}
		},
		"type" : {
			"controlType" : "select",
			"type" : "String",
			"range" : [
				"FFPE",
				"Frozen",
				"Blood",
				"Fluid",
				"FNA"
			],
			"isRequired" : true,
			"label" : {
				"default" : "Type"
			}
		},
		"site" : {
			"controlType" : "select",
			"type" : "String",
			"range" : [
				"Primary",
				"Metastates"
			],
			"label" : {
				"default" : "Site"
			}
		},
		"requiresCollection" : {
			"controlType" : "checkbox",
			"type" : "Boolean",
			"default" : true,
			"isRequired" : true,
			"label" : {
				"default" : "Requires collection"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e2"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "samples",
	"weight" : 10,
	"name" : "assessSample",
	"showSummary" : true,
	"label" : {
		"default" : "Record sample quality"
	},
	"description" : {
		"default" : "Record this sample's DNA quality and concentration."
	},
	"fields" : {
		"dnaConcentration" : {
			"controlType" : "float",
			"type" : "Float",
			"label" : {
				"default" : "DNA concentration"
			}
		},
		"dnaQuality" : {
			"controlType" : "select",
			"type" : "String",
			"range" : [
				"Good",
				"Moderate",
				"Poor"
			],
			"label" : {
				"default" : "DNA quality"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "samples",
	"weight" : 20,
	"name" : "markAsCollected",
	"showSummary" : true,
	"isRepeatable" : false,
	"label" : {
		"default" : "Mark as collected"
	},
	"description" : {
		"default" : "Mark this sample as collected."
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "samples",
	"weight" : 10,
	"name" : "recordResults",
	"showSummary" : true,
	"isRepeatable" : false,
	"label" : {
		"default" : "Record results"
	},
	"description" : {
		"default" : "Records results for a sample. Choose a VCF file generated by the Emsembl <code>VEP</code> tool, using options:<br><code>perl variant_effect_predictor.pl --input_file x.vcf --output_file out.vcf --format vcf --vcf --hgvs ...</code>"
	},
	"access" : {
		"modify" : [
			"acavender"
		],
		"none" : [
			"mweisner",
			"oloudon"
		]
	},
	"plugin" : {
		"module" : "vcf",
		"method" : "handleVcf"
	},
	"fields" : {
		"dataFile" : {
			"controlType" : "file",
			"type" : "File",
			"label" : {
				"default" : "Data file"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "observations",
	"weight" : 0,
	"name" : "observation",
	"showSummary" : false,
	"isRepeatable" : false,
	"stepOptions" : {
		"method" : "CreateEntity",
		"parentField" : "sampleEntityRef"
	},
	"label" : {
		"default" : "Create observation"
	},
	"redoLabel" : {
		"default" : "Update observation"
	},
	"fields" : {
		"label" : {
			"controlType" : "hidden",
			"type" : "String",
			"name" : true,
			"label" : {
				"default" : "Name"
			}
		},
		"participantEntityRef" : {
			"controlType" : "reference",
			"type" : "Reference",
			"entity" : "participants",
			"isRequired" : true,
			"label" : {
				"default" : "Participant"
			}
		},
		"sampleEntityRef" : {
			"controlType" : "reference",
			"type" : "Reference",
			"entity" : "samples",
			"isRequired" : true,
			"label" : {
				"default" : "Sample"
			}
		},
		"genomicPosition" : {
			"controlType" : "text",
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "Genomic position"
			}
		},
		"genomicChange" : {
			"controlType" : "text",
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "Genomic change"
			}
		},
		"geneName" : {
			"controlType" : "text",
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "Gene"
			}
		},
		"geneId" : {
			"controlType" : "text",
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "Gene ID"
			}
		},
		"transcriptId" : {
			"controlType" : "text",
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "Transcript ID"
			}
		},
		"aminoAcidMutation" : {
			"controlType" : "text",
			"type" : "String",
			"isRequired" : false,
			"label" : {
				"default" : "Protein mutation"
			}
		},
		"dnaMutation" : {
			"controlType" : "text",
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "DNA mutation"
			}
		},
		"depth" : {
			"controlType" : "text",
			"type" : "String",
			"isRequired" : true,
			"label" : {
				"default" : "Depth"
			}
		}
	}
});
db.steps.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e6"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"appliesTo" : "observations",
	"weight" : 100,
	"name" : "clinicallyVerified",
	"showSummary" : true,
	"isRepeatable" : false,
	"label" : {
		"default" : "Clinical verification"
	},
	"fields" : {
		"verified" : {
			"controlType" : "checkbox",
			"type" : "Boolean",
			"default" : false,
			"isRequired" : true,
			"label" : {
				"default" : "Verified"
			}
		},
		"frequency" : {
			"controlType" : "integer",
			"type" : "Integer",
			"isRequired" : false,
			"label" : {
				"default" : "Frequency"
			}
		}
	}
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e7"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "summary",
	"role" : "studies",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Number of participants</dt>\n  <dd>{{study.data.counts.participants}}</dd>\n  <dt>Number of samples</dt>\n  <dd>{{study.data.counts.samples}}</dd>\n  <dt>Observed mutations</dt>\n  <dd>{{study.data.counts.observations}}</dd>\n</dl>\n"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "participants",
	"role" : "studies",
	"label" : {
		"default" : "Participants"
	},
	"weight" : 100,
	"body" : "<div heli-study-entities role='participants' label='Participants'>\n</div>\n<br>\n"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8e9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "samples",
	"role" : "studies",
	"label" : {
		"default" : "Samples"
	},
	"weight" : 200,
	"body" : "<div heli-study-entities role='samples' label='Samples'>\n</div>\n<br>\n"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8ea"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "summary",
	"role" : "participants",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Registered</dt>\n  <dd>{{entity.data.values.enrolmentDate | field}}</dd>\n  <dt>Consent</dt>\n  <dd>{{entity.data.values.consentDate | field}}</dd>\n  <dt>Biopsy</dt>\n  <dd>{{entity.data.values.biopsyDate | field}}</dd>\n  <dt>Pathology</dt>\n  <dd>{{entity.data.values.pathologyDate | field}}</dd>\n  <dt>Clinical lab</dt>\n  <dd>{{entity.data.values.clinicalLaboratoryDate | field}}</dd>\n  <dt>Research lab</dt>\n  <dd>{{entity.data.values.researchLaboratoryDate | field}}</dd>\n  <dt>Expert panel</dt>\n  <dd>{{entity.data.values.expertPanelDate | field}}</dd>\n</dl>\n"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8eb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "enrolment",
	"role" : "participants",
	"label" : {
		"default" : "Enrolment"
	},
	"weight" : 100,
	"body" : "<dl>\n  <dt>Registered</dt>\n  <dd>{{entity.data.values.enrolmentDate | field}}</dd>\n  <dt>Consent</dt>\n  <dd>{{entity.data.values.consentDate | field}}</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8ec"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "samples",
	"role" : "participants",
	"label" : {
		"default" : "Samples"
	},
	"weight" : 200,
	"body" : "<table>\n  <thead></thead>\n  <tbody>\n    <tr ng-repeat='sample in entity.data.related.samples'>\n      <td><a href='/studies/{{entity.data.study.name | encodeURIComponent}}/{{sample.role | encodeURIComponent}}/{{sample.identity | encodeURIComponent}}'>{{sample.identity}}</a>\n    </tr>\n  <tbody>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8ed"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "history",
	"role" : "participants",
	"label" : {
		"default" : "Clinical history"
	},
	"weight" : 300,
	"body" : "<div>\n{{entity.data.values.clinicalHistory | field}}\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8ee"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "observations",
	"role" : "participants",
	"label" : {
		"default" : "Observations"
	},
	"weight" : 400,
	"body" : "<table heli-observations>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8ef"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "steps",
	"role" : "participants",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8f0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "summary",
	"role" : "samples",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Requires collection</dt>\n  <dd>{{entity.data.values.requiresCollection | field}}</dd>\n  <dt>DNA quality</dt>\n  <dd>{{entity.data.values.dnaQuality | field}}</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8f1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "participants",
	"role" : "samples",
	"label" : {
		"default" : "Participant"
	},
	"weight" : 100,
	"body" : "<table>\n  <thead></thead>\n  <tbody>\n    <tr ng-repeat='participant in entity.data.related.participants'>\n      <td><a href='{{participant.url}}'>{{participant.identity}}</a>\n    </tr>\n  </tbody>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8f2"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "observations",
	"role" : "samples",
	"label" : {
		"default" : "Observations"
	},
	"weight" : 400,
	"body" : "<table heli-observations>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8f3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "steps",
	"role" : "samples",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8f4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "summary",
	"role" : "observations",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Gene name</dt>\n  <dd>{{entity.data.values.geneName | field}}</dd>\n  <dt>Ensembl gene id</dt>\n  <dd><a href='http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g={{entity.data.values.geneId | field}}' rel='external'>{{entity.data.values.geneId | field}}</a></dd>\n  <dt>Ensembl transcript id</dt>\n  <dd><a href='http://useast.ensembl.org/Homo_sapiens/Transcript/Summary?t={{entity.data.values.geneId | field}}' rel='external'>{{entity.data.values.transcriptId | field}}</a></dd>\n  <dt>Amino acid mutation</dt>\n  <dd ng-show='entity.data.values.aminoAcidMutation'>{{entity.data.values.aminoAcidMutation | field}}</dd>\n  <dd ng-hide='entity.data.values.aminoAcidMutation'>Not available</dd>\n  <dt>DNA mutation</dt>\n  <dd>{{entity.data.values.dnaMutation | field}}</dd>\n  <dt>Depth</dt>\n  <dd>{{entity.data.values.depth | field}}</dd>\n  <dt>Open in knowledge base</dt>\n  <dd heli-knowledge-base-search term='entity.data.values.geneName.value + &quot;+&quot; + (entity.data.values.aminoAcidMutation.value || entity.data.values.dnaMutation.value)' entity='entity'>Not available</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8f5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"name" : "steps",
	"role" : "observations",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8fb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-26T14:42:20.999Z"),
	"role" : "participants",
	"identity" : "TST-001",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d8f6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-07-26T14:42:20.999Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-001"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d8f7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-07-26T14:42:20.999Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-07-26T14:42:20.999"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d8f8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-07-29T20:05:33.214Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-07-29T20:05:33.214"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d8f9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-07-29T21:14:24.649Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-07-29T21:14:24.649"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d8fa"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-07-30T19:14:28.905Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-07-30T19:14:28.905"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d8fc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "samples",
	"identity" : "TST001BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d8fd"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST001BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d900"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f37718d7db4984c320d8fe",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d8ff"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu136Lys"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu136Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d903"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f37718d7db4984c320d901",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d902"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His179Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His179Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d906"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37718d7db4984c320d904",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d905"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu542Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu542Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d909"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala41Thr",
	"identity" : "53f37718d7db4984c320d907",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d908"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala41Thr"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Ala41Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d90a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "samples",
	"identity" : "TST001BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d90b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST001BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d90e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37718d7db4984c320d90c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d90d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d90a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu545Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu545Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d921"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-03T21:53:51.836Z"),
	"role" : "samples",
	"identity" : "TST002BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d922"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-03T21:53:51.836Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST002BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d920")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d911"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f37718d7db4984c320d90f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d910"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d90a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu136Lys"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu136Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d914"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f37718d7db4984c320d912",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d913"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d90a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His179Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His179Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d917"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37718d7db4984c320d915",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d916"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d90a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu542Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu542Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d91a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-30T19:22:09.506Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala41Thr",
	"identity" : "53f37718d7db4984c320d918",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d919"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-07-30T19:22:09.506Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d90a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d8fb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala41Thr"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Ala41Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d920"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-07-28T17:26:58.058Z"),
	"role" : "participants",
	"identity" : "TST-002",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d91b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-07-28T17:26:58.058Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-002"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d91c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-07-28T17:26:58.058Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-07-28T17:26:58.058"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d91d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-01T17:44:55.158Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-01T17:44:55.158"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d91e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-01T19:52:38.049Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-01T19:52:38.049"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d91f"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-03T20:12:43.156Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-03T20:12:43.156"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d925"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-03T21:53:51.836Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f37718d7db4984c320d923",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d924"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-03T21:53:51.836Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d921")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d920")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly553Val"
			},
			{
				"key" : "geneName",
				"value" : "EGFR"
			},
			{
				"key" : "label",
				"value" : "EGFR p.Gly553Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000146648"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000275493"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d926"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-03T21:53:51.836Z"),
	"role" : "samples",
	"identity" : "TST002BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d927"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-03T21:53:51.836Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST002BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d920")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d92a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-03T21:53:51.836Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f37718d7db4984c320d928",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d929"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-03T21:53:51.836Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d926")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d920")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly553Val"
			},
			{
				"key" : "geneName",
				"value" : "EGFR"
			},
			{
				"key" : "label",
				"value" : "EGFR p.Gly553Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000146648"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000275493"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d930"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-02T14:01:55.370Z"),
	"role" : "participants",
	"identity" : "TST-003",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d92b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-02T14:01:55.370Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-003"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d92c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-02T14:01:55.370Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-02T14:01:55.370"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d92d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-05T18:20:15.581Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-05T18:20:15.581"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d92e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-05T21:13:47.680Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-05T21:13:47.680"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d92f"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-06T20:41:07.385Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-06T20:41:07.385"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d931"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "samples",
	"identity" : "TST003BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d932"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST003BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d935"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "FRG1B p.Leu87Ser",
	"identity" : "53f37718d7db4984c320d933",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d934"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d931")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu87Ser"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Leu87Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d938"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "NOTCH2 p.Ala21Thr",
	"identity" : "53f37718d7db4984c320d936",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d937"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d931")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala21Thr"
			},
			{
				"key" : "geneName",
				"value" : "NOTCH2"
			},
			{
				"key" : "label",
				"value" : "NOTCH2 p.Ala21Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000134250"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256646"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d93b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gly",
	"identity" : "53f37718d7db4984c320d939",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d93a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d931")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gly"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d93e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "PGM5 p.Ile98Val",
	"identity" : "53f37718d7db4984c320d93c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d93d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d931")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile98Val"
			},
			{
				"key" : "geneName",
				"value" : "PGM5"
			},
			{
				"key" : "label",
				"value" : "PGM5 p.Ile98Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000154330"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000396396"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d941"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37718d7db4984c320d93f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d940"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d931")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu542Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu542Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d942"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "samples",
	"identity" : "TST003BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d943"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST003BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d946"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "FRG1B p.Leu87Ser",
	"identity" : "53f37718d7db4984c320d944",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d945"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d942")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu87Ser"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Leu87Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d949"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "NOTCH2 p.Ala21Thr",
	"identity" : "53f37718d7db4984c320d947",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d948"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d942")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala21Thr"
			},
			{
				"key" : "geneName",
				"value" : "NOTCH2"
			},
			{
				"key" : "label",
				"value" : "NOTCH2 p.Ala21Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000134250"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256646"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d94c"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gly",
	"identity" : "53f37718d7db4984c320d94a",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d94b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d942")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gly"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d94f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "PGM5 p.Ile98Val",
	"identity" : "53f37718d7db4984c320d94d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d94e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d942")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile98Val"
			},
			{
				"key" : "geneName",
				"value" : "PGM5"
			},
			{
				"key" : "label",
				"value" : "PGM5 p.Ile98Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000154330"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000396396"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d952"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-07T17:49:45.946Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37718d7db4984c320d950",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d951"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-07T17:49:45.946Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d942")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d930")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu542Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu542Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d958"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-06T20:42:32.123Z"),
	"role" : "participants",
	"identity" : "TST-004",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d953"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-06T20:42:32.123Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-004"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d954"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-06T20:42:32.123Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-06T20:42:32.123"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d955"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-10T20:59:29.527Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-10T20:59:29.527"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d956"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-10T21:43:28.572Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-10T21:43:28.572"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d957"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-13T21:33:25.959Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-13T21:33:25.959"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d959"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "samples",
	"identity" : "TST004BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d95a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST004BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d95d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "TP53 p.Tyr163Cys",
	"identity" : "53f37718d7db4984c320d95b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d95c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d959")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr163Cys"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Tyr163Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d960"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "LATS2 p.Ala324Val",
	"identity" : "53f37718d7db4984c320d95e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d95f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d959")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala324Val"
			},
			{
				"key" : "geneName",
				"value" : "LATS2"
			},
			{
				"key" : "label",
				"value" : "LATS2 p.Ala324Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000150457"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382592"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d963"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f37718d7db4984c320d961",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d962"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d959")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly118Asp"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Gly118Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d966"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ile45Thr",
	"identity" : "53f37718d7db4984c320d964",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d965"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d959")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile45Thr"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Ile45Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d969"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132His",
	"identity" : "53f37718d7db4984c320d967",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d968"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d959")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132His"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d96c"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f37718d7db4984c320d96a",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d96b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d959")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu136Lys"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu136Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d96f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Asp",
	"identity" : "53f37718d7db4984c320d96d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d96e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d959")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Asp"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d970"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "samples",
	"identity" : "TST004BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d971"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST004BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d974"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "LATS2 p.Ala324Val",
	"identity" : "53f37718d7db4984c320d972",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d973"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d970")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala324Val"
			},
			{
				"key" : "geneName",
				"value" : "LATS2"
			},
			{
				"key" : "label",
				"value" : "LATS2 p.Ala324Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000150457"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382592"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d977"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f37718d7db4984c320d975",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d976"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d970")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly118Asp"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Gly118Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d97a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ile45Thr",
	"identity" : "53f37718d7db4984c320d978",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d979"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d970")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile45Thr"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Ile45Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d97d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132His",
	"identity" : "53f37718d7db4984c320d97b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d97c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d970")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132His"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d980"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f37718d7db4984c320d97e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d97f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d970")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu136Lys"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu136Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d983"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:51:19.430Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Asp",
	"identity" : "53f37718d7db4984c320d981",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d982"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:51:19.430Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d970")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d958")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Asp"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d989"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-06T21:01:54.088Z"),
	"role" : "participants",
	"identity" : "TST-005",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d984"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-06T21:01:54.088Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-005"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d985"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-06T21:01:54.088Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-06T21:01:54.088"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d986"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-09T13:48:17.238Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-09T13:48:17.238"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d987"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-09T16:29:16.893Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-09T16:29:16.893"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d988"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-12T18:31:20.421Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-12T18:31:20.421"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d98a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "samples",
	"identity" : "TST005BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d98b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST005BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d98e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37718d7db4984c320d98c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d98d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d98a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Cys27Phe"
			},
			{
				"key" : "geneName",
				"value" : "OPRD1"
			},
			{
				"key" : "label",
				"value" : "OPRD1 p.Cys27Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000116329"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000234961"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d991"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "observations",
	"name" : "CHEK2 p.Lys344Glu",
	"identity" : "53f37718d7db4984c320d98f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d990"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d98a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Lys344Glu"
			},
			{
				"key" : "geneName",
				"value" : "CHEK2"
			},
			{
				"key" : "label",
				"value" : "CHEK2 p.Lys344Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000183765"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382580"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d994"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Pro323His",
	"identity" : "53f37718d7db4984c320d992",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d993"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d98a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro323His"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Pro323His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d997"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f37718d7db4984c320d995",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d996"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d98a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu66His"
			},
			{
				"key" : "geneName",
				"value" : "KCNN3"
			},
			{
				"key" : "label",
				"value" : "KCNN3 p.Leu66His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000143603"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000271915"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d998"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "samples",
	"identity" : "TST005BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d999"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST005BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d99c"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37718d7db4984c320d99a",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d99b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d998")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Cys27Phe"
			},
			{
				"key" : "geneName",
				"value" : "OPRD1"
			},
			{
				"key" : "label",
				"value" : "OPRD1 p.Cys27Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000116329"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000234961"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d99f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "observations",
	"name" : "CHEK2 p.Lys344Glu",
	"identity" : "53f37718d7db4984c320d99d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d99e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d998")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Lys344Glu"
			},
			{
				"key" : "geneName",
				"value" : "CHEK2"
			},
			{
				"key" : "label",
				"value" : "CHEK2 p.Lys344Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000183765"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382580"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9a2"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Pro323His",
	"identity" : "53f37718d7db4984c320d9a0",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9a1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d998")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro323His"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Pro323His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9a5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-12T21:22:55.737Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f37718d7db4984c320d9a3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9a4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-12T21:22:55.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d998")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d989")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu66His"
			},
			{
				"key" : "geneName",
				"value" : "KCNN3"
			},
			{
				"key" : "label",
				"value" : "KCNN3 p.Leu66His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000143603"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000271915"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9ab"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-10T20:37:01.324Z"),
	"role" : "participants",
	"identity" : "TST-006",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d9a6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-10T20:37:01.324Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-006"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9a7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-10T20:37:01.324Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-10T20:37:01.324"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9a8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-11T20:34:05.079Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-11T20:34:05.079"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9a9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-11T21:00:20.066Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-11T21:00:20.066"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9aa"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-13T20:07:34.952Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-13T20:07:34.952"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9ac"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:11:26.633Z"),
	"role" : "samples",
	"identity" : "TST006BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9ad"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-13T21:11:26.633Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST006BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9ab")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9b0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:11:26.633Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37718d7db4984c320d9ae",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9af"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:11:26.633Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9ac")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9ab")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala242Thr"
			},
			{
				"key" : "geneName",
				"value" : "ZNF837"
			},
			{
				"key" : "label",
				"value" : "ZNF837 p.Ala242Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000152475"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000427624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9b1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:11:26.633Z"),
	"role" : "samples",
	"identity" : "TST006BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9b2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-13T21:11:26.633Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST006BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9ab")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9b5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-13T21:11:26.633Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37718d7db4984c320d9b3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9b4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-13T21:11:26.633Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9b1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9ab")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala242Thr"
			},
			{
				"key" : "geneName",
				"value" : "ZNF837"
			},
			{
				"key" : "label",
				"value" : "ZNF837 p.Ala242Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000152475"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000427624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9bb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-11T18:54:43.525Z"),
	"role" : "participants",
	"identity" : "TST-007",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d9b6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-11T18:54:43.525Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-007"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9b7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-11T18:54:43.525Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-11T18:54:43.525"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9b8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-13T15:35:50.645Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-13T15:35:50.645"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9b9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-13T21:23:02.811Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-13T21:23:02.811"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9ba"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-14T21:46:47.848Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-14T21:46:47.848"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9bc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-15T14:35:58.780Z"),
	"role" : "samples",
	"identity" : "TST007BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9bd"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-15T14:35:58.780Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST007BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9bb")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9c0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-15T14:35:58.780Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37718d7db4984c320d9be",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9bf"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-15T14:35:58.780Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9bc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9bb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile102Thr"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Ile102Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9c1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-15T14:35:58.780Z"),
	"role" : "samples",
	"identity" : "TST007BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9c2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-15T14:35:58.780Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST007BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9bb")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9c5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-15T14:35:58.780Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37718d7db4984c320d9c3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9c4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-15T14:35:58.780Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9c1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9bb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile102Thr"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Ile102Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9cb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-15T21:49:46.420Z"),
	"role" : "participants",
	"identity" : "TST-008",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d9c6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-15T21:49:46.420Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-008"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9c7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-15T21:49:46.420Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-15T21:49:46.420"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9c8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-16T17:49:25.627Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-16T17:49:25.627"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9c9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-16T21:15:23.119Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-16T21:15:23.119"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9ca"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-18T13:51:05.479Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-18T13:51:05.479"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9cc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "samples",
	"identity" : "TST008BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9cd"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST008BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9d0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37718d7db4984c320d9ce",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9cf"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser43Gly"
			},
			{
				"key" : "geneName",
				"value" : "EEF1B2"
			},
			{
				"key" : "label",
				"value" : "EEF1B2 p.Ser43Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000114942"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000392222"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9d3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "NRAS p.Gln61Lys",
	"identity" : "53f37718d7db4984c320d9d1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9d2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Lys"
			},
			{
				"key" : "geneName",
				"value" : "NRAS"
			},
			{
				"key" : "label",
				"value" : "NRAS p.Gln61Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000213281"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000369535"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9d6"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37718d7db4984c320d9d4",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9d5"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg322Lys"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Arg322Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9d9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "FEZ2 p.Pro50Leu",
	"identity" : "53f37718d7db4984c320d9d7",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9d8"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro50Leu"
			},
			{
				"key" : "geneName",
				"value" : "FEZ2"
			},
			{
				"key" : "label",
				"value" : "FEZ2 p.Pro50Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171055"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000379245"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9dc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37718d7db4984c320d9da",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9db"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Ala"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9df"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu135Gly",
	"identity" : "53f37718d7db4984c320d9dd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9de"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu135Gly"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu135Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9e0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "samples",
	"identity" : "TST008BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9e1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST008BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9e4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37718d7db4984c320d9e2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9e3"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9e0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser43Gly"
			},
			{
				"key" : "geneName",
				"value" : "EEF1B2"
			},
			{
				"key" : "label",
				"value" : "EEF1B2 p.Ser43Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000114942"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000392222"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9e7"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "NRAS p.Gln61Lys",
	"identity" : "53f37718d7db4984c320d9e5",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9e6"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9e0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Lys"
			},
			{
				"key" : "geneName",
				"value" : "NRAS"
			},
			{
				"key" : "label",
				"value" : "NRAS p.Gln61Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000213281"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000369535"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9ea"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37718d7db4984c320d9e8",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9e9"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9e0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg322Lys"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Arg322Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9ed"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "FEZ2 p.Pro50Leu",
	"identity" : "53f37718d7db4984c320d9eb",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9ec"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9e0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro50Leu"
			},
			{
				"key" : "geneName",
				"value" : "FEZ2"
			},
			{
				"key" : "label",
				"value" : "FEZ2 p.Pro50Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171055"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000379245"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9f0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37718d7db4984c320d9ee",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9ef"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9e0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Ala"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9f3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-18T17:44:16.037Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu135Gly",
	"identity" : "53f37718d7db4984c320d9f1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9f2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-18T17:44:16.037Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9e0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9cb")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu135Gly"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu135Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9f9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-17T19:51:18.779Z"),
	"role" : "participants",
	"identity" : "TST-009",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320d9f4"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-17T19:51:18.779Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-009"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9f5"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-17T19:51:18.779Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-17T19:51:18.779"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9f6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-19T20:44:00.324Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-19T20:44:00.324"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9f7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-19T21:28:41.997Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-19T21:28:41.997"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320d9f8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-21T20:41:37.842Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-21T20:41:37.842"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9fa"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "samples",
	"identity" : "TST009BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9fb"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST009BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320d9fe"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37718d7db4984c320d9fc",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320d9fd"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9fa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg82Cys"
			},
			{
				"key" : "geneName",
				"value" : "GSG2"
			},
			{
				"key" : "label",
				"value" : "GSG2 p.Arg82Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000177602"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000325418"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da01"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132His",
	"identity" : "53f37718d7db4984c320d9ff",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da00"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9fa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132His"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da04"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu726Lys",
	"identity" : "53f37718d7db4984c320da02",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da03"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9fa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu726Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu726Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da07"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37718d7db4984c320da05",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da06"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9fa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg347Cys"
			},
			{
				"key" : "geneName",
				"value" : "FBXW7"
			},
			{
				"key" : "label",
				"value" : "FBXW7 p.Arg347Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000109670"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000281708"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da0a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f37718d7db4984c320da08",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da09"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9fa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg175His"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg175His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da0b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "samples",
	"identity" : "TST009BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da0c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST009BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da0f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f37718d7db4984c320da0d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da0e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da0b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val474Ala"
			},
			{
				"key" : "geneName",
				"value" : "ARHGAP5"
			},
			{
				"key" : "label",
				"value" : "ARHGAP5 p.Val474Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100852"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000345122"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da12"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37718d7db4984c320da10",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da11"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da0b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg82Cys"
			},
			{
				"key" : "geneName",
				"value" : "GSG2"
			},
			{
				"key" : "label",
				"value" : "GSG2 p.Arg82Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000177602"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000325418"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da15"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132His",
	"identity" : "53f37718d7db4984c320da13",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da14"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da0b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132His"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da18"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu726Lys",
	"identity" : "53f37718d7db4984c320da16",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da17"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da0b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu726Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu726Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da1b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37718d7db4984c320da19",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da1a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da0b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg347Cys"
			},
			{
				"key" : "geneName",
				"value" : "FBXW7"
			},
			{
				"key" : "label",
				"value" : "FBXW7 p.Arg347Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000109670"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000281708"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da1e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-22T13:50:46.093Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f37718d7db4984c320da1c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da1d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-22T13:50:46.093Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da0b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320d9f9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg175His"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg175His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da24"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-20T19:48:29.605Z"),
	"role" : "participants",
	"identity" : "TST-010",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320da1f"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-20T19:48:29.605Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-010"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da20"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-20T19:48:29.605Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-20T19:48:29.605"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da21"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-22T19:16:44.734Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-22T19:16:44.734"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da22"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-22T20:11:12.956Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-22T20:11:12.956"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da23"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-25T18:46:57.860Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-25T18:46:57.860"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da25"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-25T21:01:00.103Z"),
	"role" : "samples",
	"identity" : "TST010BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da26"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-25T21:01:00.103Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST010BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da24")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da29"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-25T21:01:00.103Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f37718d7db4984c320da27",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da28"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-25T21:01:00.103Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da25")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da24")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Cys"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da2c"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-25T21:01:00.103Z"),
	"role" : "observations",
	"name" : "MTX1 p.Thr63Ser",
	"identity" : "53f37718d7db4984c320da2a",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da2b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-25T21:01:00.103Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da25")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da24")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr63Ser"
			},
			{
				"key" : "geneName",
				"value" : "MTX1"
			},
			{
				"key" : "label",
				"value" : "MTX1 p.Thr63Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000173171"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000368376"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da2d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-25T21:01:00.103Z"),
	"role" : "samples",
	"identity" : "TST010BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da2e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-25T21:01:00.103Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST010BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da24")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da31"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-25T21:01:00.103Z"),
	"role" : "observations",
	"name" : "MTX1 p.Thr63Ser",
	"identity" : "53f37718d7db4984c320da2f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da30"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-25T21:01:00.103Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da2d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da24")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr63Ser"
			},
			{
				"key" : "geneName",
				"value" : "MTX1"
			},
			{
				"key" : "label",
				"value" : "MTX1 p.Thr63Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000173171"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000368376"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da37"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-23T13:43:29.741Z"),
	"role" : "participants",
	"identity" : "TST-011",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320da32"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-23T13:43:29.741Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-011"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da33"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-23T13:43:29.741Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-23T13:43:29.741"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da34"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-24T17:12:38.894Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-24T17:12:38.894"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da35"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-24T21:03:03.680Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-24T21:03:03.680"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da36"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-08-26T18:41:22.256Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-26T18:41:22.256"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da38"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-26T21:39:21.100Z"),
	"role" : "samples",
	"identity" : "TST011BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da39"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-26T21:39:21.100Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST011BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da37")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da3c"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-26T21:39:21.100Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37718d7db4984c320da3a",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da3b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-26T21:39:21.100Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da38")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da37")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser43Gly"
			},
			{
				"key" : "geneName",
				"value" : "EEF1B2"
			},
			{
				"key" : "label",
				"value" : "EEF1B2 p.Ser43Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000114942"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000392222"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da3d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-26T21:39:21.100Z"),
	"role" : "samples",
	"identity" : "TST011BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da3e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-08-26T21:39:21.100Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST011BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da37")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da41"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-26T21:39:21.100Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37718d7db4984c320da3f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da40"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-08-26T21:39:21.100Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da3d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da37")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser43Gly"
			},
			{
				"key" : "geneName",
				"value" : "EEF1B2"
			},
			{
				"key" : "label",
				"value" : "EEF1B2 p.Ser43Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000114942"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000392222"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da47"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-29T21:22:38.138Z"),
	"role" : "participants",
	"identity" : "TST-012",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320da42"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-29T21:22:38.138Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-012"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da43"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-29T21:22:38.138Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-29T21:22:38.138"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da44"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-08-31T15:01:14.588Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-31T15:01:14.588"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da45"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-08-31T18:29:00.608Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-31T18:29:00.608"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da46"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-01T21:34:29.351Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-01T21:34:29.351"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da48"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "samples",
	"identity" : "TST012BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da49"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST012BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da4c"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f37718d7db4984c320da4a",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da4b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da48")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly118Asp"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Gly118Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da4f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320da4d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da4e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da48")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da52"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37718d7db4984c320da50",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da51"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da48")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg155Gln"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg155Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da55"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f37718d7db4984c320da53",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da54"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da48")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly363Ser"
			},
			{
				"key" : "geneName",
				"value" : "LATS2"
			},
			{
				"key" : "label",
				"value" : "LATS2 p.Gly363Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000150457"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382592"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da58"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f37718d7db4984c320da56",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da57"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da48")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser37Phe"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser37Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da59"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "samples",
	"identity" : "TST012BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da5a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST012BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da5d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f37718d7db4984c320da5b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da5c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly118Asp"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Gly118Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da60"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320da5e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da5f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da63"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37718d7db4984c320da61",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da62"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg155Gln"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg155Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da66"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f37718d7db4984c320da64",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da65"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly363Ser"
			},
			{
				"key" : "geneName",
				"value" : "LATS2"
			},
			{
				"key" : "label",
				"value" : "LATS2 p.Gly363Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000150457"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382592"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da69"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-01T21:58:29.554Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f37718d7db4984c320da67",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da68"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-01T21:58:29.554Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da47")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser37Phe"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser37Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da6f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-08-31T20:12:39.099Z"),
	"role" : "participants",
	"identity" : "TST-013",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320da6a"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-08-31T20:12:39.099Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-013"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da6b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-08-31T20:12:39.099Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-31T20:12:39.099"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da6c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-02T18:07:32.192Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-02T18:07:32.192"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da6d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-02T21:54:25.070Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-02T21:54:25.070"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da6e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-04T21:05:49.838Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-04T21:05:49.838"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da70"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-05T15:31:41.784Z"),
	"role" : "samples",
	"identity" : "TST013BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da71"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-05T15:31:41.784Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST013BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da6f")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da74"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-05T15:31:41.784Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu138Gly",
	"identity" : "53f37718d7db4984c320da72",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da73"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-05T15:31:41.784Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da70")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da6f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu138Gly"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu138Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da77"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-05T15:31:41.784Z"),
	"role" : "observations",
	"name" : "FRG1B p.Leu87Ser",
	"identity" : "53f37718d7db4984c320da75",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da76"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-05T15:31:41.784Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da70")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da6f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu87Ser"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Leu87Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da7a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-05T15:31:41.784Z"),
	"role" : "observations",
	"name" : "UBBP4 p.Arg73Leu",
	"identity" : "53f37718d7db4984c320da78",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da79"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-05T15:31:41.784Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da70")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da6f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg73Leu"
			},
			{
				"key" : "geneName",
				"value" : "UBBP4"
			},
			{
				"key" : "label",
				"value" : "UBBP4 p.Arg73Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000263563"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000578713"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da7b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-05T15:31:41.784Z"),
	"role" : "samples",
	"identity" : "TST013BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da7c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-05T15:31:41.784Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST013BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da6f")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da7f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-05T15:31:41.784Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu138Gly",
	"identity" : "53f37718d7db4984c320da7d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da7e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-05T15:31:41.784Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da6f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu138Gly"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu138Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da82"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-05T15:31:41.784Z"),
	"role" : "observations",
	"name" : "FRG1B p.Leu87Ser",
	"identity" : "53f37718d7db4984c320da80",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da81"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-05T15:31:41.784Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da6f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu87Ser"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Leu87Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da88"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-05T14:47:56.078Z"),
	"role" : "participants",
	"identity" : "TST-014",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320da83"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-09-05T14:47:56.078Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-014"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da84"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-09-05T14:47:56.078Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-05T14:47:56.078"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da85"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-06T20:24:00.859Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-06T20:24:00.859"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da86"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-06T21:04:00.776Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-06T21:04:00.776"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320da87"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-07T21:32:06.571Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-07T21:32:06.571"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da89"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "samples",
	"identity" : "TST014BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da8a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST014BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da8d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "observations",
	"name" : "GLTPD2 p.Asp209Glu",
	"identity" : "53f37718d7db4984c320da8b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da8c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da89")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asp209Glu"
			},
			{
				"key" : "geneName",
				"value" : "GLTPD2"
			},
			{
				"key" : "label",
				"value" : "GLTPD2 p.Asp209Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000182327"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000331264"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da90"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f37718d7db4984c320da8e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da8f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da89")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His179Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His179Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da93"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37718d7db4984c320da91",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da92"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da89")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu542Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu542Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da96"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320da94",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da95"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da89")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da97"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "samples",
	"identity" : "TST014BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da98"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST014BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da9b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "observations",
	"name" : "GLTPD2 p.Asp209Glu",
	"identity" : "53f37718d7db4984c320da99",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da9a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asp209Glu"
			},
			{
				"key" : "geneName",
				"value" : "GLTPD2"
			},
			{
				"key" : "label",
				"value" : "GLTPD2 p.Asp209Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000182327"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000331264"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320da9e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f37718d7db4984c320da9c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320da9d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His179Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His179Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daa1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37718d7db4984c320da9f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320daa0"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu542Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu542Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daa4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-08T13:44:55.614Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320daa2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320daa3"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-08T13:44:55.614Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320da88")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daaa"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-11T14:36:02.879Z"),
	"role" : "participants",
	"identity" : "TST-015",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320daa5"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-09-11T14:36:02.879Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-015"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320daa6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-09-11T14:36:02.879Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-11T14:36:02.879"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320daa7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-13T17:41:56.639Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-13T17:41:56.639"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320daa8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-13T21:22:28.323Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-13T21:22:28.323"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320daa9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-15T18:29:51.587Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-15T18:29:51.587"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daab"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-15T21:32:32.056Z"),
	"role" : "samples",
	"identity" : "TST015BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320daac"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-15T21:32:32.056Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST015BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daaa")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daaf"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-15T21:32:32.056Z"),
	"role" : "observations",
	"name" : "KLHL30 p.Ala195Val",
	"identity" : "53f37718d7db4984c320daad",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320daae"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-15T21:32:32.056Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daab")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daaa")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala195Val"
			},
			{
				"key" : "geneName",
				"value" : "KLHL30"
			},
			{
				"key" : "label",
				"value" : "KLHL30 p.Ala195Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168427"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000409223"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dab0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-15T21:32:32.056Z"),
	"role" : "samples",
	"identity" : "TST015BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dab1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-15T21:32:32.056Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST015BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daaa")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dab4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-15T21:32:32.056Z"),
	"role" : "observations",
	"name" : "KLHL30 p.Ala195Val",
	"identity" : "53f37718d7db4984c320dab2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dab3"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-15T21:32:32.056Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dab0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daaa")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala195Val"
			},
			{
				"key" : "geneName",
				"value" : "KLHL30"
			},
			{
				"key" : "label",
				"value" : "KLHL30 p.Ala195Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168427"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000409223"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daba"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-12T17:34:53.658Z"),
	"role" : "participants",
	"identity" : "TST-016",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dab5"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-09-12T17:34:53.658Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-016"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dab6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-09-12T17:34:53.658Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-12T17:34:53.658"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dab7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-13T14:14:13.439Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-13T14:14:13.439"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dab8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-13T19:18:40.964Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-13T19:18:40.964"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dab9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-15T14:43:08.073Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-15T14:43:08.073"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dabb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-15T20:08:58.851Z"),
	"role" : "samples",
	"identity" : "TST016BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dabc"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-15T20:08:58.851Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST016BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daba")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dabf"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-15T20:08:58.851Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37718d7db4984c320dabd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dabe"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-15T20:08:58.851Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dabb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daba")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala77Gly"
			},
			{
				"key" : "geneName",
				"value" : "TMPRSS13"
			},
			{
				"key" : "label",
				"value" : "TMPRSS13 p.Ala77Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000137747"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000524993"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dac0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-15T20:08:58.851Z"),
	"role" : "samples",
	"identity" : "TST016BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dac1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-15T20:08:58.851Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST016BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daba")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dac4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-15T20:08:58.851Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37718d7db4984c320dac2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dac3"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-15T20:08:58.851Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dac0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daba")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala77Gly"
			},
			{
				"key" : "geneName",
				"value" : "TMPRSS13"
			},
			{
				"key" : "label",
				"value" : "TMPRSS13 p.Ala77Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000137747"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000524993"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daca"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-14T20:36:24.350Z"),
	"role" : "participants",
	"identity" : "TST-017",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dac5"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-09-14T20:36:24.350Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-017"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dac6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-09-14T20:36:24.350Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-14T20:36:24.350"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dac7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-17T18:11:05.559Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-17T18:11:05.559"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dac8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-17T21:31:46.848Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-17T21:31:46.848"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dac9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-18T17:42:32.418Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-18T17:42:32.418"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dacb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-18T18:36:40.381Z"),
	"role" : "samples",
	"identity" : "TST017BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dacc"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-18T18:36:40.381Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST017BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daca")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dacf"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-18T18:36:40.381Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ile45Thr",
	"identity" : "53f37718d7db4984c320dacd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dace"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-18T18:36:40.381Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dacb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daca")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile45Thr"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Ile45Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dad0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-18T18:36:40.381Z"),
	"role" : "samples",
	"identity" : "TST017BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dad1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-18T18:36:40.381Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST017BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daca")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dad4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-18T18:36:40.381Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ile45Thr",
	"identity" : "53f37718d7db4984c320dad2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dad3"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-18T18:36:40.381Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dad0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daca")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile45Thr"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Ile45Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dada"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-16T21:17:36.682Z"),
	"role" : "participants",
	"identity" : "TST-018",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dad5"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-09-16T21:17:36.682Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-018"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dad6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-09-16T21:17:36.682Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-16T21:17:36.682"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dad7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-18T15:33:24.215Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-18T15:33:24.215"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dad8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-18T15:49:04.143Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-18T15:49:04.143"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dad9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-21T16:47:02.264Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-21T16:47:02.264"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dadb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "samples",
	"identity" : "TST018BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dadc"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST018BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dadf"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "observations",
	"name" : "OTUD4 p.Thr974Ile",
	"identity" : "53f37718d7db4984c320dadd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dade"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dadb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr974Ile"
			},
			{
				"key" : "geneName",
				"value" : "OTUD4"
			},
			{
				"key" : "label",
				"value" : "OTUD4 p.Thr974Ile"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000164164"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000454497"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dae2"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37718d7db4984c320dae0",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dae1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dadb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu645Lys"
			},
			{
				"key" : "geneName",
				"value" : "NEFH"
			},
			{
				"key" : "label",
				"value" : "NEFH p.Glu645Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100285"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000310624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dae5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "observations",
	"name" : "DOT1L p.Gly266Ser",
	"identity" : "53f37718d7db4984c320dae3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dae4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dadb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly266Ser"
			},
			{
				"key" : "geneName",
				"value" : "DOT1L"
			},
			{
				"key" : "label",
				"value" : "DOT1L p.Gly266Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000104885"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000398665"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dae6"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "samples",
	"identity" : "TST018BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dae7"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST018BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daea"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "observations",
	"name" : "PCDHA7 p.Leu352Ile",
	"identity" : "53f37718d7db4984c320dae8",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dae9"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dae6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu352Ile"
			},
			{
				"key" : "geneName",
				"value" : "PCDHA7"
			},
			{
				"key" : "label",
				"value" : "PCDHA7 p.Leu352Ile"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204963"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000525929"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daed"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "observations",
	"name" : "OTUD4 p.Thr974Ile",
	"identity" : "53f37718d7db4984c320daeb",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320daec"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dae6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr974Ile"
			},
			{
				"key" : "geneName",
				"value" : "OTUD4"
			},
			{
				"key" : "label",
				"value" : "OTUD4 p.Thr974Ile"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000164164"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000454497"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daf0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37718d7db4984c320daee",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320daef"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dae6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu645Lys"
			},
			{
				"key" : "geneName",
				"value" : "NEFH"
			},
			{
				"key" : "label",
				"value" : "NEFH p.Glu645Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100285"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000310624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daf3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-21T21:14:25.089Z"),
	"role" : "observations",
	"name" : "DOT1L p.Gly266Ser",
	"identity" : "53f37718d7db4984c320daf1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320daf2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-21T21:14:25.089Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dae6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dada")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly266Ser"
			},
			{
				"key" : "geneName",
				"value" : "DOT1L"
			},
			{
				"key" : "label",
				"value" : "DOT1L p.Gly266Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000104885"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000398665"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320daf9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-19T13:01:31.341Z"),
	"role" : "participants",
	"identity" : "TST-019",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320daf4"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-09-19T13:01:31.341Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-019"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320daf5"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-09-19T13:01:31.341Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-19T13:01:31.341"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320daf6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-21T16:10:14.841Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-21T16:10:14.841"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320daf7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-21T17:56:15.037Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-21T17:56:15.037"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320daf8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-25T17:49:08.643Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-25T17:49:08.643"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dafa"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T18:05:13.281Z"),
	"role" : "samples",
	"identity" : "TST019BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dafb"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-25T18:05:13.281Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST019BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daf9")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dafe"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T18:05:13.281Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37718d7db4984c320dafc",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dafd"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-25T18:05:13.281Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dafa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daf9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val600Glu"
			},
			{
				"key" : "geneName",
				"value" : "BRAF"
			},
			{
				"key" : "label",
				"value" : "BRAF p.Val600Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000157764"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000288602"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db01"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T18:05:13.281Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37718d7db4984c320daff",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db00"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-25T18:05:13.281Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dafa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daf9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala77Gly"
			},
			{
				"key" : "geneName",
				"value" : "TMPRSS13"
			},
			{
				"key" : "label",
				"value" : "TMPRSS13 p.Ala77Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000137747"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000524993"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db02"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T18:05:13.281Z"),
	"role" : "samples",
	"identity" : "TST019BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db03"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-25T18:05:13.281Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST019BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daf9")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db06"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T18:05:13.281Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37718d7db4984c320db04",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db05"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-25T18:05:13.281Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db02")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daf9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val600Glu"
			},
			{
				"key" : "geneName",
				"value" : "BRAF"
			},
			{
				"key" : "label",
				"value" : "BRAF p.Val600Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000157764"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000288602"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db09"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T18:05:13.281Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37718d7db4984c320db07",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db08"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-25T18:05:13.281Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db02")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320daf9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala77Gly"
			},
			{
				"key" : "geneName",
				"value" : "TMPRSS13"
			},
			{
				"key" : "label",
				"value" : "TMPRSS13 p.Ala77Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000137747"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000524993"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db0f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-22T17:48:08.978Z"),
	"role" : "participants",
	"identity" : "TST-020",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320db0a"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-09-22T17:48:08.978Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-020"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db0b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-09-22T17:48:08.978Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-22T17:48:08.978"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db0c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-24T19:45:55.295Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-24T19:45:55.295"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db0d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-24T19:58:20.887Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-24T19:58:20.887"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db0e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-24T21:58:48.496Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-24T21:58:48.496"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db10"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T15:58:58.920Z"),
	"role" : "samples",
	"identity" : "TST020BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db11"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-25T15:58:58.920Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST020BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db0f")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db14"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T15:58:58.920Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser33Cys",
	"identity" : "53f37718d7db4984c320db12",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db13"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-25T15:58:58.920Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db10")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db0f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser33Cys"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser33Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db15"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T15:58:58.920Z"),
	"role" : "samples",
	"identity" : "TST020BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db16"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-25T15:58:58.920Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST020BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db0f")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db19"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-25T15:58:58.920Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser33Cys",
	"identity" : "53f37718d7db4984c320db17",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db18"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-25T15:58:58.920Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db15")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db0f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser33Cys"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser33Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db1f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-26T20:21:43.837Z"),
	"role" : "participants",
	"identity" : "TST-021",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320db1a"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-09-26T20:21:43.837Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-021"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db1b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-09-26T20:21:43.837Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-26T20:21:43.837"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db1c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-09-28T14:40:21.313Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-28T14:40:21.313"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db1d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-09-28T21:32:52.622Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-28T21:32:52.622"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db1e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-09-30T21:10:21.633Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-30T21:10:21.633"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db20"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "samples",
	"identity" : "TST021BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db21"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST021BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db24"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gln",
	"identity" : "53f37718d7db4984c320db22",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db23"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db20")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gln"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db27"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu138Gly",
	"identity" : "53f37718d7db4984c320db25",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db26"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db20")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu138Gly"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu138Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db2a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f37718d7db4984c320db28",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db29"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db20")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val474Ala"
			},
			{
				"key" : "geneName",
				"value" : "ARHGAP5"
			},
			{
				"key" : "label",
				"value" : "ARHGAP5 p.Val474Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100852"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000345122"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db2d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37718d7db4984c320db2b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db2c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db20")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asp404Glu"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Asp404Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db2e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "samples",
	"identity" : "TST021BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db2f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST021BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db32"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gln",
	"identity" : "53f37718d7db4984c320db30",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db31"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gln"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db35"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu138Gly",
	"identity" : "53f37718d7db4984c320db33",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db34"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu138Gly"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu138Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db38"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-09-30T21:55:19.746Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37718d7db4984c320db36",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db37"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-09-30T21:55:19.746Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db1f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asp404Glu"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Asp404Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db3e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-02T16:25:01.171Z"),
	"role" : "participants",
	"identity" : "TST-022",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320db39"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-10-02T16:25:01.171Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-022"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db3a"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-10-02T16:25:01.171Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-02T16:25:01.171"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db3b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-10-03T20:02:01.166Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-03T20:02:01.166"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db3c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-10-03T20:10:53.569Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-03T20:10:53.569"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db3d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-10-05T20:49:32.055Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-05T20:49:32.055"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db3f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-05T21:57:04.216Z"),
	"role" : "samples",
	"identity" : "TST022BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db40"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-05T21:57:04.216Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST022BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3e")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db43"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-05T21:57:04.216Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37718d7db4984c320db41",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db42"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-05T21:57:04.216Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3e")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Cys83Phe"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Cys83Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db46"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-05T21:57:04.216Z"),
	"role" : "observations",
	"name" : "ADAD2 p.Gly44Glu",
	"identity" : "53f37718d7db4984c320db44",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db45"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-05T21:57:04.216Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3e")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly44Glu"
			},
			{
				"key" : "geneName",
				"value" : "ADAD2"
			},
			{
				"key" : "label",
				"value" : "ADAD2 p.Gly44Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000140955"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000268624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db49"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-05T21:57:04.216Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f37718d7db4984c320db47",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db48"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-05T21:57:04.216Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3e")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val35Phe"
			},
			{
				"key" : "geneName",
				"value" : "PTPLA"
			},
			{
				"key" : "label",
				"value" : "PTPLA p.Val35Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165996"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000361271"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db4a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-05T21:57:04.216Z"),
	"role" : "samples",
	"identity" : "TST022BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db4b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-05T21:57:04.216Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST022BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3e")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db4e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-05T21:57:04.216Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37718d7db4984c320db4c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db4d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-05T21:57:04.216Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db4a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3e")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Cys83Phe"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Cys83Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db51"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-05T21:57:04.216Z"),
	"role" : "observations",
	"name" : "ADAD2 p.Gly44Glu",
	"identity" : "53f37718d7db4984c320db4f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db50"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-05T21:57:04.216Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db4a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3e")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly44Glu"
			},
			{
				"key" : "geneName",
				"value" : "ADAD2"
			},
			{
				"key" : "label",
				"value" : "ADAD2 p.Gly44Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000140955"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000268624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db54"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-05T21:57:04.216Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f37718d7db4984c320db52",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db53"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-05T21:57:04.216Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db4a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db3e")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val35Phe"
			},
			{
				"key" : "geneName",
				"value" : "PTPLA"
			},
			{
				"key" : "label",
				"value" : "PTPLA p.Val35Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165996"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000361271"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db5a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-07T19:00:45.428Z"),
	"role" : "participants",
	"identity" : "TST-023",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320db55"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-10-07T19:00:45.428Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-023"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db56"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-10-07T19:00:45.428Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-07T19:00:45.428"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db57"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-10-09T14:40:36.966Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-09T14:40:36.966"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db58"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-10-09T17:29:36.360Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-09T17:29:36.360"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db59"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-10-11T21:52:56.914Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-11T21:52:56.914"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db5b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-12T15:23:06.402Z"),
	"role" : "samples",
	"identity" : "TST023BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db5c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-12T15:23:06.402Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST023BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db5a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db5f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-12T15:23:06.402Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37718d7db4984c320db5d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db5e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-12T15:23:06.402Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db5b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db5a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg175Gln"
			},
			{
				"key" : "geneName",
				"value" : "IRF5"
			},
			{
				"key" : "label",
				"value" : "IRF5 p.Arg175Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000128604"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000357234"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db60"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-12T15:23:06.402Z"),
	"role" : "samples",
	"identity" : "TST023BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db61"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-12T15:23:06.402Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST023BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db5a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db64"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-12T15:23:06.402Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37718d7db4984c320db62",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db63"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-12T15:23:06.402Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db60")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db5a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg175Gln"
			},
			{
				"key" : "geneName",
				"value" : "IRF5"
			},
			{
				"key" : "label",
				"value" : "IRF5 p.Arg175Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000128604"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000357234"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db6a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-11T21:54:38.005Z"),
	"role" : "participants",
	"identity" : "TST-024",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320db65"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-10-11T21:54:38.005Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-024"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db66"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-10-11T21:54:38.005Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-11T21:54:38.005"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db67"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-10-14T19:09:46.537Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-14T19:09:46.537"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db68"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-10-14T21:51:15.986Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-14T21:51:15.986"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db69"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-10-18T17:39:23.405Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-18T17:39:23.405"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db6b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-18T17:43:08.064Z"),
	"role" : "samples",
	"identity" : "TST024BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db6c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-18T17:43:08.064Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST024BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db6a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db6f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-18T17:43:08.064Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37718d7db4984c320db6d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db6e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-18T17:43:08.064Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db6b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db6a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu545Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu545Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db70"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-18T17:43:08.064Z"),
	"role" : "samples",
	"identity" : "TST024BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db71"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-18T17:43:08.064Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST024BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db6a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db74"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-18T17:43:08.064Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37718d7db4984c320db72",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db73"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-18T17:43:08.064Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db70")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db6a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu545Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu545Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db7a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-16T16:50:58.264Z"),
	"role" : "participants",
	"identity" : "TST-025",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320db75"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-10-16T16:50:58.264Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-025"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db76"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-10-16T16:50:58.264Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-16T16:50:58.264"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db77"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-10-18T15:10:45.677Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-18T15:10:45.677"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db78"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-10-18T20:25:22.741Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-18T20:25:22.741"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db79"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-10-20T15:12:03.539Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-20T15:12:03.539"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db7b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-20T19:23:33.331Z"),
	"role" : "samples",
	"identity" : "TST025BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db7c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-20T19:23:33.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST025BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db7a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db7f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-20T19:23:33.331Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37718d7db4984c320db7d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db7e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-20T19:23:33.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db7a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Cys27Phe"
			},
			{
				"key" : "geneName",
				"value" : "OPRD1"
			},
			{
				"key" : "label",
				"value" : "OPRD1 p.Cys27Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000116329"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000234961"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db82"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-20T19:23:33.331Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320db80",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db81"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-20T19:23:33.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db7a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db83"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-20T19:23:33.331Z"),
	"role" : "samples",
	"identity" : "TST025BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db84"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-20T19:23:33.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST025BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db7a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db87"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-20T19:23:33.331Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37718d7db4984c320db85",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db86"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-20T19:23:33.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db83")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db7a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Cys27Phe"
			},
			{
				"key" : "geneName",
				"value" : "OPRD1"
			},
			{
				"key" : "label",
				"value" : "OPRD1 p.Cys27Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000116329"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000234961"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db91"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "samples",
	"identity" : "TST026BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db92"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST026BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db8a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-20T19:23:33.331Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320db88",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db89"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-20T19:23:33.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db83")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db7a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db90"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-20T19:18:42.706Z"),
	"role" : "participants",
	"identity" : "TST-026",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320db8b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-10-20T19:18:42.706Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-026"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db8c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-10-20T19:18:42.706Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-20T19:18:42.706"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db8d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-10-22T18:40:25.609Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-22T18:40:25.609"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db8e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-10-22T20:39:00.901Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-22T20:39:00.901"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320db8f"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-10-25T16:22:53.946Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-25T16:22:53.946"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db95"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "observations",
	"name" : "FEZ2 p.Pro50Leu",
	"identity" : "53f37718d7db4984c320db93",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db94"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db91")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro50Leu"
			},
			{
				"key" : "geneName",
				"value" : "FEZ2"
			},
			{
				"key" : "label",
				"value" : "FEZ2 p.Pro50Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171055"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000379245"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db98"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f37718d7db4984c320db96",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db97"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db91")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg273Cys"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg273Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db9b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37718d7db4984c320db99",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db9a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db91")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu3455Lys"
			},
			{
				"key" : "geneName",
				"value" : "NBPF10"
			},
			{
				"key" : "label",
				"value" : "NBPF10 p.Glu3455Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000163386"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000342960"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db9e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37718d7db4984c320db9c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320db9d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db91")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu3455Lys"
			},
			{
				"key" : "geneName",
				"value" : "NBPF10"
			},
			{
				"key" : "label",
				"value" : "NBPF10 p.Glu3455Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000163386"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000342960"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320db9f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "samples",
	"identity" : "TST026BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dba0"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST026BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dba3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "observations",
	"name" : "FEZ2 p.Pro50Leu",
	"identity" : "53f37718d7db4984c320dba1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dba2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db9f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro50Leu"
			},
			{
				"key" : "geneName",
				"value" : "FEZ2"
			},
			{
				"key" : "label",
				"value" : "FEZ2 p.Pro50Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171055"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000379245"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dba6"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f37718d7db4984c320dba4",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dba5"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db9f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg273Cys"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg273Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dba9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37718d7db4984c320dba7",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dba8"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db9f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu3455Lys"
			},
			{
				"key" : "geneName",
				"value" : "NBPF10"
			},
			{
				"key" : "label",
				"value" : "NBPF10 p.Glu3455Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000163386"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000342960"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbac"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T21:08:50.786Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37718d7db4984c320dbaa",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbab"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-25T21:08:50.786Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db9f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320db90")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu3455Lys"
			},
			{
				"key" : "geneName",
				"value" : "NBPF10"
			},
			{
				"key" : "label",
				"value" : "NBPF10 p.Glu3455Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000163386"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000342960"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbb2"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-25T20:40:58.401Z"),
	"role" : "participants",
	"identity" : "TST-027",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dbad"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-10-25T20:40:58.401Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-027"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dbae"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-10-25T20:40:58.401Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-25T20:40:58.401"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dbaf"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-10-27T18:42:52.692Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-27T18:42:52.692"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dbb0"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-10-27T19:22:21.045Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-27T19:22:21.045"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dbb1"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-10-30T19:12:27.077Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-30T19:12:27.077"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbb3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "samples",
	"identity" : "TST027BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbb4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST027BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbb7"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37718d7db4984c320dbb5",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbb6"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile102Thr"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Ile102Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbba"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37718d7db4984c320dbb8",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbb9"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile102Thr"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Ile102Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbbd"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37718d7db4984c320dbbb",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbbc"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Ala"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbc0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "observations",
	"name" : "ADAD2 p.Gly44Glu",
	"identity" : "53f37718d7db4984c320dbbe",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbbf"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly44Glu"
			},
			{
				"key" : "geneName",
				"value" : "ADAD2"
			},
			{
				"key" : "label",
				"value" : "ADAD2 p.Gly44Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000140955"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000268624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbc1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "samples",
	"identity" : "TST027BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbc2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST027BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbc5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37718d7db4984c320dbc3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbc4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbc1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile102Thr"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Ile102Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbc8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37718d7db4984c320dbc6",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbc7"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbc1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile102Thr"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Ile102Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbcb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37718d7db4984c320dbc9",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbca"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbc1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Ala"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbce"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-30T21:47:02.351Z"),
	"role" : "observations",
	"name" : "ADAD2 p.Gly44Glu",
	"identity" : "53f37718d7db4984c320dbcc",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbcd"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-10-30T21:47:02.351Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbc1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbb2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly44Glu"
			},
			{
				"key" : "geneName",
				"value" : "ADAD2"
			},
			{
				"key" : "label",
				"value" : "ADAD2 p.Gly44Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000140955"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000268624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbd4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-10-31T16:22:36.811Z"),
	"role" : "participants",
	"identity" : "TST-028",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dbcf"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-10-31T16:22:36.811Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-028"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dbd0"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-10-31T16:22:36.811Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-31T16:22:36.811"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dbd1"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-11-01T20:25:19.769Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-01T20:25:19.769"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dbd2"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-11-01T21:33:38.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-01T21:33:38.640"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dbd3"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-11-04T16:52:59.905Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-04T16:52:59.905"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbd5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "samples",
	"identity" : "TST028BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbd6"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST028BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbd9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f37718d7db4984c320dbd7",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbd8"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg155Trp"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg155Trp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbdc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f37718d7db4984c320dbda",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbdb"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg155Trp"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg155Trp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbdf"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37718d7db4984c320dbdd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbde"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala77Gly"
			},
			{
				"key" : "geneName",
				"value" : "TMPRSS13"
			},
			{
				"key" : "label",
				"value" : "TMPRSS13 p.Ala77Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000137747"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000524993"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbe2"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f37718d7db4984c320dbe0",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbe1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr139His"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Tyr139His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbe5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37718d7db4984c320dbe3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbe4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile102Thr"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Ile102Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbe8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f37718d7db4984c320dbe6",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbe7"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly13Asp"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly13Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbeb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320dbe9",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbea"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbec"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "samples",
	"identity" : "TST028BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbed"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST028BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbf0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f37718d7db4984c320dbee",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbef"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg155Trp"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg155Trp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbf3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f37718d7db4984c320dbf1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbf2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg155Trp"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg155Trp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbf6"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37718d7db4984c320dbf4",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbf5"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala77Gly"
			},
			{
				"key" : "geneName",
				"value" : "TMPRSS13"
			},
			{
				"key" : "label",
				"value" : "TMPRSS13 p.Ala77Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000137747"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000524993"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbf9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f37718d7db4984c320dbf7",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbf8"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr139His"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Tyr139His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbfc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f37718d7db4984c320dbfa",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbfb"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu66His"
			},
			{
				"key" : "geneName",
				"value" : "KCNN3"
			},
			{
				"key" : "label",
				"value" : "KCNN3 p.Leu66His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000143603"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000271915"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dbff"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37718d7db4984c320dbfd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dbfe"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile102Thr"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Ile102Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc02"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f37718d7db4984c320dc00",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc01"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly13Asp"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly13Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc05"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-04T18:35:28.271Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320dc03",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc04"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-04T18:35:28.271Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dbd4")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc0b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-02T17:24:35.857Z"),
	"role" : "participants",
	"identity" : "TST-029",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dc06"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-11-02T17:24:35.857Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-029"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc07"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-11-02T17:24:35.857Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-02T17:24:35.857"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc08"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-11-04T14:00:17.451Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-04T14:00:17.451"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc09"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-11-04T17:59:01.590Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-04T17:59:01.590"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc0a"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-11-06T21:49:51.953Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-06T21:49:51.953"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc0c"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "samples",
	"identity" : "TST029BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc0d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST029BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc10"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gly",
	"identity" : "53f37718d7db4984c320dc0e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc0f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0c")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gly"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc13"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37718d7db4984c320dc11",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc12"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0c")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu3455Lys"
			},
			{
				"key" : "geneName",
				"value" : "NBPF10"
			},
			{
				"key" : "label",
				"value" : "NBPF10 p.Glu3455Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000163386"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000342960"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc16"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37718d7db4984c320dc14",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc15"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0c")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg347Cys"
			},
			{
				"key" : "geneName",
				"value" : "FBXW7"
			},
			{
				"key" : "label",
				"value" : "FBXW7 p.Arg347Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000109670"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000281708"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc19"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu726Lys",
	"identity" : "53f37718d7db4984c320dc17",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc18"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0c")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu726Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu726Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc1a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "samples",
	"identity" : "TST029BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc1b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST029BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc1e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gly",
	"identity" : "53f37718d7db4984c320dc1c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc1d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc1a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gly"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc21"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37718d7db4984c320dc1f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc20"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc1a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu3455Lys"
			},
			{
				"key" : "geneName",
				"value" : "NBPF10"
			},
			{
				"key" : "label",
				"value" : "NBPF10 p.Glu3455Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000163386"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000342960"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc24"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37718d7db4984c320dc22",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc23"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc1a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg347Cys"
			},
			{
				"key" : "geneName",
				"value" : "FBXW7"
			},
			{
				"key" : "label",
				"value" : "FBXW7 p.Arg347Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000109670"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000281708"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc27"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T22:24:02.471Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu726Lys",
	"identity" : "53f37718d7db4984c320dc25",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc26"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-06T22:24:02.471Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc1a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc0b")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu726Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu726Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc2d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-06T16:22:02.113Z"),
	"role" : "participants",
	"identity" : "TST-030",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dc28"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-11-06T16:22:02.113Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-030"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc29"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-11-06T16:22:02.113Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-06T16:22:02.113"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc2a"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-11-09T18:02:55.947Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-09T18:02:55.947"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc2b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-11-09T20:03:11.804Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-09T20:03:11.804"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc2c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-11-11T19:57:58.276Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-11T19:57:58.276"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc2e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "samples",
	"identity" : "TST030BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc2f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST030BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc32"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Arg",
	"identity" : "53f37718d7db4984c320dc30",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc31"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Arg"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc35"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Arg",
	"identity" : "53f37718d7db4984c320dc33",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc34"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Arg"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc38"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gln",
	"identity" : "53f37718d7db4984c320dc36",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc37"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gln"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc39"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "samples",
	"identity" : "TST030BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc3a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST030BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc3d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f37718d7db4984c320dc3b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc3c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser37Cys"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser37Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc40"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37718d7db4984c320dc3e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc3f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu645Lys"
			},
			{
				"key" : "geneName",
				"value" : "NEFH"
			},
			{
				"key" : "label",
				"value" : "NEFH p.Glu645Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100285"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000310624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc43"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Arg",
	"identity" : "53f37718d7db4984c320dc41",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc42"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Arg"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc46"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Arg",
	"identity" : "53f37718d7db4984c320dc44",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc45"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Arg"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc49"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T21:59:17.036Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gln",
	"identity" : "53f37718d7db4984c320dc47",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc48"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-11T21:59:17.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc2d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gln"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc4f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-11T22:08:44.998Z"),
	"role" : "participants",
	"identity" : "TST-031",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dc4a"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-11-11T22:08:44.998Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-031"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc4b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-11-11T22:08:44.998Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-11T22:08:44.998"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc4c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-11-13T22:02:22.216Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-13T22:02:22.216"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc4d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-11-13T22:18:54.642Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-13T22:18:54.642"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc4e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-11-15T16:48:52.197Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-15T16:48:52.197"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc50"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "samples",
	"identity" : "TST031BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc51"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST031BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc54"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37718d7db4984c320dc52",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc53"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc50")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asp404Glu"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Asp404Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc57"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ile45Thr",
	"identity" : "53f37718d7db4984c320dc55",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc56"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc50")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile45Thr"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Ile45Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc5a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37718d7db4984c320dc58",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc59"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc50")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala242Thr"
			},
			{
				"key" : "geneName",
				"value" : "ZNF837"
			},
			{
				"key" : "label",
				"value" : "ZNF837 p.Ala242Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000152475"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000427624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc5d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Asp",
	"identity" : "53f37718d7db4984c320dc5b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc5c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc50")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Asp"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc60"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f37718d7db4984c320dc5e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc5f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc50")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val35Phe"
			},
			{
				"key" : "geneName",
				"value" : "PTPLA"
			},
			{
				"key" : "label",
				"value" : "PTPLA p.Val35Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165996"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000361271"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc61"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "samples",
	"identity" : "TST031BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc62"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST031BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc65"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37718d7db4984c320dc63",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc64"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc61")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asp404Glu"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Asp404Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc68"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ile45Thr",
	"identity" : "53f37718d7db4984c320dc66",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc67"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc61")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile45Thr"
			},
			{
				"key" : "geneName",
				"value" : "FRG1B"
			},
			{
				"key" : "label",
				"value" : "FRG1B p.Ile45Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000149531"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000278882"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc6b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37718d7db4984c320dc69",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc6a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc61")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala242Thr"
			},
			{
				"key" : "geneName",
				"value" : "ZNF837"
			},
			{
				"key" : "label",
				"value" : "ZNF837 p.Ala242Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000152475"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000427624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc6e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Asp",
	"identity" : "53f37718d7db4984c320dc6c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc6d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc61")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Asp"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc71"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f37718d7db4984c320dc6f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc70"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc61")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Cys"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc74"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T19:52:36.543Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f37718d7db4984c320dc72",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc73"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-15T19:52:36.543Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc61")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc4f")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val35Phe"
			},
			{
				"key" : "geneName",
				"value" : "PTPLA"
			},
			{
				"key" : "label",
				"value" : "PTPLA p.Val35Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165996"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000361271"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc7a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-15T15:34:10.934Z"),
	"role" : "participants",
	"identity" : "TST-032",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dc75"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-11-15T15:34:10.934Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-032"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc76"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-11-15T15:34:10.934Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-15T15:34:10.934"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc77"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-11-18T16:10:40.721Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-18T16:10:40.721"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc78"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-11-18T22:09:13.488Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-18T22:09:13.488"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc79"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-11-20T15:48:04.885Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-20T15:48:04.885"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc7b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T17:56:16.007Z"),
	"role" : "samples",
	"identity" : "TST032BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc7c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-20T17:56:16.007Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST032BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc7a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc7f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T17:56:16.007Z"),
	"role" : "observations",
	"name" : "NRAS p.Gln61Lys",
	"identity" : "53f37718d7db4984c320dc7d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc7e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-20T17:56:16.007Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc7a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Lys"
			},
			{
				"key" : "geneName",
				"value" : "NRAS"
			},
			{
				"key" : "label",
				"value" : "NRAS p.Gln61Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000213281"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000369535"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc80"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T17:56:16.007Z"),
	"role" : "samples",
	"identity" : "TST032BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc81"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-20T17:56:16.007Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST032BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc7a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc84"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T17:56:16.007Z"),
	"role" : "observations",
	"name" : "NRAS p.Gln61Lys",
	"identity" : "53f37718d7db4984c320dc82",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc83"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-20T17:56:16.007Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc80")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc7a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Lys"
			},
			{
				"key" : "geneName",
				"value" : "NRAS"
			},
			{
				"key" : "label",
				"value" : "NRAS p.Gln61Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000213281"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000369535"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc8a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-16T22:44:22.088Z"),
	"role" : "participants",
	"identity" : "TST-033",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dc85"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-11-16T22:44:22.088Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-033"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc86"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-11-16T22:44:22.088Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-16T22:44:22.088"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc87"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-11-17T16:50:51.183Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-17T16:50:51.183"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc88"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-11-17T17:44:09.504Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-17T17:44:09.504"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc89"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-11-19T17:57:18.373Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-19T17:57:18.373"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc8b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T16:22:50.190Z"),
	"role" : "samples",
	"identity" : "TST033BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc8c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-20T16:22:50.190Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST033BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc8a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc8f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T16:22:50.190Z"),
	"role" : "observations",
	"name" : "OTUD4 p.Thr974Ile",
	"identity" : "53f37718d7db4984c320dc8d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc8e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-20T16:22:50.190Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc8b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc8a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr974Ile"
			},
			{
				"key" : "geneName",
				"value" : "OTUD4"
			},
			{
				"key" : "label",
				"value" : "OTUD4 p.Thr974Ile"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000164164"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000454497"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc92"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T16:22:50.190Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu138Gly",
	"identity" : "53f37718d7db4984c320dc90",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc91"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-20T16:22:50.190Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc8b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc8a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu138Gly"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu138Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc93"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T16:22:50.190Z"),
	"role" : "samples",
	"identity" : "TST033BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc94"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-20T16:22:50.190Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST033BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc8a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc97"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T16:22:50.190Z"),
	"role" : "observations",
	"name" : "OTUD4 p.Thr974Ile",
	"identity" : "53f37718d7db4984c320dc95",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc96"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-20T16:22:50.190Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc93")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc8a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr974Ile"
			},
			{
				"key" : "geneName",
				"value" : "OTUD4"
			},
			{
				"key" : "label",
				"value" : "OTUD4 p.Thr974Ile"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000164164"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000454497"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dc9a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-20T16:22:50.190Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu138Gly",
	"identity" : "53f37718d7db4984c320dc98",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dc99"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-20T16:22:50.190Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc93")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dc8a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu138Gly"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Glu138Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dca0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-21T14:46:45.362Z"),
	"role" : "participants",
	"identity" : "TST-034",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dc9b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-11-21T14:46:45.362Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-034"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc9c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-11-21T14:46:45.362Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-21T14:46:45.362"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc9d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-11-24T16:10:36.299Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-24T16:10:36.299"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc9e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-11-24T19:34:12.965Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-24T19:34:12.965"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dc9f"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-11-26T17:39:38.018Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-26T17:39:38.018"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dca1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-26T22:47:03.379Z"),
	"role" : "samples",
	"identity" : "TST034BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dca2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-26T22:47:03.379Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST034BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca0")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dca5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-26T22:47:03.379Z"),
	"role" : "observations",
	"name" : "PCDHA7 p.Leu352Ile",
	"identity" : "53f37718d7db4984c320dca3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dca4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-26T22:47:03.379Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu352Ile"
			},
			{
				"key" : "geneName",
				"value" : "PCDHA7"
			},
			{
				"key" : "label",
				"value" : "PCDHA7 p.Leu352Ile"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204963"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000525929"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dca8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-26T22:47:03.379Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f37718d7db4984c320dca6",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dca7"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-26T22:47:03.379Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu66His"
			},
			{
				"key" : "geneName",
				"value" : "KCNN3"
			},
			{
				"key" : "label",
				"value" : "KCNN3 p.Leu66His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000143603"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000271915"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcab"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-26T22:47:03.379Z"),
	"role" : "observations",
	"name" : "CHEK2 p.Lys344Glu",
	"identity" : "53f37718d7db4984c320dca9",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcaa"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-26T22:47:03.379Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Lys344Glu"
			},
			{
				"key" : "geneName",
				"value" : "CHEK2"
			},
			{
				"key" : "label",
				"value" : "CHEK2 p.Lys344Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000183765"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382580"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcac"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-26T22:47:03.379Z"),
	"role" : "samples",
	"identity" : "TST034BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcad"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-26T22:47:03.379Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST034BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca0")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcb0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-26T22:47:03.379Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f37718d7db4984c320dcae",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcaf"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-26T22:47:03.379Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcac")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu66His"
			},
			{
				"key" : "geneName",
				"value" : "KCNN3"
			},
			{
				"key" : "label",
				"value" : "KCNN3 p.Leu66His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000143603"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000271915"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcb3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-26T22:47:03.379Z"),
	"role" : "observations",
	"name" : "CHEK2 p.Lys344Glu",
	"identity" : "53f37718d7db4984c320dcb1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcb2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-26T22:47:03.379Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcac")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dca0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Lys344Glu"
			},
			{
				"key" : "geneName",
				"value" : "CHEK2"
			},
			{
				"key" : "label",
				"value" : "CHEK2 p.Lys344Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000183765"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382580"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcb9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-23T19:47:30.418Z"),
	"role" : "participants",
	"identity" : "TST-035",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dcb4"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-11-23T19:47:30.418Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-035"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dcb5"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-11-23T19:47:30.418Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-23T19:47:30.418"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dcb6"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-11-26T14:52:35.514Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-26T14:52:35.514"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dcb7"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-11-26T17:08:10.381Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-26T17:08:10.381"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dcb8"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-11-28T15:57:05.176Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-28T15:57:05.176"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcba"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "samples",
	"identity" : "TST035BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcbb"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST035BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcbe"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "OTUD4 p.Thr974Ile",
	"identity" : "53f37718d7db4984c320dcbc",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcbd"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr974Ile"
			},
			{
				"key" : "geneName",
				"value" : "OTUD4"
			},
			{
				"key" : "label",
				"value" : "OTUD4 p.Thr974Ile"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000164164"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000454497"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcc1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gly",
	"identity" : "53f37718d7db4984c320dcbf",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcc0"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gly"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcc4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37718d7db4984c320dcc2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcc3"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg82Cys"
			},
			{
				"key" : "geneName",
				"value" : "GSG2"
			},
			{
				"key" : "label",
				"value" : "GSG2 p.Arg82Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000177602"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000325418"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcc7"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Gly320Glu",
	"identity" : "53f37718d7db4984c320dcc5",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcc6"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly320Glu"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Gly320Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcca"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f37718d7db4984c320dcc8",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcc9"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr139His"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Tyr139His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dccd"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132His",
	"identity" : "53f37718d7db4984c320dccb",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dccc"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132His"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcd0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37718d7db4984c320dcce",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dccf"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Cys27Phe"
			},
			{
				"key" : "geneName",
				"value" : "OPRD1"
			},
			{
				"key" : "label",
				"value" : "OPRD1 p.Cys27Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000116329"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000234961"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcd3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f37718d7db4984c320dcd1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcd2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val474Ala"
			},
			{
				"key" : "geneName",
				"value" : "ARHGAP5"
			},
			{
				"key" : "label",
				"value" : "ARHGAP5 p.Val474Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100852"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000345122"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcd6"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "SF3B1 p.Lys700Glu",
	"identity" : "53f37718d7db4984c320dcd4",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcd5"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Lys700Glu"
			},
			{
				"key" : "geneName",
				"value" : "SF3B1"
			},
			{
				"key" : "label",
				"value" : "SF3B1 p.Lys700Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000115524"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000335508"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcd9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f37718d7db4984c320dcd7",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcd8"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly118Asp"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Gly118Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcdc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37718d7db4984c320dcda",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcdb"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Ala"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcdf"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PGM5 p.Ile98Val",
	"identity" : "53f37718d7db4984c320dcdd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcde"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile98Val"
			},
			{
				"key" : "geneName",
				"value" : "PGM5"
			},
			{
				"key" : "label",
				"value" : "PGM5 p.Ile98Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000154330"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000396396"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dce2"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "CHEK2 p.Lys344Glu",
	"identity" : "53f37718d7db4984c320dce0",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dce1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Lys344Glu"
			},
			{
				"key" : "geneName",
				"value" : "CHEK2"
			},
			{
				"key" : "label",
				"value" : "CHEK2 p.Lys344Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000183765"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382580"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dce5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37718d7db4984c320dce3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dce4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val600Glu"
			},
			{
				"key" : "geneName",
				"value" : "BRAF"
			},
			{
				"key" : "label",
				"value" : "BRAF p.Val600Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000157764"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000288602"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dce8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f37718d7db4984c320dce6",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dce7"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg150Trp"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg150Trp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dceb"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gly",
	"identity" : "53f37718d7db4984c320dce9",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcea"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gly"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcee"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37718d7db4984c320dcec",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dced"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu542Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu542Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcf1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Cys",
	"identity" : "53f37718d7db4984c320dcef",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcf0"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132Cys"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcf4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "ABCA7 p.Ala2045Ser",
	"identity" : "53f37718d7db4984c320dcf2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcf3"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcba")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala2045Ser"
			},
			{
				"key" : "geneName",
				"value" : "ABCA7"
			},
			{
				"key" : "label",
				"value" : "ABCA7 p.Ala2045Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000064687"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263094"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcf5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "samples",
	"identity" : "TST035BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcf6"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST035BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcf9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37718d7db4984c320dcf7",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcf8"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu3455Lys"
			},
			{
				"key" : "geneName",
				"value" : "NBPF10"
			},
			{
				"key" : "label",
				"value" : "NBPF10 p.Glu3455Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000163386"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000342960"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcfc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "OTUD4 p.Thr974Ile",
	"identity" : "53f37718d7db4984c320dcfa",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcfb"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr974Ile"
			},
			{
				"key" : "geneName",
				"value" : "OTUD4"
			},
			{
				"key" : "label",
				"value" : "OTUD4 p.Thr974Ile"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000164164"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000454497"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dcff"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gly",
	"identity" : "53f37718d7db4984c320dcfd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dcfe"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gly"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd02"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37718d7db4984c320dd00",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd01"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg82Cys"
			},
			{
				"key" : "geneName",
				"value" : "GSG2"
			},
			{
				"key" : "label",
				"value" : "GSG2 p.Arg82Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000177602"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000325418"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd05"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Gly320Glu",
	"identity" : "53f37718d7db4984c320dd03",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd04"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly320Glu"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Gly320Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd08"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f37718d7db4984c320dd06",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd07"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr139His"
			},
			{
				"key" : "geneName",
				"value" : "FAM194B"
			},
			{
				"key" : "label",
				"value" : "FAM194B p.Tyr139His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000165837"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000298738"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd0b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132His",
	"identity" : "53f37718d7db4984c320dd09",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd0a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132His"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132His"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd0e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37718d7db4984c320dd0c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd0d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Cys27Phe"
			},
			{
				"key" : "geneName",
				"value" : "OPRD1"
			},
			{
				"key" : "label",
				"value" : "OPRD1 p.Cys27Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000116329"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000234961"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd11"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f37718d7db4984c320dd0f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd10"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val474Ala"
			},
			{
				"key" : "geneName",
				"value" : "ARHGAP5"
			},
			{
				"key" : "label",
				"value" : "ARHGAP5 p.Val474Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100852"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000345122"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd14"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "SF3B1 p.Lys700Glu",
	"identity" : "53f37718d7db4984c320dd12",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd13"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Lys700Glu"
			},
			{
				"key" : "geneName",
				"value" : "SF3B1"
			},
			{
				"key" : "label",
				"value" : "SF3B1 p.Lys700Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000115524"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000335508"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd17"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f37718d7db4984c320dd15",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd16"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly118Asp"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Gly118Asp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd1a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PGM5 p.Ile98Val",
	"identity" : "53f37718d7db4984c320dd18",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd19"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ile98Val"
			},
			{
				"key" : "geneName",
				"value" : "PGM5"
			},
			{
				"key" : "label",
				"value" : "PGM5 p.Ile98Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000154330"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000396396"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd1d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "CHEK2 p.Lys344Glu",
	"identity" : "53f37718d7db4984c320dd1b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd1c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Lys344Glu"
			},
			{
				"key" : "geneName",
				"value" : "CHEK2"
			},
			{
				"key" : "label",
				"value" : "CHEK2 p.Lys344Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000183765"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382580"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd20"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37718d7db4984c320dd1e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd1f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val600Glu"
			},
			{
				"key" : "geneName",
				"value" : "BRAF"
			},
			{
				"key" : "label",
				"value" : "BRAF p.Val600Glu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000157764"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000288602"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd23"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f37718d7db4984c320dd21",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd22"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg150Trp"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Arg150Trp"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000141510"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000269305"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd26"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PARG p.Ala99Thr",
	"identity" : "53f37718d7db4984c320dd24",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd25"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala99Thr"
			},
			{
				"key" : "geneName",
				"value" : "PARG"
			},
			{
				"key" : "label",
				"value" : "PARG p.Ala99Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000227345"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000402038"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd29"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gly",
	"identity" : "53f37718d7db4984c320dd27",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd28"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg130Gly"
			},
			{
				"key" : "geneName",
				"value" : "PTEN"
			},
			{
				"key" : "label",
				"value" : "PTEN p.Arg130Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000171862"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000371953"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd2c"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37718d7db4984c320dd2a",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd2b"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu542Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu542Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd2f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Cys",
	"identity" : "53f37718d7db4984c320dd2d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd2e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132Cys"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132Cys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd32"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T17:59:23.729Z"),
	"role" : "observations",
	"name" : "ABCA7 p.Ala2045Ser",
	"identity" : "53f37718d7db4984c320dd30",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd31"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-11-28T17:59:23.729Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcf5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dcb9")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala2045Ser"
			},
			{
				"key" : "geneName",
				"value" : "ABCA7"
			},
			{
				"key" : "label",
				"value" : "ABCA7 p.Ala2045Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000064687"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263094"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd38"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-11-28T16:29:39.682Z"),
	"role" : "participants",
	"identity" : "TST-036",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dd33"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-11-28T16:29:39.682Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-036"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd34"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-11-28T16:29:39.682Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-28T16:29:39.682"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd35"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-12-01T21:07:39.955Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-01T21:07:39.955"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd36"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-12-01T21:15:51.513Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-01T21:15:51.513"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd37"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-12-03T22:12:27.693Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-03T22:12:27.693"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd39"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "samples",
	"identity" : "TST036BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd3a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST036BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd3d"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Gly",
	"identity" : "53f37718d7db4984c320dd3b",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd3c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132Gly"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd40"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Ala337Val",
	"identity" : "53f37718d7db4984c320dd3e",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd3f"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala337Val"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Ala337Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd43"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f37718d7db4984c320dd41",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd42"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly363Ser"
			},
			{
				"key" : "geneName",
				"value" : "LATS2"
			},
			{
				"key" : "label",
				"value" : "LATS2 p.Gly363Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000150457"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382592"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd46"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "observations",
	"name" : "UBBP4 p.Arg73Leu",
	"identity" : "53f37718d7db4984c320dd44",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd45"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd39")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg73Leu"
			},
			{
				"key" : "geneName",
				"value" : "UBBP4"
			},
			{
				"key" : "label",
				"value" : "UBBP4 p.Arg73Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000263563"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000578713"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd47"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "samples",
	"identity" : "TST036BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd48"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST036BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd4b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Gly",
	"identity" : "53f37718d7db4984c320dd49",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd4a"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd47")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg132Gly"
			},
			{
				"key" : "geneName",
				"value" : "IDH1"
			},
			{
				"key" : "label",
				"value" : "IDH1 p.Arg132Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000138413"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000415913"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd4e"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Ala337Val",
	"identity" : "53f37718d7db4984c320dd4c",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd4d"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd47")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala337Val"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Ala337Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd51"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f37718d7db4984c320dd4f",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd50"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd47")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly363Ser"
			},
			{
				"key" : "geneName",
				"value" : "LATS2"
			},
			{
				"key" : "label",
				"value" : "LATS2 p.Gly363Ser"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000150457"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000382592"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd54"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-04T19:40:22.940Z"),
	"role" : "observations",
	"name" : "UBBP4 p.Arg73Leu",
	"identity" : "53f37718d7db4984c320dd52",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd53"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-04T19:40:22.940Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd47")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd38")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg73Leu"
			},
			{
				"key" : "geneName",
				"value" : "UBBP4"
			},
			{
				"key" : "label",
				"value" : "UBBP4 p.Arg73Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000263563"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000578713"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd5a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-03T20:54:54.241Z"),
	"role" : "participants",
	"identity" : "TST-037",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dd55"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-12-03T20:54:54.241Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-037"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd56"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-12-03T20:54:54.241Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-03T20:54:54.241"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd57"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-12-07T20:25:47.658Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-07T20:25:47.658"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd58"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-12-07T22:02:29.618Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-07T22:02:29.618"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd59"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-12-09T18:59:14.132Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-09T18:59:14.132"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd5b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-09T21:24:05.810Z"),
	"role" : "samples",
	"identity" : "TST037BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd5c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-09T21:24:05.810Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST037BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd5a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd5f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-09T21:24:05.810Z"),
	"role" : "observations",
	"name" : "UBBP4 p.Arg73Leu",
	"identity" : "53f37718d7db4984c320dd5d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd5e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-09T21:24:05.810Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd5b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd5a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg73Leu"
			},
			{
				"key" : "geneName",
				"value" : "UBBP4"
			},
			{
				"key" : "label",
				"value" : "UBBP4 p.Arg73Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000263563"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000578713"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd60"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-09T21:24:05.810Z"),
	"role" : "samples",
	"identity" : "TST037BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd61"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-09T21:24:05.810Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST037BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd5a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd64"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-09T21:24:05.810Z"),
	"role" : "observations",
	"name" : "UBBP4 p.Arg73Leu",
	"identity" : "53f37718d7db4984c320dd62",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd63"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-09T21:24:05.810Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd60")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd5a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg73Leu"
			},
			{
				"key" : "geneName",
				"value" : "UBBP4"
			},
			{
				"key" : "label",
				"value" : "UBBP4 p.Arg73Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000263563"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000578713"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd6a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-06T19:00:19.591Z"),
	"role" : "participants",
	"identity" : "TST-038",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dd65"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-12-06T19:00:19.591Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-038"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd66"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-12-06T19:00:19.591Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-06T19:00:19.591"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd67"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-12-07T17:09:04.485Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-07T17:09:04.485"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd68"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-12-07T19:35:51.983Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-07T19:35:51.983"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd69"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-12-09T22:08:56.263Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-09T22:08:56.263"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd6b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-09T22:46:43.334Z"),
	"role" : "samples",
	"identity" : "TST038BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd6c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-09T22:46:43.334Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST038BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd6a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd6f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-09T22:46:43.334Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f37718d7db4984c320dd6d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd6e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-09T22:46:43.334Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd6b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd6a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser38Phe"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser38Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd70"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-09T22:46:43.334Z"),
	"role" : "samples",
	"identity" : "TST038BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd71"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-09T22:46:43.334Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST038BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd6a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd74"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-09T22:46:43.334Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f37718d7db4984c320dd72",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd73"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-09T22:46:43.334Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd70")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd6a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser38Phe"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser38Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd7a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-06T19:02:48.806Z"),
	"role" : "participants",
	"identity" : "TST-039",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dd75"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-12-06T19:02:48.806Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-039"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd76"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-12-06T19:02:48.806Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-06T19:02:48.806"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd77"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-12-08T14:17:07.652Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-08T14:17:07.652"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd78"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-12-08T21:26:49.974Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-08T21:26:49.974"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd79"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-12-09T19:07:04.957Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-09T19:07:04.957"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd7b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-10T15:08:42.497Z"),
	"role" : "samples",
	"identity" : "TST039BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd7c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-10T15:08:42.497Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST039BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd7a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd7f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-10T15:08:42.497Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37718d7db4984c320dd7d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd7e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-10T15:08:42.497Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd7a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu645Lys"
			},
			{
				"key" : "geneName",
				"value" : "NEFH"
			},
			{
				"key" : "label",
				"value" : "NEFH p.Glu645Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100285"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000310624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd80"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-10T15:08:42.497Z"),
	"role" : "samples",
	"identity" : "TST039BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd81"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-10T15:08:42.497Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST039BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd7a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd84"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-10T15:08:42.497Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37718d7db4984c320dd82",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd83"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-10T15:08:42.497Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd80")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd7a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu645Lys"
			},
			{
				"key" : "geneName",
				"value" : "NEFH"
			},
			{
				"key" : "label",
				"value" : "NEFH p.Glu645Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000100285"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000310624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd8a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-12T19:28:29.714Z"),
	"role" : "participants",
	"identity" : "TST-040",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dd85"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-12-12T19:28:29.714Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-040"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd86"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-12-12T19:28:29.714Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-12T19:28:29.714"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd87"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-12-16T19:54:16.483Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-16T19:54:16.483"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd88"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-12-16T20:57:40.099Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-16T20:57:40.099"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd89"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-12-19T18:38:19.760Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-19T18:38:19.760"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd8b"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-19T18:55:56.638Z"),
	"role" : "samples",
	"identity" : "TST040BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd8c"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-19T18:55:56.638Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST040BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd8a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd8f"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-19T18:55:56.638Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Val",
	"identity" : "53f37718d7db4984c320dd8d",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd8e"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-19T18:55:56.638Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd8b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd8a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Val"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd92"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-19T18:55:56.638Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Leu",
	"identity" : "53f37718d7db4984c320dd90",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd91"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-19T18:55:56.638Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd8b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd8a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His1047Leu"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.His1047Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd93"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-19T18:55:56.638Z"),
	"role" : "samples",
	"identity" : "TST040BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd94"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-19T18:55:56.638Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST040BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd8a")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd97"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-19T18:55:56.638Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Val",
	"identity" : "53f37718d7db4984c320dd95",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd96"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-19T18:55:56.638Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd93")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd8a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly12Val"
			},
			{
				"key" : "geneName",
				"value" : "KRAS"
			},
			{
				"key" : "label",
				"value" : "KRAS p.Gly12Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000133703"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000256078"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dd9a"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-19T18:55:56.638Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Leu",
	"identity" : "53f37718d7db4984c320dd98",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dd99"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-19T18:55:56.638Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd93")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dd8a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His1047Leu"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.His1047Leu"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dda0"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-18T22:57:41.818Z"),
	"role" : "participants",
	"identity" : "TST-041",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320dd9b"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-12-18T22:57:41.818Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-041"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd9c"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-12-18T22:57:41.818Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-18T22:57:41.818"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd9d"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-12-20T16:32:45.152Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-20T16:32:45.152"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd9e"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-12-20T20:28:23.773Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-20T20:28:23.773"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320dd9f"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-12-22T22:01:34.350Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-22T22:01:34.350"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dda1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "samples",
	"identity" : "TST041BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dda2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST041BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dda5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37718d7db4984c320dda3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dda4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu545Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu545Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320dda8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320dda6",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320dda7"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddab"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "KLHL30 p.Ala195Val",
	"identity" : "53f37718d7db4984c320dda9",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddaa"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala195Val"
			},
			{
				"key" : "geneName",
				"value" : "KLHL30"
			},
			{
				"key" : "label",
				"value" : "KLHL30 p.Ala195Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168427"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000409223"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddae"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37718d7db4984c320ddac",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddad"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg322Lys"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Arg322Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddb1"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37718d7db4984c320ddaf",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddb0"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser43Gly"
			},
			{
				"key" : "geneName",
				"value" : "EEF1B2"
			},
			{
				"key" : "label",
				"value" : "EEF1B2 p.Ser43Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000114942"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000392222"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddb4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37718d7db4984c320ddb2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddb3"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala242Thr"
			},
			{
				"key" : "geneName",
				"value" : "ZNF837"
			},
			{
				"key" : "label",
				"value" : "ZNF837 p.Ala242Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000152475"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000427624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddb5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "samples",
	"identity" : "TST041BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddb6"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST041BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddb9"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37718d7db4984c320ddb7",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddb8"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddb5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu545Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Glu545Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000121879"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000263967"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddbc"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37718d7db4984c320ddba",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddbb"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddb5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "HRAS"
			},
			{
				"key" : "label",
				"value" : "HRAS p.Gln61Arg"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000174775"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000451590"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddbf"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "KLHL30 p.Ala195Val",
	"identity" : "53f37718d7db4984c320ddbd",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddbe"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddb5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala195Val"
			},
			{
				"key" : "geneName",
				"value" : "KLHL30"
			},
			{
				"key" : "label",
				"value" : "KLHL30 p.Ala195Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168427"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000409223"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddc2"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37718d7db4984c320ddc0",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddc1"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddb5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg322Lys"
			},
			{
				"key" : "geneName",
				"value" : "ZNF814"
			},
			{
				"key" : "label",
				"value" : "ZNF814 p.Arg322Lys"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204514"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000435989"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddc5"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37718d7db4984c320ddc3",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddc4"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddb5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser43Gly"
			},
			{
				"key" : "geneName",
				"value" : "EEF1B2"
			},
			{
				"key" : "label",
				"value" : "EEF1B2 p.Ser43Gly"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000114942"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000392222"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddc8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-22T22:11:37.775Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37718d7db4984c320ddc6",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddc7"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-22T22:11:37.775Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddb5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320dda0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala242Thr"
			},
			{
				"key" : "geneName",
				"value" : "ZNF837"
			},
			{
				"key" : "label",
				"value" : "ZNF837 p.Ala242Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000152475"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000427624"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddce"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-24T15:29:11.853Z"),
	"role" : "participants",
	"identity" : "TST-042",
	"steps" : [
		{
			"id" : ObjectId("53f37718d7db4984c320ddc9"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d8"),
			"stepDate" : ISODate("2014-12-24T15:29:11.853Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-042"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320ddca"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8d9"),
			"stepDate" : ISODate("2014-12-24T15:29:11.853Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-24T15:29:11.853"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320ddcb"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8da"),
			"stepDate" : ISODate("2014-12-26T15:08:52.949Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-26T15:08:52.949"
			}
		},
		{
			"id" : ObjectId("53f37718d7db4984c320ddcc"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8db"),
			"stepDate" : ISODate("2014-12-26T22:56:17.504Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-26T22:56:17.504"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37718d7db4984c320ddcd"),
			"stepRef" : ObjectId("53f37718d7db4984c320d8dc"),
			"stepDate" : ISODate("2014-12-27T20:45:28.265Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-27T20:45:28.265"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddcf"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-28T15:17:39.331Z"),
	"role" : "samples",
	"identity" : "TST042BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddd0"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-28T15:17:39.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST042BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddce")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddd3"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-28T15:17:39.331Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f37718d7db4984c320ddd1",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddd2"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-28T15:17:39.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddcf")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddce")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser37Phe"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser37Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddd4"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-28T15:17:39.331Z"),
	"role" : "samples",
	"identity" : "TST042BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddd5"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e1"),
		"stepDate" : ISODate("2014-12-28T15:17:39.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST042BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddce")
			},
			{
				"key" : "source",
				"value" : "Biopsy"
			},
			{
				"key" : "type",
				"value" : "FFPE"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f37718d7db4984c320ddd8"),
	"studyId" : ObjectId("53f37718d7db4984c320d8d7"),
	"lastModified" : ISODate("2014-12-28T15:17:39.331Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f37718d7db4984c320ddd6",
	"steps" : {
		"id" : ObjectId("53f37718d7db4984c320ddd7"),
		"stepRef" : ObjectId("53f37718d7db4984c320d8e5"),
		"stepDate" : ISODate("2014-12-28T15:17:39.331Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddd4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f37718d7db4984c320ddce")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ser37Phe"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Ser37Phe"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000168036"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000349496"
			}
		]
	}
});
