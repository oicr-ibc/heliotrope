db.studies.drop();
db.steps.drop();
db.views.drop();
db.entities.drop();
db.createCollection('studies');
db.createCollection('steps');
db.createCollection('views');
db.createCollection('entities');
db.studies.insert({
	"_id" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe84f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe850"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe851"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe852"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe854"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe855"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe856"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe858"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe859"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "summary",
	"role" : "studies",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Number of participants</dt>\n  <dd>{{study.data.counts.participants}}</dd>\n  <dt>Number of samples</dt>\n  <dd>{{study.data.counts.samples}}</dd>\n  <dt>Observed mutations</dt>\n  <dd>{{study.data.counts.observations}}</dd>\n</dl>\n"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe85a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "participants",
	"role" : "studies",
	"label" : {
		"default" : "Participants"
	},
	"weight" : 100,
	"body" : "<div heli-study-entities role='participants' label='Participants'>\n</div>\n<br>\n"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe85b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "samples",
	"role" : "studies",
	"label" : {
		"default" : "Samples"
	},
	"weight" : 200,
	"body" : "<div heli-study-entities role='samples' label='Samples'>\n</div>\n<br>\n"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe85c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "summary",
	"role" : "participants",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Registered</dt>\n  <dd>{{entity.data.values.enrolmentDate | field}}</dd>\n  <dt>Consent</dt>\n  <dd>{{entity.data.values.consentDate | field}}</dd>\n  <dt>Biopsy</dt>\n  <dd>{{entity.data.values.biopsyDate | field}}</dd>\n  <dt>Pathology</dt>\n  <dd>{{entity.data.values.pathologyDate | field}}</dd>\n  <dt>Clinical lab</dt>\n  <dd>{{entity.data.values.clinicalLaboratoryDate | field}}</dd>\n  <dt>Research lab</dt>\n  <dd>{{entity.data.values.researchLaboratoryDate | field}}</dd>\n  <dt>Expert panel</dt>\n  <dd>{{entity.data.values.expertPanelDate | field}}</dd>\n</dl>\n"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe85d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "enrolment",
	"role" : "participants",
	"label" : {
		"default" : "Enrolment"
	},
	"weight" : 100,
	"body" : "<dl>\n  <dt>Registered</dt>\n  <dd>{{entity.data.values.enrolmentDate | field}}</dd>\n  <dt>Consent</dt>\n  <dd>{{entity.data.values.consentDate | field}}</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe85e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "samples",
	"role" : "participants",
	"label" : {
		"default" : "Samples"
	},
	"weight" : 200,
	"body" : "<table>\n  <thead></thead>\n  <tbody>\n    <tr ng-repeat='sample in entity.data.related.samples'>\n      <td><a href='{{sample.url}}'>{{sample.identity}}</a>\n    </tr>\n  <tbody>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe85f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "history",
	"role" : "participants",
	"label" : {
		"default" : "Clinical history"
	},
	"weight" : 300,
	"body" : "<div>\n{{entity.data.values.clinicalHistory | field}}\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe860"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "observations",
	"role" : "participants",
	"label" : {
		"default" : "Observations"
	},
	"weight" : 400,
	"body" : "<table heli-observations>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe861"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "steps",
	"role" : "participants",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe862"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "summary",
	"role" : "samples",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Requires collection</dt>\n  <dd>{{entity.data.values.requiresCollection | field}}</dd>\n  <dt>DNA quality</dt>\n  <dd>{{entity.data.values.dnaQuality | field}}</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe863"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "participants",
	"role" : "samples",
	"label" : {
		"default" : "Participant"
	},
	"weight" : 100,
	"body" : "<table>\n  <thead></thead>\n  <tbody>\n    <tr ng-repeat='participant in entity.data.related.participants'>\n      <td><a href='{{participant.url}}'>{{participant.identity}}</a>\n    </tr>\n  </tbody>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe864"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "observations",
	"role" : "samples",
	"label" : {
		"default" : "Observations"
	},
	"weight" : 400,
	"body" : "<table heli-observations>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe865"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "steps",
	"role" : "samples",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe866"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "summary",
	"role" : "observations",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Gene name</dt>\n  <dd>{{entity.data.values.geneName | field}}</dd>\n  <dt>Ensembl gene id</dt>\n  <dd><a href='http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g={{entity.data.values.geneId | field}}' rel='external'>{{entity.data.values.geneId | field}}</a></dd>\n  <dt>Ensembl transcript id</dt>\n  <dd><a href='http://useast.ensembl.org/Homo_sapiens/Transcript/Summary?t={{entity.data.values.geneId | field}}' rel='external'>{{entity.data.values.transcriptId | field}}</a></dd>\n  <dt>Amino acid mutation</dt>\n  <dd ng-show='entity.data.values.aminoAcidMutation'>{{entity.data.values.aminoAcidMutation | field}}</dd>\n  <dd ng-hide='entity.data.values.aminoAcidMutation'>Not available</dd>\n  <dt>DNA mutation</dt>\n  <dd>{{entity.data.values.dnaMutation | field}}</dd>\n  <dt>Depth</dt>\n  <dd>{{entity.data.values.depth | field}}</dd>\n  <dt>Open in knowledge base</dt>\n  <dd heli-knowledge-base-search term='entity.data.values.geneName.value + &quot;+&quot; + (entity.data.values.aminoAcidMutation.value || entity.data.values.dnaMutation.value)' entity='entity'>Not available</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe867"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"name" : "steps",
	"role" : "observations",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe86d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-07-28T16:13:37.489Z"),
	"role" : "participants",
	"identity" : "TST-001",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe868"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-07-28T16:13:37.489Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-001"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe869"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-07-28T16:13:37.489Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-07-28T16:13:37.489"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe86a"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-07-30T17:35:14.143Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-07-30T17:35:14.143"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe86b"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-07-30T21:34:12.019Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-07-30T21:34:12.019"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe86c"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-01T19:46:03.723Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-01T19:46:03.723"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe86e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-01T21:45:12.168Z"),
	"role" : "samples",
	"identity" : "TST001BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe86f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-01T21:45:12.168Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST001BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe86d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe872"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-01T21:45:12.168Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f26ad5b5e8ab4d14ebe870",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe871"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-01T21:45:12.168Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe86e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe86d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe873"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-01T21:45:12.168Z"),
	"role" : "samples",
	"identity" : "TST001BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe874"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-01T21:45:12.168Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST001BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe86d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe877"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-01T21:45:12.168Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f26ad5b5e8ab4d14ebe875",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe876"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-01T21:45:12.168Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe873")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe86d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe87d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-01T13:26:22.427Z"),
	"role" : "participants",
	"identity" : "TST-002",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe878"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-01T13:26:22.427Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-002"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe879"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-01T13:26:22.427Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-01T13:26:22.427"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe87a"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-02T21:17:27.359Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-02T21:17:27.359"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe87b"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-02T21:59:39.188Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-02T21:59:39.188"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe87c"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-04T17:28:13.770Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-04T17:28:13.770"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe87e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-04T17:48:39.737Z"),
	"role" : "samples",
	"identity" : "TST002BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe87f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-04T17:48:39.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST002BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe882"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-04T17:48:39.737Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f26ad5b5e8ab4d14ebe880",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe881"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-04T17:48:39.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly245Ser"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Gly245Ser"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe885"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-04T17:48:39.737Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f26ad5b5e8ab4d14ebe883",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe884"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-04T17:48:39.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe888"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-04T17:48:39.737Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f26ad5b5e8ab4d14ebe886",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe887"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-04T17:48:39.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe889"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-04T17:48:39.737Z"),
	"role" : "samples",
	"identity" : "TST002BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe88a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-04T17:48:39.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST002BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe88d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-04T17:48:39.737Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f26ad5b5e8ab4d14ebe88b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe88c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-04T17:48:39.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe889")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87d")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly245Ser"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Gly245Ser"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe890"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-04T17:48:39.737Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f26ad5b5e8ab4d14ebe88e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe88f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-04T17:48:39.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe889")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe893"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-04T17:48:39.737Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f26ad5b5e8ab4d14ebe891",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe892"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-04T17:48:39.737Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe889")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe87d")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe899"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-05T17:23:17.176Z"),
	"role" : "participants",
	"identity" : "TST-003",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe894"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-05T17:23:17.176Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-003"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe895"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-05T17:23:17.176Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-05T17:23:17.176"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe896"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-08T18:31:19.988Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-08T18:31:19.988"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe897"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-08T21:41:55.288Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-08T21:41:55.288"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe898"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-10T21:03:07.365Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-10T21:03:07.365"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe89a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-10T21:13:19.205Z"),
	"role" : "samples",
	"identity" : "TST003BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe89b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-10T21:13:19.205Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST003BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe899")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe89e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-10T21:13:19.205Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Arg",
	"identity" : "53f26ad5b5e8ab4d14ebe89c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe89d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-10T21:13:19.205Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe89a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe899")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His1047Arg"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.His1047Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe89f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-10T21:13:19.205Z"),
	"role" : "samples",
	"identity" : "TST003BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8a0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-10T21:13:19.205Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST003BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe899")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8a3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-10T21:13:19.205Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Arg",
	"identity" : "53f26ad5b5e8ab4d14ebe8a1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8a2"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-10T21:13:19.205Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe89f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe899")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His1047Arg"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.His1047Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8a9"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-08T20:15:59.560Z"),
	"role" : "participants",
	"identity" : "TST-004",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8a4"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-08T20:15:59.560Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-004"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8a5"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-08T20:15:59.560Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-08T20:15:59.560"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8a6"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-10T20:39:31.706Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-10T20:39:31.706"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8a7"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-10T21:39:21.502Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-10T21:39:21.502"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8a8"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-11T15:41:18.544Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-11T15:41:18.544"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8aa"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-11T18:01:49.998Z"),
	"role" : "samples",
	"identity" : "TST004BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8ab"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-11T18:01:49.998Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST004BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8a9")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8ae"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-11T18:01:49.998Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebe8ac",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8ad"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-11T18:01:49.998Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8aa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8a9")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8b1"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-11T18:01:49.998Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe8af",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8b0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-11T18:01:49.998Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8aa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8a9")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8b4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-11T18:01:49.998Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Gly320Glu",
	"identity" : "53f26ad5b5e8ab4d14ebe8b2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8b3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-11T18:01:49.998Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8aa")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8a9")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8b5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-11T18:01:49.998Z"),
	"role" : "samples",
	"identity" : "TST004BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8b6"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-11T18:01:49.998Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST004BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8a9")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8b9"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-11T18:01:49.998Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebe8b7",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8b8"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-11T18:01:49.998Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8b5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8a9")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8bc"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-11T18:01:49.998Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe8ba",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8bb"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-11T18:01:49.998Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8b5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8a9")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8bf"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-11T18:01:49.998Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Gly320Glu",
	"identity" : "53f26ad5b5e8ab4d14ebe8bd",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8be"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-11T18:01:49.998Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8b5")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8a9")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8c5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-09T19:33:23.495Z"),
	"role" : "participants",
	"identity" : "TST-005",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8c0"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-09T19:33:23.495Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-005"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8c1"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-09T19:33:23.495Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-09T19:33:23.495"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8c2"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-13T16:18:09.405Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-13T16:18:09.405"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8c3"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-13T20:04:59.287Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-13T20:04:59.287"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8c4"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-15T17:54:26.819Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-15T17:54:26.819"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8c6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-15T20:16:53.876Z"),
	"role" : "samples",
	"identity" : "TST005BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8c7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-15T20:16:53.876Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST005BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8c5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8ca"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-15T20:16:53.876Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f26ad5b5e8ab4d14ebe8c8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8c9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-15T20:16:53.876Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8c6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8c5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8cb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-15T20:16:53.876Z"),
	"role" : "samples",
	"identity" : "TST005BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8cc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-15T20:16:53.876Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST005BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8c5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8cf"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-15T20:16:53.876Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f26ad5b5e8ab4d14ebe8cd",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8ce"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-15T20:16:53.876Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8cb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8c5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8d5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-16T15:06:48.328Z"),
	"role" : "participants",
	"identity" : "TST-006",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8d0"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-16T15:06:48.328Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-006"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8d1"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-16T15:06:48.328Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-16T15:06:48.328"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8d2"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-18T21:01:13.301Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-18T21:01:13.301"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8d3"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-18T21:01:38.244Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-18T21:01:38.244"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8d4"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-20T15:53:42.962Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-20T15:53:42.962"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8d6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-20T20:50:59.882Z"),
	"role" : "samples",
	"identity" : "TST006BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8d7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-20T20:50:59.882Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST006BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8d5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8da"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-20T20:50:59.882Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebe8d8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8d9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-20T20:50:59.882Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8d6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8d5")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His61Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8dd"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-20T20:50:59.882Z"),
	"role" : "observations",
	"name" : "GPRIN2 p.Val241Met",
	"identity" : "53f26ad5b5e8ab4d14ebe8db",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8dc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-20T20:50:59.882Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8d6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8d5")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val241Met"
			},
			{
				"key" : "geneName",
				"value" : "GPRIN2"
			},
			{
				"key" : "label",
				"value" : "GPRIN2 p.Val241Met"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204175"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000374314"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8de"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-20T20:50:59.882Z"),
	"role" : "samples",
	"identity" : "TST006BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8df"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-20T20:50:59.882Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST006BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8d5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8e2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-20T20:50:59.882Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebe8e0",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8e1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-20T20:50:59.882Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8de")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8d5")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His61Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8e5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-20T20:50:59.882Z"),
	"role" : "observations",
	"name" : "GPRIN2 p.Val241Met",
	"identity" : "53f26ad5b5e8ab4d14ebe8e3",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8e4"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-20T20:50:59.882Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8de")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8d5")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val241Met"
			},
			{
				"key" : "geneName",
				"value" : "GPRIN2"
			},
			{
				"key" : "label",
				"value" : "GPRIN2 p.Val241Met"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204175"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000374314"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8eb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-18T19:50:40.722Z"),
	"role" : "participants",
	"identity" : "TST-007",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8e6"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-18T19:50:40.722Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-007"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8e7"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-18T19:50:40.722Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-18T19:50:40.722"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8e8"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-20T15:32:40.435Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-20T15:32:40.435"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8e9"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-20T17:14:58.537Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-20T17:14:58.537"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8ea"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-22T14:20:55.012Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-22T14:20:55.012"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8ec"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-22T15:30:06.797Z"),
	"role" : "samples",
	"identity" : "TST007BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8ed"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-22T15:30:06.797Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST007BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8eb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8f0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-22T15:30:06.797Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Ala337Val",
	"identity" : "53f26ad5b5e8ab4d14ebe8ee",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8ef"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-22T15:30:06.797Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8ec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8eb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8f3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-22T15:30:06.797Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe8f1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8f2"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-22T15:30:06.797Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8ec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8eb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8f4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-22T15:30:06.797Z"),
	"role" : "samples",
	"identity" : "TST007BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8f5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-22T15:30:06.797Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST007BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8eb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8f8"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-22T15:30:06.797Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Ala337Val",
	"identity" : "53f26ad5b5e8ab4d14ebe8f6",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8f7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-22T15:30:06.797Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8f4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8eb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe8fb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-22T15:30:06.797Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe8f9",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe8fa"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-22T15:30:06.797Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8f4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe8eb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe901"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-21T18:01:43.750Z"),
	"role" : "participants",
	"identity" : "TST-008",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8fc"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-21T18:01:43.750Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-008"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8fd"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-21T18:01:43.750Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-21T18:01:43.750"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8fe"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-23T15:45:14.978Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-23T15:45:14.978"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe8ff"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-23T19:19:26.180Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-23T19:19:26.180"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe900"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-24T17:57:52.343Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-24T17:57:52.343"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe902"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-24T21:28:30.480Z"),
	"role" : "samples",
	"identity" : "TST008BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe903"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-24T21:28:30.480Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST008BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe901")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe906"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-24T21:28:30.480Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f26ad5b5e8ab4d14ebe904",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe905"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-24T21:28:30.480Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe902")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe901")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe90a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-24T21:28:30.480Z"),
	"role" : "samples",
	"identity" : "TST008BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe90b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-24T21:28:30.480Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST008BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe901")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe909"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-24T21:28:30.480Z"),
	"role" : "observations",
	"name" : "NOTCH2 p.Ala21Thr",
	"identity" : "53f26ad5b5e8ab4d14ebe907",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe908"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-24T21:28:30.480Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe902")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe901")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe90e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-24T21:28:30.480Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f26ad5b5e8ab4d14ebe90c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe90d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-24T21:28:30.480Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe90a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe901")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe911"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-24T21:28:30.480Z"),
	"role" : "observations",
	"name" : "NOTCH2 p.Ala21Thr",
	"identity" : "53f26ad5b5e8ab4d14ebe90f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe910"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-24T21:28:30.480Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe90a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe901")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe917"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-22T21:44:53.345Z"),
	"role" : "participants",
	"identity" : "TST-009",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe912"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-22T21:44:53.345Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-009"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe913"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-22T21:44:53.345Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-22T21:44:53.345"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe914"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-24T21:45:37.915Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-24T21:45:37.915"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe915"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-24T21:58:14.966Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-24T21:58:14.966"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe916"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-08-28T20:25:58.437Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-28T20:25:58.437"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe918"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-28T20:50:55Z"),
	"role" : "samples",
	"identity" : "TST009BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe919"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-28T20:50:55Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST009BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe917")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe91c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-28T20:50:55Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f26ad5b5e8ab4d14ebe91a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe91b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-28T20:50:55Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe918")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe917")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe91d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-28T20:50:55Z"),
	"role" : "samples",
	"identity" : "TST009BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe91e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-08-28T20:50:55Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST009BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe917")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe921"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-28T20:50:55Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f26ad5b5e8ab4d14ebe91f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe920"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-08-28T20:50:55Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe91d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe917")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe927"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-26T17:48:41.397Z"),
	"role" : "participants",
	"identity" : "TST-010",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe922"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-26T17:48:41.397Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-010"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe923"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-26T17:48:41.397Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-26T17:48:41.397"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe924"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-08-30T17:49:18.852Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-30T17:49:18.852"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe925"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-08-30T21:12:36.332Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-30T21:12:36.332"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe926"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-02T15:05:26.051Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-02T15:05:26.051"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe928"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-02T17:28:24.449Z"),
	"role" : "samples",
	"identity" : "TST010BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe929"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-02T17:28:24.449Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST010BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe927")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe92c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-02T17:28:24.449Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe92a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe92b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-02T17:28:24.449Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe928")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe927")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe92d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-02T17:28:24.449Z"),
	"role" : "samples",
	"identity" : "TST010BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe92e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-02T17:28:24.449Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST010BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe927")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe931"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-02T17:28:24.449Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe92f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe930"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-02T17:28:24.449Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe92d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe927")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe937"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-08-30T18:35:28.408Z"),
	"role" : "participants",
	"identity" : "TST-011",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe932"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-08-30T18:35:28.408Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-011"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe933"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-08-30T18:35:28.408Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-30T18:35:28.408"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe934"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-02T18:04:31.183Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-02T18:04:31.183"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe935"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-02T19:56:34.679Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-02T19:56:34.679"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe936"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-04T20:16:23.152Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-04T20:16:23.152"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe938"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "samples",
	"identity" : "TST011BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe939"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST011BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe93c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Gly320Glu",
	"identity" : "53f26ad5b5e8ab4d14ebe93a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe93b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe93f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f26ad5b5e8ab4d14ebe93d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe93e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe942"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "LATS2 p.Ala324Val",
	"identity" : "53f26ad5b5e8ab4d14ebe940",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe941"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe945"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "ADAD2 p.Gly44Glu",
	"identity" : "53f26ad5b5e8ab4d14ebe943",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe944"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe948"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "FRG1B p.Leu87Ser",
	"identity" : "53f26ad5b5e8ab4d14ebe946",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe947"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe94b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "ANKLE1 p.Leu83Gln",
	"identity" : "53f26ad5b5e8ab4d14ebe949",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe94a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu83Gln"
			},
			{
				"key" : "geneName",
				"value" : "ANKLE1"
			},
			{
				"key" : "label",
				"value" : "ANKLE1 p.Leu83Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000160117"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000394458"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe94e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Val",
	"identity" : "53f26ad5b5e8ab4d14ebe94c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe94d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe951"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Asn345Lys",
	"identity" : "53f26ad5b5e8ab4d14ebe94f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe950"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asn345Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Asn345Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe954"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebe952",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe953"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe938")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe955"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "samples",
	"identity" : "TST011BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe956"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST011BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe959"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Gly320Glu",
	"identity" : "53f26ad5b5e8ab4d14ebe957",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe958"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe955")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe95c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f26ad5b5e8ab4d14ebe95a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe95b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe955")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe95f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "ADAD2 p.Gly44Glu",
	"identity" : "53f26ad5b5e8ab4d14ebe95d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe95e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe955")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe962"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "FRG1B p.Leu87Ser",
	"identity" : "53f26ad5b5e8ab4d14ebe960",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe961"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe955")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe965"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "ANKLE1 p.Leu83Gln",
	"identity" : "53f26ad5b5e8ab4d14ebe963",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe964"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe955")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu83Gln"
			},
			{
				"key" : "geneName",
				"value" : "ANKLE1"
			},
			{
				"key" : "label",
				"value" : "ANKLE1 p.Leu83Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000160117"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000394458"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe968"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Val",
	"identity" : "53f26ad5b5e8ab4d14ebe966",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe967"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe955")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe96b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Asn345Lys",
	"identity" : "53f26ad5b5e8ab4d14ebe969",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe96a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe955")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asn345Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Asn345Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe96e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-04T21:46:34.556Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebe96c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe96d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-04T21:46:34.556Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe955")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe937")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe974"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-03T18:10:05.283Z"),
	"role" : "participants",
	"identity" : "TST-012",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe96f"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-03T18:10:05.283Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-012"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe970"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-03T18:10:05.283Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-03T18:10:05.283"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe971"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-05T20:09:55.683Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-05T20:09:55.683"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe972"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-05T21:56:42.107Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-05T21:56:42.107"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe973"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-07T14:22:59.893Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-07T14:22:59.893"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe975"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "samples",
	"identity" : "TST012BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe976"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST012BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe979"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f26ad5b5e8ab4d14ebe977",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe978"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe975")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe97c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Arg",
	"identity" : "53f26ad5b5e8ab4d14ebe97a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe97b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe975")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His1047Arg"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.His1047Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe97f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f26ad5b5e8ab4d14ebe97d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe97e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe975")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe982"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f26ad5b5e8ab4d14ebe980",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe981"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe975")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe983"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "samples",
	"identity" : "TST012BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe984"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST012BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe987"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f26ad5b5e8ab4d14ebe985",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe986"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe983")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe98a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Arg",
	"identity" : "53f26ad5b5e8ab4d14ebe988",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe989"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe983")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His1047Arg"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.His1047Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe98d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f26ad5b5e8ab4d14ebe98b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe98c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe983")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe990"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-07T18:03:45.436Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f26ad5b5e8ab4d14ebe98e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe98f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-07T18:03:45.436Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe983")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe974")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe996"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-06T18:06:16.102Z"),
	"role" : "participants",
	"identity" : "TST-013",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe991"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-06T18:06:16.102Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-013"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe992"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-06T18:06:16.102Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-06T18:06:16.102"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe993"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-07T17:19:47.590Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-07T17:19:47.590"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe994"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-07T19:12:11.032Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-07T19:12:11.032"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe995"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-09T21:46:43.549Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-09T21:46:43.549"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe997"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-10T14:03:52.692Z"),
	"role" : "samples",
	"identity" : "TST013BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe998"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-10T14:03:52.692Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST013BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe996")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe99b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-10T14:03:52.692Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebe999",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe99a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-10T14:03:52.692Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe997")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe996")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe99e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-10T14:03:52.692Z"),
	"role" : "observations",
	"name" : "TP53 p.Tyr220Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe99c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe99d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-10T14:03:52.692Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe997")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe996")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr220Cys"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Tyr220Cys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9a1"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-10T14:03:52.692Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe99f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9a0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-10T14:03:52.692Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe997")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe996")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9a2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-10T14:03:52.692Z"),
	"role" : "samples",
	"identity" : "TST013BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9a3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-10T14:03:52.692Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST013BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe996")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9a6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-10T14:03:52.692Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebe9a4",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9a5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-10T14:03:52.692Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9a2")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe996")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9a9"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-10T14:03:52.692Z"),
	"role" : "observations",
	"name" : "TP53 p.Tyr220Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe9a7",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9a8"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-10T14:03:52.692Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9a2")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe996")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr220Cys"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Tyr220Cys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9ac"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-10T14:03:52.692Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe9aa",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ab"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-10T14:03:52.692Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9a2")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe996")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9b2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-09T15:27:50.402Z"),
	"role" : "participants",
	"identity" : "TST-014",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ad"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-09T15:27:50.402Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-014"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ae"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-09T15:27:50.402Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-09T15:27:50.402"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9af"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-11T16:19:30.128Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-11T16:19:30.128"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9b0"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-11T21:50:39.865Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-11T21:50:39.865"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9b1"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-13T20:57:03.944Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-13T20:57:03.944"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9b3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "samples",
	"identity" : "TST014BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9b4"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST014BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9b7"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f26ad5b5e8ab4d14ebe9b5",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9b6"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9ba"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "GPRIN2 p.Val241Met",
	"identity" : "53f26ad5b5e8ab4d14ebe9b8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9b9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val241Met"
			},
			{
				"key" : "geneName",
				"value" : "GPRIN2"
			},
			{
				"key" : "label",
				"value" : "GPRIN2 p.Val241Met"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204175"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000374314"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9bd"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe9bb",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9bc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9c0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe9be",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9bf"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9c3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "KLHL30 p.Ala195Val",
	"identity" : "53f26ad5b5e8ab4d14ebe9c1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9c2"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9c4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "samples",
	"identity" : "TST014BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9c5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST014BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9c8"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f26ad5b5e8ab4d14ebe9c6",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9c7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9c4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9cb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "GPRIN2 p.Val241Met",
	"identity" : "53f26ad5b5e8ab4d14ebe9c9",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ca"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9c4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val241Met"
			},
			{
				"key" : "geneName",
				"value" : "GPRIN2"
			},
			{
				"key" : "label",
				"value" : "GPRIN2 p.Val241Met"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204175"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000374314"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9ce"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe9cc",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9cd"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9c4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9d1"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe9cf",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9d0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9c4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9d4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-14T15:36:09.290Z"),
	"role" : "observations",
	"name" : "KLHL30 p.Ala195Val",
	"identity" : "53f26ad5b5e8ab4d14ebe9d2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9d3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-14T15:36:09.290Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9c4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9b2")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9da"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-12T18:52:21.841Z"),
	"role" : "participants",
	"identity" : "TST-015",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9d5"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-12T18:52:21.841Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-015"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9d6"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-12T18:52:21.841Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-12T18:52:21.841"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9d7"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-14T19:46:24.760Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-14T19:46:24.760"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9d8"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-14T21:53:32.696Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-14T21:53:32.696"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9d9"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-16T18:53:29.986Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-16T18:53:29.986"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9db"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-17T16:05:59.700Z"),
	"role" : "samples",
	"identity" : "TST015BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9dc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-17T16:05:59.700Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST015BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9da")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9df"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-17T16:05:59.700Z"),
	"role" : "observations",
	"name" : "TP53 p.Tyr220Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe9dd",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9de"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-17T16:05:59.700Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9db")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9da")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr220Cys"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Tyr220Cys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9e2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-17T16:05:59.700Z"),
	"role" : "observations",
	"name" : "FEZ2 p.Pro50Leu",
	"identity" : "53f26ad5b5e8ab4d14ebe9e0",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9e1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-17T16:05:59.700Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9db")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9da")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9e3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-17T16:05:59.700Z"),
	"role" : "samples",
	"identity" : "TST015BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9e4"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-17T16:05:59.700Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST015BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9da")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9e7"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-17T16:05:59.700Z"),
	"role" : "observations",
	"name" : "TP53 p.Tyr220Cys",
	"identity" : "53f26ad5b5e8ab4d14ebe9e5",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9e6"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-17T16:05:59.700Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9e3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9da")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Tyr220Cys"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Tyr220Cys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9ea"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-17T16:05:59.700Z"),
	"role" : "observations",
	"name" : "FEZ2 p.Pro50Leu",
	"identity" : "53f26ad5b5e8ab4d14ebe9e8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9e9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-17T16:05:59.700Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9e3")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9da")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9f0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-16T17:13:31.572Z"),
	"role" : "participants",
	"identity" : "TST-016",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9eb"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-16T17:13:31.572Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-016"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ec"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-16T17:13:31.572Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-16T17:13:31.572"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ed"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-17T21:43:19.007Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-17T21:43:19.007"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ee"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-17T21:57:20.229Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-17T21:57:20.229"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ef"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-18T21:29:51.773Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-18T21:29:51.773"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9f1"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-19T14:22:39.754Z"),
	"role" : "samples",
	"identity" : "TST016BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9f2"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-19T14:22:39.754Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST016BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9f0")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9f5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-19T14:22:39.754Z"),
	"role" : "observations",
	"name" : "RGPD8 p.Pro1620Ala",
	"identity" : "53f26ad5b5e8ab4d14ebe9f3",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9f4"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-19T14:22:39.754Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9f1")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9f0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro1620Ala"
			},
			{
				"key" : "geneName",
				"value" : "RGPD8"
			},
			{
				"key" : "label",
				"value" : "RGPD8 p.Pro1620Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169629"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000302558"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9f6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-19T14:22:39.754Z"),
	"role" : "samples",
	"identity" : "TST016BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9f7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-19T14:22:39.754Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST016BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9f0")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebe9fa"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-19T14:22:39.754Z"),
	"role" : "observations",
	"name" : "RGPD8 p.Pro1620Ala",
	"identity" : "53f26ad5b5e8ab4d14ebe9f8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebe9f9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-19T14:22:39.754Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9f6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebe9f0")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro1620Ala"
			},
			{
				"key" : "geneName",
				"value" : "RGPD8"
			},
			{
				"key" : "label",
				"value" : "RGPD8 p.Pro1620Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169629"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000302558"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea00"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-17T15:15:15.635Z"),
	"role" : "participants",
	"identity" : "TST-017",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9fb"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-17T15:15:15.635Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-017"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9fc"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-17T15:15:15.635Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-17T15:15:15.635"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9fd"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-19T16:03:20.753Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-19T16:03:20.753"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9fe"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-19T19:42:14.405Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-19T19:42:14.405"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebe9ff"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-21T20:46:06.407Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-21T20:46:06.407"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea01"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-21T20:54:10.520Z"),
	"role" : "samples",
	"identity" : "TST017BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea02"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-21T20:54:10.520Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST017BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea00")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea05"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-21T20:54:10.520Z"),
	"role" : "observations",
	"name" : "NRAS p.Gln61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebea03",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea04"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-21T20:54:10.520Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea01")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea00")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "NRAS"
			},
			{
				"key" : "label",
				"value" : "NRAS p.Gln61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea08"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-21T20:54:10.520Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f26ad5b5e8ab4d14ebea06",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea07"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-21T20:54:10.520Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea01")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea00")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea09"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-21T20:54:10.520Z"),
	"role" : "samples",
	"identity" : "TST017BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea0a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-21T20:54:10.520Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST017BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea00")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea0d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-21T20:54:10.520Z"),
	"role" : "observations",
	"name" : "NRAS p.Gln61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebea0b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea0c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-21T20:54:10.520Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea09")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea00")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "NRAS"
			},
			{
				"key" : "label",
				"value" : "NRAS p.Gln61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea10"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-21T20:54:10.520Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f26ad5b5e8ab4d14ebea0e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea0f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-21T20:54:10.520Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea09")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea00")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea16"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-22T14:49:45.964Z"),
	"role" : "participants",
	"identity" : "TST-018",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea11"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-22T14:49:45.964Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-018"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea12"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-22T14:49:45.964Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-22T14:49:45.964"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea13"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-25T13:45:07.712Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-25T13:45:07.712"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea14"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-25T16:30:55.649Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-25T16:30:55.649"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea15"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-26T13:17:33.391Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-26T13:17:33.391"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea17"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "samples",
	"identity" : "TST018BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea18"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST018BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea1b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "NTSR2 p.Ala54Val",
	"identity" : "53f26ad5b5e8ab4d14ebea19",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea1a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea17")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala54Val"
			},
			{
				"key" : "geneName",
				"value" : "NTSR2"
			},
			{
				"key" : "label",
				"value" : "NTSR2 p.Ala54Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169006"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000306928"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea1e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "NOTCH2 p.Ala21Thr",
	"identity" : "53f26ad5b5e8ab4d14ebea1c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea1d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea17")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea21"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f26ad5b5e8ab4d14ebea1f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea20"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea17")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea24"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebea22",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea23"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea17")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea27"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f26ad5b5e8ab4d14ebea25",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea26"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea17")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea2a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "ABCA7 p.Ala2045Ser",
	"identity" : "53f26ad5b5e8ab4d14ebea28",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea29"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea17")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea2d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f26ad5b5e8ab4d14ebea2b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea2c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea17")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly245Ser"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Gly245Ser"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea2e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "samples",
	"identity" : "TST018BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea2f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST018BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea32"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "NTSR2 p.Ala54Val",
	"identity" : "53f26ad5b5e8ab4d14ebea30",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea31"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala54Val"
			},
			{
				"key" : "geneName",
				"value" : "NTSR2"
			},
			{
				"key" : "label",
				"value" : "NTSR2 p.Ala54Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169006"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000306928"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea35"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "NOTCH2 p.Ala21Thr",
	"identity" : "53f26ad5b5e8ab4d14ebea33",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea34"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea38"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f26ad5b5e8ab4d14ebea36",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea37"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea3b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebea39",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea3a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea3e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f26ad5b5e8ab4d14ebea3c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea3d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea41"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "ABCA7 p.Ala2045Ser",
	"identity" : "53f26ad5b5e8ab4d14ebea3f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea40"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea44"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T13:27:51.913Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f26ad5b5e8ab4d14ebea42",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea43"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-26T13:27:51.913Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea2e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea16")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly245Ser"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Gly245Ser"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea4a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-26T14:25:11.118Z"),
	"role" : "participants",
	"identity" : "TST-019",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea45"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-26T14:25:11.118Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-019"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea46"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-26T14:25:11.118Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-26T14:25:11.118"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea47"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-09-28T18:04:59.230Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-28T18:04:59.230"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea48"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-09-28T20:33:23.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-28T20:33:23.955"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea49"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-09-30T20:28:37.963Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-30T20:28:37.963"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea4b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "samples",
	"identity" : "TST019BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea4c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST019BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea4f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "NTSR2 p.Ala54Val",
	"identity" : "53f26ad5b5e8ab4d14ebea4d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea4e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala54Val"
			},
			{
				"key" : "geneName",
				"value" : "NTSR2"
			},
			{
				"key" : "label",
				"value" : "NTSR2 p.Ala54Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169006"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000306928"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea52"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "FEZ2 p.Pro50Leu",
	"identity" : "53f26ad5b5e8ab4d14ebea50",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea51"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea55"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "ANKLE1 p.Leu83Gln",
	"identity" : "53f26ad5b5e8ab4d14ebea53",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea54"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu83Gln"
			},
			{
				"key" : "geneName",
				"value" : "ANKLE1"
			},
			{
				"key" : "label",
				"value" : "ANKLE1 p.Leu83Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000160117"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000394458"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea58"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "GPRIN2 p.Val241Met",
	"identity" : "53f26ad5b5e8ab4d14ebea56",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea57"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val241Met"
			},
			{
				"key" : "geneName",
				"value" : "GPRIN2"
			},
			{
				"key" : "label",
				"value" : "GPRIN2 p.Val241Met"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204175"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000374314"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea5b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f26ad5b5e8ab4d14ebea59",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea5a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea5e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Arg",
	"identity" : "53f26ad5b5e8ab4d14ebea5c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea5d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His1047Arg"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.His1047Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea5f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "samples",
	"identity" : "TST019BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea60"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST019BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea63"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "NTSR2 p.Ala54Val",
	"identity" : "53f26ad5b5e8ab4d14ebea61",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea62"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea5f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala54Val"
			},
			{
				"key" : "geneName",
				"value" : "NTSR2"
			},
			{
				"key" : "label",
				"value" : "NTSR2 p.Ala54Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169006"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000306928"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea66"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "FEZ2 p.Pro50Leu",
	"identity" : "53f26ad5b5e8ab4d14ebea64",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea65"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea5f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea69"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "ANKLE1 p.Leu83Gln",
	"identity" : "53f26ad5b5e8ab4d14ebea67",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea68"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea5f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Leu83Gln"
			},
			{
				"key" : "geneName",
				"value" : "ANKLE1"
			},
			{
				"key" : "label",
				"value" : "ANKLE1 p.Leu83Gln"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000160117"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000394458"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea6c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "GPRIN2 p.Val241Met",
	"identity" : "53f26ad5b5e8ab4d14ebea6a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea6b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea5f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val241Met"
			},
			{
				"key" : "geneName",
				"value" : "GPRIN2"
			},
			{
				"key" : "label",
				"value" : "GPRIN2 p.Val241Met"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204175"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000374314"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea6f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f26ad5b5e8ab4d14ebea6d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea6e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea5f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea72"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-30T21:35:06.848Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Arg",
	"identity" : "53f26ad5b5e8ab4d14ebea70",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea71"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-09-30T21:35:06.848Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea5f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea4a")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His1047Arg"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.His1047Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea78"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-09-29T18:50:51.780Z"),
	"role" : "participants",
	"identity" : "TST-020",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea73"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-09-29T18:50:51.780Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-020"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea74"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-09-29T18:50:51.780Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-29T18:50:51.780"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea75"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-01T15:36:49.043Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-01T15:36:49.043"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea76"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-01T16:13:13.773Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-01T16:13:13.773"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea77"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-04T18:18:41.379Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-04T18:18:41.379"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea79"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-04T21:26:26.979Z"),
	"role" : "samples",
	"identity" : "TST020BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea7a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-04T21:26:26.979Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST020BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea78")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea7d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-04T21:26:26.979Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f26ad5b5e8ab4d14ebea7b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea7c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-04T21:26:26.979Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea79")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea78")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea80"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-04T21:26:26.979Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f26ad5b5e8ab4d14ebea7e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea7f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-04T21:26:26.979Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea79")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea78")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea83"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-04T21:26:26.979Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f26ad5b5e8ab4d14ebea81",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea82"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-04T21:26:26.979Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea79")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea78")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea84"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-04T21:26:26.979Z"),
	"role" : "samples",
	"identity" : "TST020BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea85"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-04T21:26:26.979Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST020BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea78")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea88"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-04T21:26:26.979Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f26ad5b5e8ab4d14ebea86",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea87"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-04T21:26:26.979Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea84")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea78")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea8b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-04T21:26:26.979Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f26ad5b5e8ab4d14ebea89",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea8a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-04T21:26:26.979Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea84")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea78")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea8e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-04T21:26:26.979Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f26ad5b5e8ab4d14ebea8c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea8d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-04T21:26:26.979Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea84")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea78")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea94"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-01T13:27:57.302Z"),
	"role" : "participants",
	"identity" : "TST-021",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea8f"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-01T13:27:57.302Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-021"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea90"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-01T13:27:57.302Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-01T13:27:57.302"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea91"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-03T18:57:19.426Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-03T18:57:19.426"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea92"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-03T18:58:23.277Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-03T18:58:23.277"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebea93"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-07T19:16:08.406Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-07T19:16:08.406"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea95"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-07T21:32:04.755Z"),
	"role" : "samples",
	"identity" : "TST021BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea96"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-07T21:32:04.755Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST021BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea94")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea99"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-07T21:32:04.755Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f26ad5b5e8ab4d14ebea97",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea98"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-07T21:32:04.755Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea95")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea94")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea9c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-07T21:32:04.755Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f26ad5b5e8ab4d14ebea9a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea9b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-07T21:32:04.755Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea95")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea94")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebea9f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-07T21:32:04.755Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f26ad5b5e8ab4d14ebea9d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebea9e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-07T21:32:04.755Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea95")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea94")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaa0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-07T21:32:04.755Z"),
	"role" : "samples",
	"identity" : "TST021BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaa1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-07T21:32:04.755Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST021BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea94")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaa4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-07T21:32:04.755Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f26ad5b5e8ab4d14ebeaa2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaa3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-07T21:32:04.755Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaa0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea94")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaa7"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-07T21:32:04.755Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeaa5",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaa6"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-07T21:32:04.755Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaa0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebea94")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaad"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-05T14:12:03.729Z"),
	"role" : "participants",
	"identity" : "TST-022",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaa8"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-05T14:12:03.729Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-022"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaa9"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-05T14:12:03.729Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-05T14:12:03.729"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaaa"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-07T13:16:56.348Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-07T13:16:56.348"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaab"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-07T14:02:04.215Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-07T14:02:04.215"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaac"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-09T13:30:16.186Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-09T13:30:16.186"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaae"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-09T20:49:38.441Z"),
	"role" : "samples",
	"identity" : "TST022BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaaf"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-09T20:49:38.441Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST022BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaad")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeab2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-09T20:49:38.441Z"),
	"role" : "observations",
	"name" : "DOT1L p.Gly266Ser",
	"identity" : "53f26ad5b5e8ab4d14ebeab0",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeab1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-09T20:49:38.441Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaad")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeab5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-09T20:49:38.441Z"),
	"role" : "observations",
	"name" : "NOTCH2 p.Ala21Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeab3",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeab4"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-09T20:49:38.441Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaad")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeab6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-09T20:49:38.441Z"),
	"role" : "samples",
	"identity" : "TST022BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeab7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-09T20:49:38.441Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST022BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaad")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaba"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-09T20:49:38.441Z"),
	"role" : "observations",
	"name" : "DOT1L p.Gly266Ser",
	"identity" : "53f26ad5b5e8ab4d14ebeab8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeab9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-09T20:49:38.441Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeab6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaad")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeabd"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-09T20:49:38.441Z"),
	"role" : "observations",
	"name" : "NOTCH2 p.Ala21Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeabb",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeabc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-09T20:49:38.441Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeab6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaad")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeac3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-06T18:56:56.987Z"),
	"role" : "participants",
	"identity" : "TST-023",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeabe"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-06T18:56:56.987Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-023"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeabf"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-06T18:56:56.987Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-06T18:56:56.987"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeac0"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-08T13:11:08.385Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-08T13:11:08.385"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeac1"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-08T15:36:49.443Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-08T15:36:49.443"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeac2"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-11T15:05:25.551Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-11T15:05:25.551"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeac4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T17:11:29.122Z"),
	"role" : "samples",
	"identity" : "TST023BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeac5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-11T17:11:29.122Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST023BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeac8"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T17:11:29.122Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebeac6",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeac7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T17:11:29.122Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeacb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T17:11:29.122Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f26ad5b5e8ab4d14ebeac9",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaca"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T17:11:29.122Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeace"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T17:11:29.122Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f26ad5b5e8ab4d14ebeacc",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeacd"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T17:11:29.122Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac3")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly245Ser"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Gly245Ser"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeacf"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T17:11:29.122Z"),
	"role" : "samples",
	"identity" : "TST023BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebead0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-11T17:11:29.122Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST023BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebead3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T17:11:29.122Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebead1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebead2"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T17:11:29.122Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeacf")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebead6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T17:11:29.122Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f26ad5b5e8ab4d14ebead4",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebead5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T17:11:29.122Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeacf")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebead9"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T17:11:29.122Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f26ad5b5e8ab4d14ebead7",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebead8"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T17:11:29.122Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeacf")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeac3")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gly245Ser"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.Gly245Ser"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeadf"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-07T16:53:42.087Z"),
	"role" : "participants",
	"identity" : "TST-024",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeada"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-07T16:53:42.087Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-024"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeadb"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-07T16:53:42.087Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-07T16:53:42.087"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeadc"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-09T18:21:59.824Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-09T18:21:59.824"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeadd"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-09T18:55:46.406Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-09T18:55:46.406"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeade"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-11T18:16:04.267Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-11T18:16:04.267"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeae0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T21:57:06.935Z"),
	"role" : "samples",
	"identity" : "TST024BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeae1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-11T21:57:06.935Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST024BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeadf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeae4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T21:57:06.935Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f26ad5b5e8ab4d14ebeae2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeae3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T21:57:06.935Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeae0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeadf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeae7"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T21:57:06.935Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Thr34Ala",
	"identity" : "53f26ad5b5e8ab4d14ebeae5",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeae6"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T21:57:06.935Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeae0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeadf")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr34Ala"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Thr34Ala"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeae8"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T21:57:06.935Z"),
	"role" : "samples",
	"identity" : "TST024BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeae9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-11T21:57:06.935Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST024BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeadf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaec"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T21:57:06.935Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f26ad5b5e8ab4d14ebeaea",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaeb"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T21:57:06.935Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeae8")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeadf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaef"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T21:57:06.935Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Thr34Ala",
	"identity" : "53f26ad5b5e8ab4d14ebeaed",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaee"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-11T21:57:06.935Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeae8")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeadf")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Thr34Ala"
			},
			{
				"key" : "geneName",
				"value" : "CTNNB1"
			},
			{
				"key" : "label",
				"value" : "CTNNB1 p.Thr34Ala"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaf5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-11T15:23:10.381Z"),
	"role" : "participants",
	"identity" : "TST-025",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaf0"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-11T15:23:10.381Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-025"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaf1"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-11T15:23:10.381Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-11T15:23:10.381"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaf2"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-13T15:11:38.413Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-13T15:11:38.413"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaf3"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-13T15:54:20.901Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-13T15:54:20.901"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeaf4"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-14T13:12:47.682Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-14T13:12:47.682"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeaf6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "samples",
	"identity" : "TST025BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaf7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST025BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeafa"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f26ad5b5e8ab4d14ebeaf8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaf9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeafd"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebeafb",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeafc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb00"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f26ad5b5e8ab4d14ebeafe",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeaff"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb03"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f26ad5b5e8ab4d14ebeb01",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb02"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg88Gln"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Arg88Gln"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb06"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebeb04",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb05"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb09"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f26ad5b5e8ab4d14ebeb07",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb08"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb0c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f26ad5b5e8ab4d14ebeb0a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb0b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb0f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala41Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeb0d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb0e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb12"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebeb10",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb11"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf6")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb13"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "samples",
	"identity" : "TST025BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb14"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST025BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb17"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f26ad5b5e8ab4d14ebeb15",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb16"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb13")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb1a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebeb18",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb19"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb13")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb1d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f26ad5b5e8ab4d14ebeb1b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb1c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb13")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb20"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f26ad5b5e8ab4d14ebeb1e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb1f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb13")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Arg88Gln"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Arg88Gln"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb23"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f26ad5b5e8ab4d14ebeb21",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb22"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb13")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb26"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f26ad5b5e8ab4d14ebeb24",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb25"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb13")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb29"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala41Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeb27",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb28"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb13")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb2c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-14T19:38:33.106Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebeb2a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb2b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-14T19:38:33.106Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb13")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeaf5")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb32"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-17T20:36:03.026Z"),
	"role" : "participants",
	"identity" : "TST-026",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb2d"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-17T20:36:03.026Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-026"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb2e"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-17T20:36:03.026Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-17T20:36:03.026"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb2f"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-19T15:53:55.763Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-19T15:53:55.763"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb30"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-19T20:33:51.872Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-19T20:33:51.872"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb31"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-21T14:06:57.590Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-21T14:06:57.590"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb33"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-21T17:25:25.267Z"),
	"role" : "samples",
	"identity" : "TST026BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb34"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-21T17:25:25.267Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST026BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb32")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb35"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-21T17:25:25.267Z"),
	"role" : "samples",
	"identity" : "TST026BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb36"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-21T17:25:25.267Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST026BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb32")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb39"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-21T17:25:25.267Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Arg",
	"identity" : "53f26ad5b5e8ab4d14ebeb37",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb38"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-21T17:25:25.267Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb35")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb32")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb3f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-23T16:36:19.819Z"),
	"role" : "participants",
	"identity" : "TST-027",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb3a"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-23T16:36:19.819Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-027"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb3b"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-23T16:36:19.819Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-23T16:36:19.819"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb3c"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-24T21:12:54.437Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-24T21:12:54.437"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb3d"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-24T21:46:00.292Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-24T21:46:00.292"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb3e"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-26T14:28:55.779Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-26T14:28:55.779"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb40"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-26T21:06:19.080Z"),
	"role" : "samples",
	"identity" : "TST027BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb41"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-26T21:06:19.080Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST027BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb3f")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb44"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-26T21:06:19.080Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser33Cys",
	"identity" : "53f26ad5b5e8ab4d14ebeb42",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb43"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-26T21:06:19.080Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb40")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb3f")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb47"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-26T21:06:19.080Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f26ad5b5e8ab4d14ebeb45",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb46"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-26T21:06:19.080Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb40")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb3f")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb48"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-26T21:06:19.080Z"),
	"role" : "samples",
	"identity" : "TST027BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb49"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-26T21:06:19.080Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST027BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb3f")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb4c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-26T21:06:19.080Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser33Cys",
	"identity" : "53f26ad5b5e8ab4d14ebeb4a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb4b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-26T21:06:19.080Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb48")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb3f")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb4f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-26T21:06:19.080Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f26ad5b5e8ab4d14ebeb4d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb4e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-26T21:06:19.080Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb48")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb3f")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb55"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-25T20:31:28.749Z"),
	"role" : "participants",
	"identity" : "TST-028",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb50"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-25T20:31:28.749Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-028"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb51"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-25T20:31:28.749Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-25T20:31:28.749"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb52"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-27T15:40:31.676Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-27T15:40:31.676"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb53"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-27T19:49:58.891Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-27T19:49:58.891"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb54"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-10-29T17:41:17.674Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-29T17:41:17.674"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb56"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-29T19:40:23.633Z"),
	"role" : "samples",
	"identity" : "TST028BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb57"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-29T19:40:23.633Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST028BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb55")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb5a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-29T19:40:23.633Z"),
	"role" : "observations",
	"name" : "GPRIN2 p.Val241Met",
	"identity" : "53f26ad5b5e8ab4d14ebeb58",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb59"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-29T19:40:23.633Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb56")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb55")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val241Met"
			},
			{
				"key" : "geneName",
				"value" : "GPRIN2"
			},
			{
				"key" : "label",
				"value" : "GPRIN2 p.Val241Met"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204175"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000374314"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb5b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-29T19:40:23.633Z"),
	"role" : "samples",
	"identity" : "TST028BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb5c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-10-29T19:40:23.633Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST028BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb55")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb5f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-29T19:40:23.633Z"),
	"role" : "observations",
	"name" : "GPRIN2 p.Val241Met",
	"identity" : "53f26ad5b5e8ab4d14ebeb5d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb5e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-10-29T19:40:23.633Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb5b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb55")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Val241Met"
			},
			{
				"key" : "geneName",
				"value" : "GPRIN2"
			},
			{
				"key" : "label",
				"value" : "GPRIN2 p.Val241Met"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204175"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000374314"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb65"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-10-30T21:52:18.464Z"),
	"role" : "participants",
	"identity" : "TST-029",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb60"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-10-30T21:52:18.464Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-029"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb61"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-10-30T21:52:18.464Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-30T21:52:18.464"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb62"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-10-31T17:26:05.136Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-31T17:26:05.136"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb63"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-10-31T20:57:54.902Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-31T20:57:54.902"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb64"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-11-01T20:49:06.672Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-01T20:49:06.672"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb66"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "samples",
	"identity" : "TST029BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb67"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST029BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb6a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f26ad5b5e8ab4d14ebeb68",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb69"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb66")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb6d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeb6b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb6c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb66")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala75Thr"
			},
			{
				"key" : "geneName",
				"value" : "SP5"
			},
			{
				"key" : "label",
				"value" : "SP5 p.Ala75Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204335"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000375281"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb70"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebeb6e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb6f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb66")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb73"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Asn345Lys",
	"identity" : "53f26ad5b5e8ab4d14ebeb71",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb72"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb66")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asn345Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Asn345Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb76"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeb74",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb75"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb66")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala75Thr"
			},
			{
				"key" : "geneName",
				"value" : "SP5"
			},
			{
				"key" : "label",
				"value" : "SP5 p.Ala75Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204335"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000375281"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb79"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f26ad5b5e8ab4d14ebeb77",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb78"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb66")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala298Pro"
			},
			{
				"key" : "geneName",
				"value" : "SBK2"
			},
			{
				"key" : "label",
				"value" : "SBK2 p.Ala298Pro"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000187550"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000413299"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb7c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "NTSR2 p.Ala54Val",
	"identity" : "53f26ad5b5e8ab4d14ebeb7a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb7b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb66")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala54Val"
			},
			{
				"key" : "geneName",
				"value" : "NTSR2"
			},
			{
				"key" : "label",
				"value" : "NTSR2 p.Ala54Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169006"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000306928"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb7d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "samples",
	"identity" : "TST029BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb7e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST029BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb81"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f26ad5b5e8ab4d14ebeb7f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb80"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb7d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb84"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeb82",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb83"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb7d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala75Thr"
			},
			{
				"key" : "geneName",
				"value" : "SP5"
			},
			{
				"key" : "label",
				"value" : "SP5 p.Ala75Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204335"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000375281"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb87"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebeb85",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb86"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb7d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb8a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Asn345Lys",
	"identity" : "53f26ad5b5e8ab4d14ebeb88",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb89"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb7d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asn345Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Asn345Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb8d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f26ad5b5e8ab4d14ebeb8b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb8c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb7d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala75Thr"
			},
			{
				"key" : "geneName",
				"value" : "SP5"
			},
			{
				"key" : "label",
				"value" : "SP5 p.Ala75Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204335"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000375281"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb90"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f26ad5b5e8ab4d14ebeb8e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb8f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb7d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala298Pro"
			},
			{
				"key" : "geneName",
				"value" : "SBK2"
			},
			{
				"key" : "label",
				"value" : "SBK2 p.Ala298Pro"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000187550"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000413299"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb93"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-01T21:53:27.434Z"),
	"role" : "observations",
	"name" : "NTSR2 p.Ala54Val",
	"identity" : "53f26ad5b5e8ab4d14ebeb91",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb92"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-01T21:53:27.434Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb7d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb65")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala54Val"
			},
			{
				"key" : "geneName",
				"value" : "NTSR2"
			},
			{
				"key" : "label",
				"value" : "NTSR2 p.Ala54Val"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169006"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000306928"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb99"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-03T18:59:54.840Z"),
	"role" : "participants",
	"identity" : "TST-030",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb94"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-11-03T18:59:54.840Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-030"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb95"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-11-03T18:59:54.840Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-03T18:59:54.840"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb96"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-11-06T17:06:59.641Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-06T17:06:59.641"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb97"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-11-06T21:58:38.067Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-06T21:58:38.067"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebeb98"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-11-09T18:26:55.363Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-09T18:26:55.363"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb9a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-09T20:21:29.320Z"),
	"role" : "samples",
	"identity" : "TST030BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb9b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-09T20:21:29.320Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST030BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb99")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeb9e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-09T20:21:29.320Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f26ad5b5e8ab4d14ebeb9c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeb9d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-09T20:21:29.320Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb9a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb99")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeba1"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-09T20:21:29.320Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f26ad5b5e8ab4d14ebeb9f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeba0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-09T20:21:29.320Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb9a")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb99")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeba2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-09T20:21:29.320Z"),
	"role" : "samples",
	"identity" : "TST030BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeba3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-09T20:21:29.320Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST030BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb99")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeba6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-09T20:21:29.320Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f26ad5b5e8ab4d14ebeba4",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeba5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-09T20:21:29.320Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeba2")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb99")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeba9"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-09T20:21:29.320Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f26ad5b5e8ab4d14ebeba7",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeba8"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-09T20:21:29.320Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeba2")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeb99")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebaf"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-09T14:25:34.709Z"),
	"role" : "participants",
	"identity" : "TST-031",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebaa"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-11-09T14:25:34.709Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-031"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebab"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-11-09T14:25:34.709Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-09T14:25:34.709"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebac"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-11-12T16:31:29.450Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-12T16:31:29.450"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebad"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-11-12T20:07:19.933Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-12T20:07:19.933"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebae"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-11-15T18:17:14.293Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-15T18:17:14.293"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebb0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-15T19:20:43.394Z"),
	"role" : "samples",
	"identity" : "TST031BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebb1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-15T19:20:43.394Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST031BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebaf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebb4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-15T19:20:43.394Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f26ad5b5e8ab4d14ebebb2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebb3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-15T19:20:43.394Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebb0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebaf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebb7"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-15T19:20:43.394Z"),
	"role" : "observations",
	"name" : "NRAS p.Gln61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebebb5",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebb6"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-15T19:20:43.394Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebb0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebaf")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "NRAS"
			},
			{
				"key" : "label",
				"value" : "NRAS p.Gln61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebba"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-15T19:20:43.394Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f26ad5b5e8ab4d14ebebb8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebb9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-15T19:20:43.394Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebb0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebaf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebbb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-15T19:20:43.394Z"),
	"role" : "samples",
	"identity" : "TST031BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebbc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-15T19:20:43.394Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST031BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebaf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebbf"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-15T19:20:43.394Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f26ad5b5e8ab4d14ebebbd",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebbe"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-15T19:20:43.394Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebbb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebaf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebc2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-15T19:20:43.394Z"),
	"role" : "observations",
	"name" : "NRAS p.Gln61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebebc0",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebc1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-15T19:20:43.394Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebbb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebaf")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Gln61Arg"
			},
			{
				"key" : "geneName",
				"value" : "NRAS"
			},
			{
				"key" : "label",
				"value" : "NRAS p.Gln61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebc5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-15T19:20:43.394Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f26ad5b5e8ab4d14ebebc3",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebc4"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-15T19:20:43.394Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebbb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebaf")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebcb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-14T17:45:55.131Z"),
	"role" : "participants",
	"identity" : "TST-032",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebc6"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-11-14T17:45:55.131Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-032"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebc7"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-11-14T17:45:55.131Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-14T17:45:55.131"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebc8"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-11-15T15:28:07.952Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-15T15:28:07.952"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebc9"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-11-15T18:41:03.244Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-15T18:41:03.244"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebca"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-11-17T15:58:53.119Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-17T15:58:53.119"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebcc"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "samples",
	"identity" : "TST032BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebcd"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST032BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebd0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ile45Thr",
	"identity" : "53f26ad5b5e8ab4d14ebebce",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebcf"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebd3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f26ad5b5e8ab4d14ebebd1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebd2"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebd6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f26ad5b5e8ab4d14ebebd4",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebd5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebd9"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebebd7",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebd8"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebdc"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f26ad5b5e8ab4d14ebebda",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebdb"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcc")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebdd"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "samples",
	"identity" : "TST032BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebde"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST032BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebe1"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ile45Thr",
	"identity" : "53f26ad5b5e8ab4d14ebebdf",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebe0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebdd")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebe4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f26ad5b5e8ab4d14ebebe2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebe3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebdd")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebe7"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f26ad5b5e8ab4d14ebebe5",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebe6"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebdd")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebea"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f26ad5b5e8ab4d14ebebe8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebe9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebdd")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebed"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-17T19:10:49.299Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f26ad5b5e8ab4d14ebebeb",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebec"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-17T19:10:49.299Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebdd")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebcb")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebf3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-18T20:14:38.551Z"),
	"role" : "participants",
	"identity" : "TST-033",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebee"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-11-18T20:14:38.551Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-033"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebef"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-11-18T20:14:38.551Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-18T20:14:38.551"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebf0"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-11-21T15:08:59.686Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-21T15:08:59.686"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebf1"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-11-21T19:20:56.784Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-21T19:20:56.784"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebebf2"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-11-23T21:05:53.024Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-23T21:05:53.024"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebf4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "samples",
	"identity" : "TST033BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebf5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST033BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebf8"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Asn345Lys",
	"identity" : "53f26ad5b5e8ab4d14ebebf6",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebf7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asn345Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Asn345Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebfb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f26ad5b5e8ab4d14ebebf9",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebfa"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebebfe"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f26ad5b5e8ab4d14ebebfc",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebebfd"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec01"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f26ad5b5e8ab4d14ebebff",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec00"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf4")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec02"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "samples",
	"identity" : "TST033BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec03"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST033BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec06"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Asn345Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec04",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec05"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec02")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Asn345Lys"
			},
			{
				"key" : "geneName",
				"value" : "PIK3CA"
			},
			{
				"key" : "label",
				"value" : "PIK3CA p.Asn345Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec09"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f26ad5b5e8ab4d14ebec07",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec08"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec02")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec0c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f26ad5b5e8ab4d14ebec0a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec0b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec02")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec0f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T22:01:01.642Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec0d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec0e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-23T22:01:01.642Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec02")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebebf3")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec15"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-23T19:05:45.972Z"),
	"role" : "participants",
	"identity" : "TST-034",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec10"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-11-23T19:05:45.972Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-034"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec11"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-11-23T19:05:45.972Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-23T19:05:45.972"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec12"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-11-28T16:34:17.972Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-28T16:34:17.972"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec13"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-11-28T18:45:24.324Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-28T18:45:24.324"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec14"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-11-30T16:01:44.628Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-30T16:01:44.628"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec16"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "samples",
	"identity" : "TST034BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec17"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST034BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec1a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f26ad5b5e8ab4d14ebec18",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec19"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec1d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f26ad5b5e8ab4d14ebec1b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec1c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala298Pro"
			},
			{
				"key" : "geneName",
				"value" : "SBK2"
			},
			{
				"key" : "label",
				"value" : "SBK2 p.Ala298Pro"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000187550"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000413299"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec20"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu138Gly",
	"identity" : "53f26ad5b5e8ab4d14ebec1e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec1f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec23"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f26ad5b5e8ab4d14ebec21",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec22"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec26"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "DOT1L p.Gly266Ser",
	"identity" : "53f26ad5b5e8ab4d14ebec24",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec25"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec29"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f26ad5b5e8ab4d14ebec27",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec28"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec2c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec2a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec2b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec2f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebec2d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec2e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His61Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec32"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f26ad5b5e8ab4d14ebec30",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec31"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec35"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu135Gly",
	"identity" : "53f26ad5b5e8ab4d14ebec33",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec34"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec16")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec36"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "samples",
	"identity" : "TST034BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec37"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST034BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec3a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f26ad5b5e8ab4d14ebec38",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec39"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec3d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu138Gly",
	"identity" : "53f26ad5b5e8ab4d14ebec3b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec3c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec40"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f26ad5b5e8ab4d14ebec3e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec3f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec43"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "DOT1L p.Gly266Ser",
	"identity" : "53f26ad5b5e8ab4d14ebec41",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec42"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec46"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f26ad5b5e8ab4d14ebec44",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec45"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec49"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec47",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec48"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec4c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebec4a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec4b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His61Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec4f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f26ad5b5e8ab4d14ebec4d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec4e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec52"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-30T21:06:06.659Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu135Gly",
	"identity" : "53f26ad5b5e8ab4d14ebec50",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec51"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-30T21:06:06.659Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec36")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec15")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec58"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-25T19:25:40.027Z"),
	"role" : "participants",
	"identity" : "TST-035",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec53"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-11-25T19:25:40.027Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-035"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec54"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-11-25T19:25:40.027Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-25T19:25:40.027"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec55"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-11-26T20:15:13.428Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-26T20:15:13.428"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec56"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-11-26T22:43:38.260Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-26T22:43:38.260"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec57"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-11-27T19:56:23.063Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-27T19:56:23.063"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec59"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "samples",
	"identity" : "TST035BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec5a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST035BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec5d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "observations",
	"name" : "KLHL30 p.Ala195Val",
	"identity" : "53f26ad5b5e8ab4d14ebec5b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec5c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec60"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec5e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec5f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec63"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec61",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec62"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec66"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebec64",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec65"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec59")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His61Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec67"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "samples",
	"identity" : "TST035BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec68"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST035BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec6b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "observations",
	"name" : "KLHL30 p.Ala195Val",
	"identity" : "53f26ad5b5e8ab4d14ebec69",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec6a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec67")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec6e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec6c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec6d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec67")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec71"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec6f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec70"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec67")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec74"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T22:49:42.631Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f26ad5b5e8ab4d14ebec72",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec73"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-11-27T22:49:42.631Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec67")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec58")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.His61Arg"
			},
			{
				"key" : "geneName",
				"value" : "TP53"
			},
			{
				"key" : "label",
				"value" : "TP53 p.His61Arg"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec7a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-27T18:16:06.134Z"),
	"role" : "participants",
	"identity" : "TST-036",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec75"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-11-27T18:16:06.134Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-036"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec76"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-11-27T18:16:06.134Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-27T18:16:06.134"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec77"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-11-29T16:47:28.019Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-29T16:47:28.019"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec78"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-11-29T17:31:14.610Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-29T17:31:14.610"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec79"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-12-02T20:26:51.972Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-02T20:26:51.972"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec7b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-02T22:39:15.397Z"),
	"role" : "samples",
	"identity" : "TST036BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec7c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-02T22:39:15.397Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST036BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec7f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-02T22:39:15.397Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Pro323His",
	"identity" : "53f26ad5b5e8ab4d14ebec7d",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec7e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-02T22:39:15.397Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec82"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-02T22:39:15.397Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f26ad5b5e8ab4d14ebec80",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec81"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-02T22:39:15.397Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec85"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-02T22:39:15.397Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f26ad5b5e8ab4d14ebec83",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec84"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-02T22:39:15.397Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7b")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec86"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-02T22:39:15.397Z"),
	"role" : "samples",
	"identity" : "TST036BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec87"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-02T22:39:15.397Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST036BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec8a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-02T22:39:15.397Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Pro323His",
	"identity" : "53f26ad5b5e8ab4d14ebec88",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec89"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-02T22:39:15.397Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec86")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec8d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-02T22:39:15.397Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f26ad5b5e8ab4d14ebec8b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec8c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-02T22:39:15.397Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec86")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec90"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-02T22:39:15.397Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f26ad5b5e8ab4d14ebec8e",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec8f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-02T22:39:15.397Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec86")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec7a")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec96"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-11-29T22:58:07.368Z"),
	"role" : "participants",
	"identity" : "TST-037",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec91"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-11-29T22:58:07.368Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-037"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec92"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-11-29T22:58:07.368Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-29T22:58:07.368"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec93"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-11-30T15:13:40.069Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-30T15:13:40.069"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec94"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-11-30T16:56:02.791Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-30T16:56:02.791"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebec95"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-12-04T14:59:54.329Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-04T14:59:54.329"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec97"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "samples",
	"identity" : "TST037BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec98"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST037BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec9b"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebec99",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec9a"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebec9e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f26ad5b5e8ab4d14ebec9c",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebec9d"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala75Thr"
			},
			{
				"key" : "geneName",
				"value" : "SP5"
			},
			{
				"key" : "label",
				"value" : "SP5 p.Ala75Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204335"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000375281"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeca1"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f26ad5b5e8ab4d14ebec9f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeca0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeca4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f26ad5b5e8ab4d14ebeca2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeca3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeca7"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "PTPLA p.Glu29Lys",
	"identity" : "53f26ad5b5e8ab4d14ebeca5",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeca6"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu29Lys"
			},
			{
				"key" : "geneName",
				"value" : "PTPLA"
			},
			{
				"key" : "label",
				"value" : "PTPLA p.Glu29Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecaa"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f26ad5b5e8ab4d14ebeca8",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeca9"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecad"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Leu",
	"identity" : "53f26ad5b5e8ab4d14ebecab",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecac"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec97")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecae"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "samples",
	"identity" : "TST037BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecaf"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST037BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecb2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "EGFR p.Gly553Val",
	"identity" : "53f26ad5b5e8ab4d14ebecb0",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecb1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecb5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f26ad5b5e8ab4d14ebecb3",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecb4"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala75Thr"
			},
			{
				"key" : "geneName",
				"value" : "SP5"
			},
			{
				"key" : "label",
				"value" : "SP5 p.Ala75Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204335"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000375281"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecb8"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f26ad5b5e8ab4d14ebecb6",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecb7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecbb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f26ad5b5e8ab4d14ebecb9",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecba"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecbe"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f26ad5b5e8ab4d14ebecbc",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecbd"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecc1"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f26ad5b5e8ab4d14ebecbf",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecc0"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecc4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T18:29:35.036Z"),
	"role" : "observations",
	"name" : "PIK3CA p.His1047Leu",
	"identity" : "53f26ad5b5e8ab4d14ebecc2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecc3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-04T18:29:35.036Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecae")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebec96")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecca"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-03T21:37:42.265Z"),
	"role" : "participants",
	"identity" : "TST-038",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecc5"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-12-03T21:37:42.265Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-038"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecc6"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-12-03T21:37:42.265Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-03T21:37:42.265"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecc7"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-12-05T22:10:33.677Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-05T22:10:33.677"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecc8"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-12-05T22:20:58.868Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-05T22:20:58.868"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecc9"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-12-08T18:14:57.014Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-08T18:14:57.014"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeccb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-08T22:23:27.846Z"),
	"role" : "samples",
	"identity" : "TST038BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeccc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-08T22:23:27.846Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST038BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecca")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeccf"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-08T22:23:27.846Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f26ad5b5e8ab4d14ebeccd",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecce"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-08T22:23:27.846Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebeccb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecca")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala298Pro"
			},
			{
				"key" : "geneName",
				"value" : "SBK2"
			},
			{
				"key" : "label",
				"value" : "SBK2 p.Ala298Pro"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000187550"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000413299"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecd0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-08T22:23:27.846Z"),
	"role" : "samples",
	"identity" : "TST038BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecd1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-08T22:23:27.846Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST038BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecca")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecd4"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-08T22:23:27.846Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f26ad5b5e8ab4d14ebecd2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecd3"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-08T22:23:27.846Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecd0")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecca")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala298Pro"
			},
			{
				"key" : "geneName",
				"value" : "SBK2"
			},
			{
				"key" : "label",
				"value" : "SBK2 p.Ala298Pro"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000187550"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000413299"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecda"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-04T20:47:10.586Z"),
	"role" : "participants",
	"identity" : "TST-039",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecd5"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-12-04T20:47:10.586Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-039"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecd6"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-12-04T20:47:10.586Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-04T20:47:10.586"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecd7"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-12-06T19:43:09.531Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-06T19:43:09.531"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecd8"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-12-06T22:20:26.089Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-06T22:20:26.089"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecd9"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-12-09T16:31:54.458Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-09T16:31:54.458"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecdb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "samples",
	"identity" : "TST039BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecdc"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST039BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecdf"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Asp",
	"identity" : "53f26ad5b5e8ab4d14ebecdd",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecde"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecdb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebece2"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "PTPLA p.Glu29Lys",
	"identity" : "53f26ad5b5e8ab4d14ebece0",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebece1"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecdb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu29Lys"
			},
			{
				"key" : "geneName",
				"value" : "PTPLA"
			},
			{
				"key" : "label",
				"value" : "PTPLA p.Glu29Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebece5"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Pro323His",
	"identity" : "53f26ad5b5e8ab4d14ebece3",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebece4"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecdb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebece8"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f26ad5b5e8ab4d14ebece6",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebece7"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecdb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebeceb"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f26ad5b5e8ab4d14ebece9",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecea"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecdb")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecec"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "samples",
	"identity" : "TST039BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebeced"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST039BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecf0"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Asp",
	"identity" : "53f26ad5b5e8ab4d14ebecee",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecef"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecf3"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "PTPLA p.Glu29Lys",
	"identity" : "53f26ad5b5e8ab4d14ebecf1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecf2"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Glu29Lys"
			},
			{
				"key" : "geneName",
				"value" : "PTPLA"
			},
			{
				"key" : "label",
				"value" : "PTPLA p.Glu29Lys"
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecf6"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Pro323His",
	"identity" : "53f26ad5b5e8ab4d14ebecf4",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecf5"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecf9"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f26ad5b5e8ab4d14ebecf7",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecf8"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebecfc"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-09T19:01:20.215Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f26ad5b5e8ab4d14ebecfa",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebecfb"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-09T19:01:20.215Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecec")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebecda")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed02"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-10T22:52:23.749Z"),
	"role" : "participants",
	"identity" : "TST-040",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecfd"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-12-10T22:52:23.749Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-040"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecfe"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-12-10T22:52:23.749Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-10T22:52:23.749"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebecff"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-12-13T16:39:08.957Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-13T16:39:08.957"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed00"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-12-13T22:19:52.138Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-13T22:19:52.138"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed01"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-12-16T16:53:57.732Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-16T16:53:57.732"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed03"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-16T20:50:01.733Z"),
	"role" : "samples",
	"identity" : "TST040BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed04"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-16T20:50:01.733Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST040BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed02")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed07"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-16T20:50:01.733Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f26ad5b5e8ab4d14ebed05",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed06"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-16T20:50:01.733Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed03")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed02")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed0a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-16T20:50:01.733Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f26ad5b5e8ab4d14ebed08",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed09"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-16T20:50:01.733Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed03")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed02")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala75Thr"
			},
			{
				"key" : "geneName",
				"value" : "SP5"
			},
			{
				"key" : "label",
				"value" : "SP5 p.Ala75Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204335"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000375281"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed0d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-16T20:50:01.733Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f26ad5b5e8ab4d14ebed0b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed0c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-16T20:50:01.733Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed03")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed02")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed0e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-16T20:50:01.733Z"),
	"role" : "samples",
	"identity" : "TST040BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed0f"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-16T20:50:01.733Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST040BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed02")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed12"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-16T20:50:01.733Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f26ad5b5e8ab4d14ebed10",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed11"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-16T20:50:01.733Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed0e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed02")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed15"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-16T20:50:01.733Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f26ad5b5e8ab4d14ebed13",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed14"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-16T20:50:01.733Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed0e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed02")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Ala75Thr"
			},
			{
				"key" : "geneName",
				"value" : "SP5"
			},
			{
				"key" : "label",
				"value" : "SP5 p.Ala75Thr"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000204335"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000375281"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed18"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-16T20:50:01.733Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f26ad5b5e8ab4d14ebed16",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed17"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-16T20:50:01.733Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed0e")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed02")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed1e"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-14T18:29:13.671Z"),
	"role" : "participants",
	"identity" : "TST-041",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed19"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-12-14T18:29:13.671Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-041"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed1a"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-12-14T18:29:13.671Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-14T18:29:13.671"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed1b"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-12-19T21:22:07.004Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-19T21:22:07.004"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed1c"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-12-19T21:51:22.642Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-19T21:51:22.642"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed1d"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-12-20T16:58:46.273Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-20T16:58:46.273"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed1f"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "samples",
	"identity" : "TST041BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed20"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST041BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed23"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f26ad5b5e8ab4d14ebed21",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed22"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed26"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f26ad5b5e8ab4d14ebed24",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed25"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed29"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "observations",
	"name" : "RGPD8 p.Pro1620Ala",
	"identity" : "53f26ad5b5e8ab4d14ebed27",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed28"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro1620Ala"
			},
			{
				"key" : "geneName",
				"value" : "RGPD8"
			},
			{
				"key" : "label",
				"value" : "RGPD8 p.Pro1620Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169629"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000302558"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed2c"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f26ad5b5e8ab4d14ebed2a",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed2b"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1f")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed2d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "samples",
	"identity" : "TST041BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed2e"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST041BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed31"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f26ad5b5e8ab4d14ebed2f",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed30"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed2d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed34"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f26ad5b5e8ab4d14ebed32",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed33"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed2d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed37"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "observations",
	"name" : "RGPD8 p.Pro1620Ala",
	"identity" : "53f26ad5b5e8ab4d14ebed35",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed36"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed2d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
			},
			{
				"key" : "aminoAcidMutation",
				"value" : "p.Pro1620Ala"
			},
			{
				"key" : "geneName",
				"value" : "RGPD8"
			},
			{
				"key" : "label",
				"value" : "RGPD8 p.Pro1620Ala"
			},
			{
				"key" : "geneId",
				"value" : "ENSG00000169629"
			},
			{
				"key" : "transcriptId",
				"value" : "ENST00000302558"
			}
		]
	}
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed3a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-20T22:25:42.437Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f26ad5b5e8ab4d14ebed38",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed39"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-20T22:25:42.437Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed2d")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed1e")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed40"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-18T21:02:07.374Z"),
	"role" : "participants",
	"identity" : "TST-042",
	"steps" : [
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed3b"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84a"),
			"stepDate" : ISODate("2014-12-18T21:02:07.374Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-042"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed3c"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84b"),
			"stepDate" : ISODate("2014-12-18T21:02:07.374Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-18T21:02:07.374"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed3d"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84c"),
			"stepDate" : ISODate("2014-12-21T14:36:04.752Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-21T14:36:04.752"
			}
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed3e"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84d"),
			"stepDate" : ISODate("2014-12-21T15:43:23.337Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-21T15:43:23.337"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f26ad5b5e8ab4d14ebed3f"),
			"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe84e"),
			"stepDate" : ISODate("2014-12-21T18:50:21.573Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-21T18:50:21.573"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed41"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-21T21:50:26.845Z"),
	"role" : "samples",
	"identity" : "TST042BIOXPAR1",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed42"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-21T21:50:26.845Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST042BIOXPAR1"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed40")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed45"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-21T21:50:26.845Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f26ad5b5e8ab4d14ebed43",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed44"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-21T21:50:26.845Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed41")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed40")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed46"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-21T21:50:26.845Z"),
	"role" : "samples",
	"identity" : "TST042BIOXPAR2",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed47"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe853"),
		"stepDate" : ISODate("2014-12-21T21:50:26.845Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "identifier",
				"identity" : "TST042BIOXPAR2"
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed40")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed4a"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-21T21:50:26.845Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f26ad5b5e8ab4d14ebed48",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed49"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-21T21:50:26.845Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed46")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed40")
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
	"_id" : ObjectId("53f26ad5b5e8ab4d14ebed4d"),
	"studyId" : ObjectId("53f26ad4b5e8ab4d14ebe849"),
	"lastModified" : ISODate("2014-12-21T21:50:26.845Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f26ad5b5e8ab4d14ebed4b",
	"steps" : {
		"id" : ObjectId("53f26ad5b5e8ab4d14ebed4c"),
		"stepRef" : ObjectId("53f26ad5b5e8ab4d14ebe857"),
		"stepDate" : ISODate("2014-12-21T21:50:26.845Z"),
		"stepUser" : "swatt",
		"fields" : [
			{
				"key" : "sampleEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed46")
			},
			{
				"key" : "participantEntityRef",
				"ref" : ObjectId("53f26ad5b5e8ab4d14ebed40")
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
