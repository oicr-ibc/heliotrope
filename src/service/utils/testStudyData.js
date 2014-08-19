db.studies.drop();
db.steps.drop();
db.views.drop();
db.entities.drop();
db.createCollection('studies');
db.createCollection('steps');
db.createCollection('views');
db.createCollection('entities');
db.studies.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb45d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb45e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb45f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb460"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb461"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb462"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb463"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb464"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb465"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb466"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb467"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb468"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb469"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb46a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb46b"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
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
	"_id" : ObjectId("53f37dc8573f5ea6a2abb46c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "summary",
	"role" : "studies",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Number of participants</dt>\n  <dd>{{study.data.counts.participants}}</dd>\n  <dt>Number of samples</dt>\n  <dd>{{study.data.counts.samples}}</dd>\n  <dt>Observed mutations</dt>\n  <dd>{{study.data.counts.observations}}</dd>\n</dl>\n"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb46d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "participants",
	"role" : "studies",
	"label" : {
		"default" : "Participants"
	},
	"weight" : 100,
	"body" : "<div heli-study-entities role='participants' label='Participants'>\n</div>\n<br>\n"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb46e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "samples",
	"role" : "studies",
	"label" : {
		"default" : "Samples"
	},
	"weight" : 200,
	"body" : "<div heli-study-entities role='samples' label='Samples'>\n</div>\n<br>\n"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb46f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "summary",
	"role" : "participants",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Registered</dt>\n  <dd>{{entity.data.values.enrolmentDate | field}}</dd>\n  <dt>Consent</dt>\n  <dd>{{entity.data.values.consentDate | field}}</dd>\n  <dt>Biopsy</dt>\n  <dd>{{entity.data.values.biopsyDate | field}}</dd>\n  <dt>Pathology</dt>\n  <dd>{{entity.data.values.pathologyDate | field}}</dd>\n  <dt>Clinical lab</dt>\n  <dd>{{entity.data.values.clinicalLaboratoryDate | field}}</dd>\n  <dt>Research lab</dt>\n  <dd>{{entity.data.values.researchLaboratoryDate | field}}</dd>\n  <dt>Expert panel</dt>\n  <dd>{{entity.data.values.expertPanelDate | field}}</dd>\n</dl>\n"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb470"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "enrolment",
	"role" : "participants",
	"label" : {
		"default" : "Enrolment"
	},
	"weight" : 100,
	"body" : "<dl>\n  <dt>Registered</dt>\n  <dd>{{entity.data.values.enrolmentDate | field}}</dd>\n  <dt>Consent</dt>\n  <dd>{{entity.data.values.consentDate | field}}</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb471"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "samples",
	"role" : "participants",
	"label" : {
		"default" : "Samples"
	},
	"weight" : 200,
	"body" : "<table>\n  <thead></thead>\n  <tbody>\n    <tr ng-repeat='sample in entity.data.related.samples'>\n      <td><a href='/studies/{{entity.data.study.name | encodeURIComponent}}/{{sample.role | encodeURIComponent}}/{{sample.identity | encodeURIComponent}}'>{{sample.identity}}</a>\n    </tr>\n  <tbody>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb472"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "history",
	"role" : "participants",
	"label" : {
		"default" : "Clinical history"
	},
	"weight" : 300,
	"body" : "<div>\n{{entity.data.values.clinicalHistory | field}}\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb473"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "observations",
	"role" : "participants",
	"label" : {
		"default" : "Observations"
	},
	"weight" : 400,
	"body" : "<table heli-observations>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb474"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "steps",
	"role" : "participants",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb475"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "summary",
	"role" : "samples",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Requires collection</dt>\n  <dd>{{entity.data.values.requiresCollection | field}}</dd>\n  <dt>DNA quality</dt>\n  <dd>{{entity.data.values.dnaQuality | field}}</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb476"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "participants",
	"role" : "samples",
	"label" : {
		"default" : "Participant"
	},
	"weight" : 100,
	"body" : "<table>\n  <thead></thead>\n  <tbody>\n    <tr ng-repeat='participant in entity.data.related.participants'>\n      <td><a href='/studies/{{entity.data.study.name | encodeURIComponent}}/{{participant.role | encodeURIComponent}}/{{participant.identity | encodeURIComponent}}'>{{participant.identity}}</a>\n    </tr>\n  </tbody>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb477"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "observations",
	"role" : "samples",
	"label" : {
		"default" : "Observations"
	},
	"weight" : 400,
	"body" : "<table heli-observations>\n</table>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb478"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "steps",
	"role" : "samples",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb479"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "summary",
	"role" : "observations",
	"label" : {
		"default" : "Summary"
	},
	"weight" : 0,
	"body" : "<dl>\n  <dt>Gene name</dt>\n  <dd>{{entity.data.values.geneName | field}}</dd>\n  <dt>Ensembl gene id</dt>\n  <dd><a href='http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g={{entity.data.values.geneId | field}}' rel='external'>{{entity.data.values.geneId | field}}</a></dd>\n  <dt>Ensembl transcript id</dt>\n  <dd><a href='http://useast.ensembl.org/Homo_sapiens/Transcript/Summary?t={{entity.data.values.geneId | field}}' rel='external'>{{entity.data.values.transcriptId | field}}</a></dd>\n  <dt>Amino acid mutation</dt>\n  <dd ng-show='entity.data.values.aminoAcidMutation'>{{entity.data.values.aminoAcidMutation | field}}</dd>\n  <dd ng-hide='entity.data.values.aminoAcidMutation'>Not available</dd>\n  <dt>DNA mutation</dt>\n  <dd>{{entity.data.values.dnaMutation | field}}</dd>\n  <dt>Depth</dt>\n  <dd>{{entity.data.values.depth | field}}</dd>\n  <dt>Open in knowledge base</dt>\n  <dd heli-knowledge-base-search term='entity.data.values.geneName.value + &quot;+&quot; + (entity.data.values.aminoAcidMutation.value || entity.data.values.dnaMutation.value)' entity='entity'>Not available</dd>\n</dl>"
});
db.views.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb47a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"name" : "steps",
	"role" : "observations",
	"label" : {
		"default" : "Steps"
	},
	"weight" : 500,
	"body" : "<div>\n<div heli-entity-steps></div>\n</div>"
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb480"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-07-28T18:01:42.668Z"),
	"role" : "participants",
	"identity" : "TST-001",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb47b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-07-28T18:01:42.668Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-001"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb47c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-07-28T18:01:42.668Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-07-28T18:01:42.668"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb47d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-07-29T19:00:24.041Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-07-29T19:00:24.041"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb47e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-07-29T20:33:08.897Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-07-29T20:33:08.897"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb47f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-07-30T20:30:23.950Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-07-30T20:30:23.950"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb481"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-07-30T21:15:20.638Z"),
	"role" : "samples",
	"identity" : "TST001BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb482"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-07-30T21:15:20.638Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST001BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb480")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb485"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-07-30T21:15:20.638Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f37dc8573f5ea6a2abb483",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb484"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-07-30T21:15:20.638Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb481")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb480")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb488"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-07-30T21:15:20.638Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37dc8573f5ea6a2abb486",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb487"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-07-30T21:15:20.638Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb481")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb480")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb489"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-07-30T21:15:20.638Z"),
	"role" : "samples",
	"identity" : "TST001BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb48a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-07-30T21:15:20.638Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST001BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb480")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb48d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-07-30T21:15:20.638Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f37dc8573f5ea6a2abb48b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb48c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-07-30T21:15:20.638Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb489")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb480")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb490"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-07-30T21:15:20.638Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37dc8573f5ea6a2abb48e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb48f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-07-30T21:15:20.638Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb489")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb480")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb496"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-07-31T18:12:01.911Z"),
	"role" : "participants",
	"identity" : "TST-002",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb491"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-07-31T18:12:01.911Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-002"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb492"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-07-31T18:12:01.911Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-07-31T18:12:01.911"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb493"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-01T20:25:29.424Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-01T20:25:29.424"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb494"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-01T21:32:01.658Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-01T21:32:01.658"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb495"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-08-03T13:06:38.090Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-03T13:06:38.090"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb497"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "samples",
	"identity" : "TST002BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb498"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST002BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb49b"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f37dc8573f5ea6a2abb499",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb49a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb497")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb49e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f37dc8573f5ea6a2abb49c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb49d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb497")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4a1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37dc8573f5ea6a2abb49f",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4a0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb497")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4a4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37dc8573f5ea6a2abb4a2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4a3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb497")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4a7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "PARG p.Ala99Thr",
	"identity" : "53f37dc8573f5ea6a2abb4a5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4a6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb497")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4a8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "samples",
	"identity" : "TST002BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4a9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST002BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4ac"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f37dc8573f5ea6a2abb4aa",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4ab"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4a8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4af"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg150Trp",
	"identity" : "53f37dc8573f5ea6a2abb4ad",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4ae"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4a8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4b2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f37dc8573f5ea6a2abb4b0",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4b1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4a8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4b5"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37dc8573f5ea6a2abb4b3",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4b4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4a8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4b8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37dc8573f5ea6a2abb4b6",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4b7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4a8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4bb"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-03T19:48:33.711Z"),
	"role" : "observations",
	"name" : "PARG p.Ala99Thr",
	"identity" : "53f37dc8573f5ea6a2abb4b9",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4ba"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-03T19:48:33.711Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4a8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb496")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4c1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-06T13:18:44.808Z"),
	"role" : "participants",
	"identity" : "TST-003",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4bc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-06T13:18:44.808Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-003"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4bd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-06T13:18:44.808Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-06T13:18:44.808"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4be"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-07T20:29:39.917Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-07T20:29:39.917"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4bf"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-07T21:41:42.629Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-07T21:41:42.629"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4c0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-08-08T14:29:08.349Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-08T14:29:08.349"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4c2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "samples",
	"identity" : "TST003BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4c3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST003BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4c6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f37dc8573f5ea6a2abb4c4",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4c5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4c9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37dc8573f5ea6a2abb4c7",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4c8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4cc"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb4ca",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4cb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4cf"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "EGFR p.Ala244Val",
	"identity" : "53f37dc8573f5ea6a2abb4cd",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4ce"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
				},
				{
					"key" : "aminoAcidMutation",
					"value" : "p.Ala244Val"
				},
				{
					"key" : "geneName",
					"value" : "EGFR"
				},
				{
					"key" : "label",
					"value" : "EGFR p.Ala244Val"
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4d2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu135Gly",
	"identity" : "53f37dc8573f5ea6a2abb4d0",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4d1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4d5"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f37dc8573f5ea6a2abb4d3",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4d4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4d8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f37dc8573f5ea6a2abb4d6",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4d7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4db"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb4d9",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4da"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4dc"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "samples",
	"identity" : "TST003BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4dd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST003BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4e0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Cys",
	"identity" : "53f37dc8573f5ea6a2abb4de",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4df"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4e3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37dc8573f5ea6a2abb4e1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4e2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4e6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Pro323His",
	"identity" : "53f37dc8573f5ea6a2abb4e4",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4e5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4e9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb4e7",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4e8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4ec"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "EGFR p.Ala244Val",
	"identity" : "53f37dc8573f5ea6a2abb4ea",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4eb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
				},
				{
					"key" : "aminoAcidMutation",
					"value" : "p.Ala244Val"
				},
				{
					"key" : "geneName",
					"value" : "EGFR"
				},
				{
					"key" : "label",
					"value" : "EGFR p.Ala244Val"
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4ef"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu135Gly",
	"identity" : "53f37dc8573f5ea6a2abb4ed",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4ee"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4f2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f37dc8573f5ea6a2abb4f0",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4f1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4f5"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f37dc8573f5ea6a2abb4f3",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4f4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4f8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-08T20:07:22.981Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb4f6",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4f7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-08T20:07:22.981Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4dc")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4c1")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4fe"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-06T13:21:43.465Z"),
	"role" : "participants",
	"identity" : "TST-004",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4f9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-06T13:21:43.465Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-004"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4fa"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-06T13:21:43.465Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-06T13:21:43.465"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4fb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-07T15:52:20.996Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-07T15:52:20.996"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4fc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-07T18:31:16.915Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-07T18:31:16.915"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb4fd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-08-10T16:11:20.785Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-10T16:11:20.785"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb4ff"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-10T20:11:40.944Z"),
	"role" : "samples",
	"identity" : "TST004BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb500"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-10T20:11:40.944Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST004BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4fe")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb501"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-10T20:11:40.944Z"),
	"role" : "samples",
	"identity" : "TST004BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb502"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-10T20:11:40.944Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST004BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4fe")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb505"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-10T20:11:40.944Z"),
	"role" : "observations",
	"name" : "TP53 p.His61Arg",
	"identity" : "53f37dc8573f5ea6a2abb503",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb504"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-10T20:11:40.944Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb501")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb4fe")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb50b"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-06T21:44:33.761Z"),
	"role" : "participants",
	"identity" : "TST-005",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb506"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-06T21:44:33.761Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-005"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb507"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-06T21:44:33.761Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-06T21:44:33.761"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb508"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-07T19:14:50.912Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-07T19:14:50.912"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb509"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-07T21:56:49.836Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-07T21:56:49.836"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb50a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-08-09T18:17:00.118Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-09T18:17:00.118"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb50c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "samples",
	"identity" : "TST005BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb50d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST005BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb523"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "samples",
	"identity" : "TST005BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb524"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST005BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb510"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f37dc8573f5ea6a2abb50e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb50f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb513"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "PTPLA p.Glu29Lys",
	"identity" : "53f37dc8573f5ea6a2abb511",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb512"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb516"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f37dc8573f5ea6a2abb514",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb515"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb519"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37dc8573f5ea6a2abb517",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb518"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb51c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f37dc8573f5ea6a2abb51a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb51b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb51f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f37dc8573f5ea6a2abb51d",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb51e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb522"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu726Lys",
	"identity" : "53f37dc8573f5ea6a2abb520",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb521"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb527"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "PTPLA p.Val35Phe",
	"identity" : "53f37dc8573f5ea6a2abb525",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb526"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb523")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb52a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "PTPLA p.Glu29Lys",
	"identity" : "53f37dc8573f5ea6a2abb528",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb529"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb523")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb52d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f37dc8573f5ea6a2abb52b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb52c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb523")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb530"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37dc8573f5ea6a2abb52e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb52f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb523")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb533"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Gly118Asp",
	"identity" : "53f37dc8573f5ea6a2abb531",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb532"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb523")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb536"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f37dc8573f5ea6a2abb534",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb535"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb523")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb539"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-09T21:19:06.640Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu726Lys",
	"identity" : "53f37dc8573f5ea6a2abb537",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb538"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-09T21:19:06.640Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb523")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb50b")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb53f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-10T18:50:33Z"),
	"role" : "participants",
	"identity" : "TST-006",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb53a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-10T18:50:33Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-006"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb53b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-10T18:50:33Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-10T18:50:33.000"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb53c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-10T21:21:44.071Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-10T21:21:44.071"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb53d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-10T21:29:40.232Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-10T21:29:40.232"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb53e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-08-12T15:46:46.439Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-12T15:46:46.439"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb540"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-12T18:17:21.213Z"),
	"role" : "samples",
	"identity" : "TST006BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb541"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-12T18:17:21.213Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST006BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb53f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb544"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-12T18:17:21.213Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gln",
	"identity" : "53f37dc8573f5ea6a2abb542",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb543"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-12T18:17:21.213Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb540")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb53f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb545"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-12T18:17:21.213Z"),
	"role" : "samples",
	"identity" : "TST006BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb546"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-12T18:17:21.213Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST006BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb53f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb549"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-12T18:17:21.213Z"),
	"role" : "observations",
	"name" : "PTEN p.Arg130Gln",
	"identity" : "53f37dc8573f5ea6a2abb547",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb548"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-12T18:17:21.213Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb545")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb53f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb54f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-16T18:45:38.169Z"),
	"role" : "participants",
	"identity" : "TST-007",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb54a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-16T18:45:38.169Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-007"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb54b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-16T18:45:38.169Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-16T18:45:38.169"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb54c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-18T17:13:49.126Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-18T17:13:49.126"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb54d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-18T21:47:29.852Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-18T21:47:29.852"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb54e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-08-20T21:24:50.627Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-20T21:24:50.627"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb550"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "samples",
	"identity" : "TST007BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb551"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST007BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb554"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37dc8573f5ea6a2abb552",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb553"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb550")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb557"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb555",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb556"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb550")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb55a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Ala337Val",
	"identity" : "53f37dc8573f5ea6a2abb558",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb559"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb550")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb55d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37dc8573f5ea6a2abb55b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb55c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb550")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb55e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "samples",
	"identity" : "TST007BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb55f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST007BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb562"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37dc8573f5ea6a2abb560",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb561"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb55e")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb565"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb563",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb564"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb55e")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb568"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-21T15:25:17.669Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Ala337Val",
	"identity" : "53f37dc8573f5ea6a2abb566",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb567"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-21T15:25:17.669Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb55e")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb54f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb56e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-22T17:41:21.186Z"),
	"role" : "participants",
	"identity" : "TST-008",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb569"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-22T17:41:21.186Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-008"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb56a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-22T17:41:21.186Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-22T17:41:21.186"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb56b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-25T15:21:35.447Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-25T15:21:35.447"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb56c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-25T15:57:22.157Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-25T15:57:22.157"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb56d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-08-27T18:35:35.871Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-27T18:35:35.871"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb56f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-27T19:24:22.424Z"),
	"role" : "samples",
	"identity" : "TST008BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb570"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-27T19:24:22.424Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST008BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb56e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb573"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-27T19:24:22.424Z"),
	"role" : "observations",
	"name" : "PARG p.Ala99Thr",
	"identity" : "53f37dc8573f5ea6a2abb571",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb572"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-27T19:24:22.424Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb56f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb56e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb576"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-27T19:24:22.424Z"),
	"role" : "observations",
	"name" : "KRAS p.Gln61His",
	"identity" : "53f37dc8573f5ea6a2abb574",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb575"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-27T19:24:22.424Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb56f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb56e")
				},
				{
					"key" : "aminoAcidMutation",
					"value" : "p.Gln61His"
				},
				{
					"key" : "geneName",
					"value" : "KRAS"
				},
				{
					"key" : "label",
					"value" : "KRAS p.Gln61His"
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb577"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-27T19:24:22.424Z"),
	"role" : "samples",
	"identity" : "TST008BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb578"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-27T19:24:22.424Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST008BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb56e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb57b"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-27T19:24:22.424Z"),
	"role" : "observations",
	"name" : "PARG p.Ala99Thr",
	"identity" : "53f37dc8573f5ea6a2abb579",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb57a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-27T19:24:22.424Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb577")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb56e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb57e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-27T19:24:22.424Z"),
	"role" : "observations",
	"name" : "KRAS p.Gln61His",
	"identity" : "53f37dc8573f5ea6a2abb57c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb57d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-27T19:24:22.424Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb577")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb56e")
				},
				{
					"key" : "aminoAcidMutation",
					"value" : "p.Gln61His"
				},
				{
					"key" : "geneName",
					"value" : "KRAS"
				},
				{
					"key" : "label",
					"value" : "KRAS p.Gln61His"
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb584"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-26T18:52:34.095Z"),
	"role" : "participants",
	"identity" : "TST-009",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb57f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-26T18:52:34.095Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-009"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb580"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-26T18:52:34.095Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-26T18:52:34.095"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb581"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-27T13:41:28.887Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-27T13:41:28.887"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb582"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-27T21:34:35.038Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-27T21:34:35.038"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb583"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-08-29T19:13:48.957Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-08-29T19:13:48.957"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb585"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-29T20:54:36.923Z"),
	"role" : "samples",
	"identity" : "TST009BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb586"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-29T20:54:36.923Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST009BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb584")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb589"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-29T20:54:36.923Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37dc8573f5ea6a2abb587",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb588"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-29T20:54:36.923Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb585")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb584")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb58a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-29T20:54:36.923Z"),
	"role" : "samples",
	"identity" : "TST009BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb58b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-08-29T20:54:36.923Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST009BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb584")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb58e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-29T20:54:36.923Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37dc8573f5ea6a2abb58c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb58d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-08-29T20:54:36.923Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb58a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb584")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb594"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-27T18:45:26.369Z"),
	"role" : "participants",
	"identity" : "TST-010",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb58f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-27T18:45:26.369Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-010"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb590"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-27T18:45:26.369Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-27T18:45:26.369"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb591"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-27T21:29:10.659Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-27T21:29:10.659"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb592"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-27T21:55:38.235Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-27T21:55:38.235"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb593"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-01T16:44:18.229Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-01T16:44:18.229"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb595"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-01T19:34:49.411Z"),
	"role" : "samples",
	"identity" : "TST010BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb596"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-01T19:34:49.411Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST010BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb594")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb599"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-01T19:34:49.411Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37dc8573f5ea6a2abb597",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb598"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-01T19:34:49.411Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb595")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb594")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb59c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-01T19:34:49.411Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Val",
	"identity" : "53f37dc8573f5ea6a2abb59a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb59b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-01T19:34:49.411Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb595")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb594")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb59d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-01T19:34:49.411Z"),
	"role" : "samples",
	"identity" : "TST010BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb59e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-01T19:34:49.411Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST010BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb594")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5a1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-01T19:34:49.411Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37dc8573f5ea6a2abb59f",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5a0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-01T19:34:49.411Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb59d")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb594")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5a4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-01T19:34:49.411Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Val",
	"identity" : "53f37dc8573f5ea6a2abb5a2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5a3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-01T19:34:49.411Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb59d")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb594")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5aa"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-29T14:56:46.520Z"),
	"role" : "participants",
	"identity" : "TST-011",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5a5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-29T14:56:46.520Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-011"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5a6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-29T14:56:46.520Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-29T14:56:46.520"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5a7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-08-31T20:09:44.605Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-08-31T20:09:44.605"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5a8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-08-31T21:30:43.942Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-08-31T21:30:43.942"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5a9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-03T13:54:01.207Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-03T13:54:01.207"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5ab"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-03T13:58:21.016Z"),
	"role" : "samples",
	"identity" : "TST011BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5ac"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-03T13:58:21.016Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST011BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5aa")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5af"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-03T13:58:21.016Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37dc8573f5ea6a2abb5ad",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5ae"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-03T13:58:21.016Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5ab")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5aa")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5b2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-03T13:58:21.016Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37dc8573f5ea6a2abb5b0",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5b1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-03T13:58:21.016Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5ab")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5aa")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5b3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-03T13:58:21.016Z"),
	"role" : "samples",
	"identity" : "TST011BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5b4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-03T13:58:21.016Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST011BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5aa")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5b7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-03T13:58:21.016Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37dc8573f5ea6a2abb5b5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5b6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-03T13:58:21.016Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5b3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5aa")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5ba"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-03T13:58:21.016Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37dc8573f5ea6a2abb5b8",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5b9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-03T13:58:21.016Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5b3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5aa")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5c0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-08-31T21:24:25.208Z"),
	"role" : "participants",
	"identity" : "TST-012",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5bb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-08-31T21:24:25.208Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-012"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5bc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-08-31T21:24:25.208Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-08-31T21:24:25.208"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5bd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-04T15:55:36.788Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-04T15:55:36.788"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5be"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-04T18:04:51.548Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-04T18:04:51.548"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5bf"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-05T17:56:06.446Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-05T17:56:06.446"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5c1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-05T19:56:25.635Z"),
	"role" : "samples",
	"identity" : "TST012BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5c2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-05T19:56:25.635Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST012BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5c0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5c3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-05T19:56:25.635Z"),
	"role" : "samples",
	"identity" : "TST012BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5c4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-05T19:56:25.635Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST012BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5c0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5c7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-05T19:56:25.635Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f37dc8573f5ea6a2abb5c5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5c6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-05T19:56:25.635Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5c3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5c0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5cd"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-04T16:04:07.277Z"),
	"role" : "participants",
	"identity" : "TST-013",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5c8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-09-04T16:04:07.277Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-013"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5c9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-09-04T16:04:07.277Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-04T16:04:07.277"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5ca"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-05T14:31:51.177Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-05T14:31:51.177"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5cb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-05T17:10:41.903Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-05T17:10:41.903"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5cc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-06T19:58:02.182Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-06T19:58:02.182"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5ce"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-06T21:17:31.169Z"),
	"role" : "samples",
	"identity" : "TST013BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5cf"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-06T21:17:31.169Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST013BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5cd")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5d2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-06T21:17:31.169Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37dc8573f5ea6a2abb5d0",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5d1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-06T21:17:31.169Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5ce")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5cd")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5d5"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-06T21:17:31.169Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f37dc8573f5ea6a2abb5d3",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5d4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-06T21:17:31.169Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5ce")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5cd")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5d6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-06T21:17:31.169Z"),
	"role" : "samples",
	"identity" : "TST013BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5d7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-06T21:17:31.169Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST013BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5cd")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5da"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-06T21:17:31.169Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37dc8573f5ea6a2abb5d8",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5d9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-06T21:17:31.169Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5d6")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5cd")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5dd"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-06T21:17:31.169Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f37dc8573f5ea6a2abb5db",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5dc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-06T21:17:31.169Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5d6")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5cd")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5e3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-10T18:47:23.918Z"),
	"role" : "participants",
	"identity" : "TST-014",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5de"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-09-10T18:47:23.918Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-014"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5df"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-09-10T18:47:23.918Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-10T18:47:23.918"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5e0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-14T18:11:23.875Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-14T18:11:23.875"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5e1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-14T20:00:09.078Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-14T20:00:09.078"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5e2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-14T20:15:36.771Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-14T20:15:36.771"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5e4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-14T21:21:17.044Z"),
	"role" : "samples",
	"identity" : "TST014BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5e5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-14T21:21:17.044Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST014BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5e3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5e8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-14T21:21:17.044Z"),
	"role" : "observations",
	"name" : "NTSR2 p.Ala54Val",
	"identity" : "53f37dc8573f5ea6a2abb5e6",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5e7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-14T21:21:17.044Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5e4")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5e3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5eb"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-14T21:21:17.044Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37dc8573f5ea6a2abb5e9",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5ea"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-14T21:21:17.044Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5e4")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5e3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5ec"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-14T21:21:17.044Z"),
	"role" : "samples",
	"identity" : "TST014BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5ed"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-14T21:21:17.044Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST014BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5e3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5f0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-14T21:21:17.044Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37dc8573f5ea6a2abb5ee",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5ef"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-14T21:21:17.044Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5ec")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5e3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5f6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-15T19:19:18.029Z"),
	"role" : "participants",
	"identity" : "TST-015",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5f1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-09-15T19:19:18.029Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-015"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5f2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-09-15T19:19:18.029Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-15T19:19:18.029"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5f3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-17T14:43:01.238Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-17T14:43:01.238"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5f4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-17T21:45:09.221Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-17T21:45:09.221"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5f5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-20T19:00:14.444Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-20T19:00:14.444"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5f7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "samples",
	"identity" : "TST015BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5f8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST015BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5fb"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37dc8573f5ea6a2abb5f9",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5fa"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb5fe"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37dc8573f5ea6a2abb5fc",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb5fd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb601"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "MTX1 p.Thr63Ser",
	"identity" : "53f37dc8573f5ea6a2abb5ff",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb600"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb604"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Ala337Val",
	"identity" : "53f37dc8573f5ea6a2abb602",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb603"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb607"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f37dc8573f5ea6a2abb605",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb606"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb608"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "samples",
	"identity" : "TST015BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb609"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST015BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb60c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37dc8573f5ea6a2abb60a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb60b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb608")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb60f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "NEFH p.Glu645Lys",
	"identity" : "53f37dc8573f5ea6a2abb60d",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb60e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb608")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb612"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "MTX1 p.Thr63Ser",
	"identity" : "53f37dc8573f5ea6a2abb610",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb611"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb608")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb615"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Ala337Val",
	"identity" : "53f37dc8573f5ea6a2abb613",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb614"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb608")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb618"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:29:40.667Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Trp",
	"identity" : "53f37dc8573f5ea6a2abb616",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb617"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-20T21:29:40.667Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb608")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb5f6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb61e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T15:39:34.731Z"),
	"role" : "participants",
	"identity" : "TST-016",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb619"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-09-20T15:39:34.731Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-016"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb61a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-09-20T15:39:34.731Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-20T15:39:34.731"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb61b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-21T13:41:38.493Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-21T13:41:38.493"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb61c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-21T19:28:42.063Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-21T19:28:42.063"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb61d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-23T18:45:12.137Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-23T18:45:12.137"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb61f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "samples",
	"identity" : "TST016BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb620"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST016BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb623"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f37dc8573f5ea6a2abb621",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb622"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb626"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu135Gly",
	"identity" : "53f37dc8573f5ea6a2abb624",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb625"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb629"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "LATS2 p.Ala324Val",
	"identity" : "53f37dc8573f5ea6a2abb627",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb628"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb62c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37dc8573f5ea6a2abb62a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb62b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb62f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37dc8573f5ea6a2abb62d",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb62e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb632"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37dc8573f5ea6a2abb630",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb631"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb633"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "samples",
	"identity" : "TST016BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb634"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST016BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb637"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f37dc8573f5ea6a2abb635",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb636"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb633")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb63a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu135Gly",
	"identity" : "53f37dc8573f5ea6a2abb638",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb639"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb633")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb63d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37dc8573f5ea6a2abb63b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb63c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb633")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb640"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37dc8573f5ea6a2abb63e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb63f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb633")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb643"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T20:26:10.330Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37dc8573f5ea6a2abb641",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb642"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T20:26:10.330Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb633")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb61e")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb649"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T16:03:14.215Z"),
	"role" : "participants",
	"identity" : "TST-017",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb644"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-09-20T16:03:14.215Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-017"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb645"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-09-20T16:03:14.215Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-20T16:03:14.215"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb646"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-21T18:36:52.278Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-21T18:36:52.278"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb647"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-21T20:41:34.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-21T20:41:34.477"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb648"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-24T13:58:03.122Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-24T13:58:03.122"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb64a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-24T14:43:46.336Z"),
	"role" : "samples",
	"identity" : "TST017BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb64b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-24T14:43:46.336Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST017BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb649")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb64e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-24T14:43:46.336Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f37dc8573f5ea6a2abb64c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb64d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-24T14:43:46.336Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb64a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb649")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb64f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-24T14:43:46.336Z"),
	"role" : "samples",
	"identity" : "TST017BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb650"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-24T14:43:46.336Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST017BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb649")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb653"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-24T14:43:46.336Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f37dc8573f5ea6a2abb651",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb652"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-24T14:43:46.336Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb64f")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb649")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb659"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-20T21:43:34.566Z"),
	"role" : "participants",
	"identity" : "TST-018",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb654"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-09-20T21:43:34.566Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-018"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb655"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-09-20T21:43:34.566Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-20T21:43:34.566"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb656"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-21T20:09:58.838Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-21T20:09:58.838"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb657"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-21T21:31:22.291Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-21T21:31:22.291"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb658"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-23T18:18:55.399Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-23T18:18:55.399"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb65a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T21:43:06.549Z"),
	"role" : "samples",
	"identity" : "TST018BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb65b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-23T21:43:06.549Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST018BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb659")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb65e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T21:43:06.549Z"),
	"role" : "observations",
	"name" : "MTX1 p.Thr63Ser",
	"identity" : "53f37dc8573f5ea6a2abb65c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb65d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T21:43:06.549Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb65a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb659")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb661"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T21:43:06.549Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Gly",
	"identity" : "53f37dc8573f5ea6a2abb65f",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb660"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T21:43:06.549Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb65a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb659")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb662"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T21:43:06.549Z"),
	"role" : "samples",
	"identity" : "TST018BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb663"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-23T21:43:06.549Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST018BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb659")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb666"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T21:43:06.549Z"),
	"role" : "observations",
	"name" : "MTX1 p.Thr63Ser",
	"identity" : "53f37dc8573f5ea6a2abb664",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb665"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T21:43:06.549Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb662")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb659")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb669"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T21:43:06.549Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Gly",
	"identity" : "53f37dc8573f5ea6a2abb667",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb668"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-23T21:43:06.549Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb662")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb659")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb66f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-23T16:09:37.054Z"),
	"role" : "participants",
	"identity" : "TST-019",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb66a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-09-23T16:09:37.054Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-019"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb66b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-09-23T16:09:37.054Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-23T16:09:37.054"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb66c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-24T21:41:42.837Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-24T21:41:42.837"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb66d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-24T21:54:28.345Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-24T21:54:28.345"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb66e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-09-28T14:55:03.313Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-09-28T14:55:03.313"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb670"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-28T18:25:49.570Z"),
	"role" : "samples",
	"identity" : "TST019BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb671"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-28T18:25:49.570Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST019BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb66f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb674"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-28T18:25:49.570Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f37dc8573f5ea6a2abb672",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb673"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-28T18:25:49.570Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb670")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb66f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb675"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-28T18:25:49.570Z"),
	"role" : "samples",
	"identity" : "TST019BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb676"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-09-28T18:25:49.570Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST019BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb66f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb679"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-28T18:25:49.570Z"),
	"role" : "observations",
	"name" : "SBK2 p.Ala298Pro",
	"identity" : "53f37dc8573f5ea6a2abb677",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb678"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-09-28T18:25:49.570Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb675")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb66f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb67f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-09-27T15:15:48.488Z"),
	"role" : "participants",
	"identity" : "TST-020",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb67a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-09-27T15:15:48.488Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-020"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb67b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-09-27T15:15:48.488Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-09-27T15:15:48.488"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb67c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-09-30T15:37:45.217Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-09-30T15:37:45.217"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb67d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-09-30T20:54:52.672Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-09-30T20:54:52.672"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb67e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-03T15:16:12.248Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-03T15:16:12.248"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb680"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-03T20:39:58.699Z"),
	"role" : "samples",
	"identity" : "TST020BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb681"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-03T20:39:58.699Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST020BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb67f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb684"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-03T20:39:58.699Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37dc8573f5ea6a2abb682",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb683"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-03T20:39:58.699Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb680")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb67f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb685"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-03T20:39:58.699Z"),
	"role" : "samples",
	"identity" : "TST020BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb686"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-03T20:39:58.699Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST020BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb67f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb689"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-03T20:39:58.699Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37dc8573f5ea6a2abb687",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb688"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-03T20:39:58.699Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb685")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb67f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb68f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-01T14:52:07.981Z"),
	"role" : "participants",
	"identity" : "TST-021",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb68a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-01T14:52:07.981Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-021"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb68b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-01T14:52:07.981Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-01T14:52:07.981"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb68c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-10-05T14:07:39.182Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-05T14:07:39.182"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb68d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-10-05T21:13:21.366Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-05T21:13:21.366"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb68e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-07T16:07:22.098Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-07T16:07:22.098"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb690"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "samples",
	"identity" : "TST021BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb691"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST021BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb694"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37dc8573f5ea6a2abb692",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb693"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb690")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb697"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "LATS2 p.Ala324Val",
	"identity" : "53f37dc8573f5ea6a2abb695",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb696"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb690")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb69a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala41Thr",
	"identity" : "53f37dc8573f5ea6a2abb698",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb699"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb690")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb69d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f37dc8573f5ea6a2abb69b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb69c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb690")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6a0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f37dc8573f5ea6a2abb69e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb69f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb690")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6a3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f37dc8573f5ea6a2abb6a1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6a2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb690")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6a6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f37dc8573f5ea6a2abb6a4",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6a5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb690")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6a9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37dc8573f5ea6a2abb6a7",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6a8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb690")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6aa"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "samples",
	"identity" : "TST021BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6ab"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST021BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6ae"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37dc8573f5ea6a2abb6ac",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6ad"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6b1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "LATS2 p.Ala324Val",
	"identity" : "53f37dc8573f5ea6a2abb6af",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6b0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6b4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala41Thr",
	"identity" : "53f37dc8573f5ea6a2abb6b2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6b3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6b7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Arg",
	"identity" : "53f37dc8573f5ea6a2abb6b5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6b6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6ba"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f37dc8573f5ea6a2abb6b8",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6b9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6bd"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f37dc8573f5ea6a2abb6bb",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6bc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6c0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f37dc8573f5ea6a2abb6be",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6bf"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6c3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f37dc8573f5ea6a2abb6c1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6c2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6c6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-07T17:16:17.906Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37dc8573f5ea6a2abb6c4",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6c5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-07T17:16:17.906Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6aa")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb68f")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6cc"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-05T17:32:33.217Z"),
	"role" : "participants",
	"identity" : "TST-022",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6c7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-05T17:32:33.217Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-022"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6c8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-05T17:32:33.217Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-05T17:32:33.217"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6c9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-10-07T21:41:57.070Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-07T21:41:57.070"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6ca"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-10-07T21:44:33.582Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-07T21:44:33.582"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6cb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-09T21:41:22.042Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-09T21:41:22.042"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6cd"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-09T21:52:45.878Z"),
	"role" : "samples",
	"identity" : "TST022BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6ce"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-09T21:52:45.878Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST022BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6cc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6d1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-09T21:52:45.878Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37dc8573f5ea6a2abb6cf",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6d0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-09T21:52:45.878Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6cd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6cc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6d2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-09T21:52:45.878Z"),
	"role" : "samples",
	"identity" : "TST022BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6d3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-09T21:52:45.878Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST022BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6cc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6d6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-09T21:52:45.878Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37dc8573f5ea6a2abb6d4",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6d5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-09T21:52:45.878Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6d2")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6cc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6dc"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-11T16:04:03.661Z"),
	"role" : "participants",
	"identity" : "TST-023",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6d7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-11T16:04:03.661Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-023"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6d8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-11T16:04:03.661Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-11T16:04:03.661"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6d9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-10-14T19:14:52.096Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-14T19:14:52.096"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6da"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-10-14T20:13:23.593Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-14T20:13:23.593"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6db"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-17T14:04:25.280Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-17T14:04:25.280"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6dd"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "samples",
	"identity" : "TST023BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6de"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST023BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6e1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37dc8573f5ea6a2abb6df",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6e0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6e4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f37dc8573f5ea6a2abb6e2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6e3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6e7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f37dc8573f5ea6a2abb6e5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6e6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6ea"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "PGM5 p.Ile98Val",
	"identity" : "53f37dc8573f5ea6a2abb6e8",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6e9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6ed"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37dc8573f5ea6a2abb6eb",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6ec"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6f0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37dc8573f5ea6a2abb6ee",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6ef"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6f3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37dc8573f5ea6a2abb6f1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6f2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6f6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37dc8573f5ea6a2abb6f4",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6f5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6f9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37dc8573f5ea6a2abb6f7",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6f8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6fc"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "RGPD8 p.Pro1620Ala",
	"identity" : "53f37dc8573f5ea6a2abb6fa",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6fb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb6ff"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "LATS2 p.Ala324Val",
	"identity" : "53f37dc8573f5ea6a2abb6fd",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb6fe"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dd")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb700"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "samples",
	"identity" : "TST023BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb701"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST023BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb704"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Arg322Lys",
	"identity" : "53f37dc8573f5ea6a2abb702",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb703"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb729"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:16:26.120Z"),
	"role" : "samples",
	"identity" : "TST024BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb72a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-15T20:16:26.120Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST024BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb728")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb707"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "ARHGAP5 p.Val474Ala",
	"identity" : "53f37dc8573f5ea6a2abb705",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb706"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb70a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "TP53 p.His179Arg",
	"identity" : "53f37dc8573f5ea6a2abb708",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb709"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb70d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "PGM5 p.Ile98Val",
	"identity" : "53f37dc8573f5ea6a2abb70b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb70c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb710"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "NBPF10 p.Glu3455Lys",
	"identity" : "53f37dc8573f5ea6a2abb70e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb70f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb713"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37dc8573f5ea6a2abb711",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb712"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb716"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37dc8573f5ea6a2abb714",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb715"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb719"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37dc8573f5ea6a2abb717",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb718"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb71c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37dc8573f5ea6a2abb71a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb71b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb71f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "RGPD8 p.Pro1620Ala",
	"identity" : "53f37dc8573f5ea6a2abb71d",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb71e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb722"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-17T18:32:10.477Z"),
	"role" : "observations",
	"name" : "LATS2 p.Ala324Val",
	"identity" : "53f37dc8573f5ea6a2abb720",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb721"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-17T18:32:10.477Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb700")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb6dc")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb728"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-12T19:18:55.093Z"),
	"role" : "participants",
	"identity" : "TST-024",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb723"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-12T19:18:55.093Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-024"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb724"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-12T19:18:55.093Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-12T19:18:55.093"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb725"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-10-14T17:00:23.776Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-14T17:00:23.776"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb726"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-10-14T19:53:38.901Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-14T19:53:38.901"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb727"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-15T15:25:39.964Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-15T15:25:39.964"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb72d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:16:26.120Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37dc8573f5ea6a2abb72b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb72c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-15T20:16:26.120Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb729")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb728")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb730"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:16:26.120Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37dc8573f5ea6a2abb72e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb72f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-15T20:16:26.120Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb729")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb728")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb733"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:16:26.120Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f37dc8573f5ea6a2abb731",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb732"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-15T20:16:26.120Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb729")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb728")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb734"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:16:26.120Z"),
	"role" : "samples",
	"identity" : "TST024BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb735"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-15T20:16:26.120Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST024BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb728")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb738"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:16:26.120Z"),
	"role" : "observations",
	"name" : "FBXW7 p.Arg347Cys",
	"identity" : "53f37dc8573f5ea6a2abb736",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb737"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-15T20:16:26.120Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb734")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb728")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb73b"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:16:26.120Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37dc8573f5ea6a2abb739",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb73a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-15T20:16:26.120Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb734")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb728")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb73e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:16:26.120Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f37dc8573f5ea6a2abb73c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb73d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-15T20:16:26.120Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb734")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb728")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb744"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-15T20:57:03.992Z"),
	"role" : "participants",
	"identity" : "TST-025",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb73f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-15T20:57:03.992Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-025"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb740"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-15T20:57:03.992Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-15T20:57:03.992"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb741"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-10-18T16:54:55.876Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-18T16:54:55.876"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb742"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-10-18T18:49:06.848Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-18T18:49:06.848"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb743"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-20T16:47:02.930Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-20T16:47:02.930"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb745"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-20T21:23:36.781Z"),
	"role" : "samples",
	"identity" : "TST025BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb746"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-20T21:23:36.781Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST025BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb744")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb749"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-20T21:23:36.781Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37dc8573f5ea6a2abb747",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb748"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-20T21:23:36.781Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb745")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb744")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb74a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-20T21:23:36.781Z"),
	"role" : "samples",
	"identity" : "TST025BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb74b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-20T21:23:36.781Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST025BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb744")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb74e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-20T21:23:36.781Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37dc8573f5ea6a2abb74c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb74d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-20T21:23:36.781Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb74a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb744")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb754"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-21T13:02:36.545Z"),
	"role" : "participants",
	"identity" : "TST-026",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb74f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-21T13:02:36.545Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-026"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb750"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-21T13:02:36.545Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-21T13:02:36.545"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb751"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-10-22T13:01:32.759Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-22T13:01:32.759"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb752"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-10-22T21:55:56.844Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-22T21:55:56.844"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb753"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-23T19:58:03.621Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-23T19:58:03.621"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb755"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-23T21:39:15.383Z"),
	"role" : "samples",
	"identity" : "TST026BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb756"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-23T21:39:15.383Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST026BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb754")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb759"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-23T21:39:15.383Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f37dc8573f5ea6a2abb757",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb758"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-23T21:39:15.383Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb755")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb754")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb75a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-23T21:39:15.383Z"),
	"role" : "samples",
	"identity" : "TST026BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb75b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-23T21:39:15.383Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST026BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb754")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb75e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-23T21:39:15.383Z"),
	"role" : "observations",
	"name" : "SP5 p.Ala75Thr",
	"identity" : "53f37dc8573f5ea6a2abb75c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb75d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-23T21:39:15.383Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb75a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb754")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb764"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-26T20:31:07.402Z"),
	"role" : "participants",
	"identity" : "TST-027",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb75f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-26T20:31:07.402Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-027"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb760"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-26T20:31:07.402Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-26T20:31:07.402"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb761"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-10-27T20:26:09.275Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-27T20:26:09.275"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb762"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-10-27T21:05:00.090Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-27T21:05:00.090"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb763"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-29T21:15:23.834Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-29T21:15:23.834"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb765"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-29T21:43:21.245Z"),
	"role" : "samples",
	"identity" : "TST027BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb766"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-29T21:43:21.245Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST027BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb764")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb769"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-29T21:43:21.245Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37dc8573f5ea6a2abb767",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb768"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-29T21:43:21.245Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb765")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb764")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb76a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-29T21:43:21.245Z"),
	"role" : "samples",
	"identity" : "TST027BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb76b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-29T21:43:21.245Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST027BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb764")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb76e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-29T21:43:21.245Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37dc8573f5ea6a2abb76c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb76d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-29T21:43:21.245Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb76a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb764")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb774"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-27T14:59:24.328Z"),
	"role" : "participants",
	"identity" : "TST-028",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb76f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-27T14:59:24.328Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-028"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb770"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-27T14:59:24.328Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-27T14:59:24.328"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb771"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-10-29T17:09:34.808Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-10-29T17:09:34.808"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb772"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-10-29T19:42:06.231Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-10-29T19:42:06.231"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb773"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-10-31T21:10:42.616Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-10-31T21:10:42.616"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb775"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-31T21:55:57.602Z"),
	"role" : "samples",
	"identity" : "TST028BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb776"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-31T21:55:57.602Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST028BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb774")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb779"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-31T21:55:57.602Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f37dc8573f5ea6a2abb777",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb778"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-31T21:55:57.602Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb775")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb774")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb77a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-31T21:55:57.602Z"),
	"role" : "samples",
	"identity" : "TST028BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb77b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-10-31T21:55:57.602Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST028BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb774")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb77e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-31T21:55:57.602Z"),
	"role" : "observations",
	"name" : "LATS2 p.Gly363Ser",
	"identity" : "53f37dc8573f5ea6a2abb77c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb77d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-10-31T21:55:57.602Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb77a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb774")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb784"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-10-31T17:54:55.053Z"),
	"role" : "participants",
	"identity" : "TST-029",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb77f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-10-31T17:54:55.053Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-029"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb780"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-10-31T17:54:55.053Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-10-31T17:54:55.053"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb781"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-11-02T20:31:01.104Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-02T20:31:01.104"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb782"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-11-02T22:31:44.351Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-02T22:31:44.351"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb783"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-11-04T14:47:17.539Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-04T14:47:17.539"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb785"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-04T19:01:49.375Z"),
	"role" : "samples",
	"identity" : "TST029BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb786"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-04T19:01:49.375Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST029BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb784")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb789"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-04T19:01:49.375Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37dc8573f5ea6a2abb787",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb788"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-04T19:01:49.375Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb785")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb784")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb78a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-04T19:01:49.375Z"),
	"role" : "samples",
	"identity" : "TST029BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb78b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-04T19:01:49.375Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST029BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb784")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb78e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-04T19:01:49.375Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37dc8573f5ea6a2abb78c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb78d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-04T19:01:49.375Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb78a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb784")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb794"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-04T15:05:00.390Z"),
	"role" : "participants",
	"identity" : "TST-030",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb78f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-11-04T15:05:00.390Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-030"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb790"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-11-04T15:05:00.390Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-04T15:05:00.390"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb791"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-11-06T19:39:48.943Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-06T19:39:48.943"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb792"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-11-06T20:43:57.872Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-06T20:43:57.872"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb793"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-11-09T16:19:46.350Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-09T16:19:46.350"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb795"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:54.035Z"),
	"role" : "samples",
	"identity" : "TST030BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb796"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-09T22:09:54.035Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST030BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb794")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb799"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:54.035Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37dc8573f5ea6a2abb797",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb798"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-09T22:09:54.035Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb795")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb794")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb79c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:54.035Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37dc8573f5ea6a2abb79a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb79b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-09T22:09:54.035Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb795")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb794")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb79f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:54.035Z"),
	"role" : "observations",
	"name" : "DOT1L p.Gly266Ser",
	"identity" : "53f37dc8573f5ea6a2abb79d",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb79e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-09T22:09:54.035Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb795")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb794")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7a0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:54.035Z"),
	"role" : "samples",
	"identity" : "TST030BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7a1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-09T22:09:54.035Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST030BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb794")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7a4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:54.035Z"),
	"role" : "observations",
	"name" : "ZNF837 p.Ala242Thr",
	"identity" : "53f37dc8573f5ea6a2abb7a2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7a3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-09T22:09:54.035Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7a0")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb794")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7a7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:54.035Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37dc8573f5ea6a2abb7a5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7a6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-09T22:09:54.035Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7a0")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb794")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7aa"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:54.035Z"),
	"role" : "observations",
	"name" : "DOT1L p.Gly266Ser",
	"identity" : "53f37dc8573f5ea6a2abb7a8",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7a9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-09T22:09:54.035Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7a0")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb794")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7b0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-09T22:09:59.495Z"),
	"role" : "participants",
	"identity" : "TST-031",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ab"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-11-09T22:09:59.495Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-031"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ac"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-11-09T22:09:59.495Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-09T22:09:59.495"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ad"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-11-11T21:21:55.075Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-11T21:21:55.075"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ae"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-11-11T21:55:12.696Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-11T21:55:12.696"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7af"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-11-12T17:09:12.965Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-12T17:09:12.965"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7b1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-12T18:21:04.307Z"),
	"role" : "samples",
	"identity" : "TST031BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7b2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-12T18:21:04.307Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST031BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7b5"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-12T18:21:04.307Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37dc8573f5ea6a2abb7b3",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7b4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-12T18:21:04.307Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b1")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7b8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-12T18:21:04.307Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37dc8573f5ea6a2abb7b6",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7b7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-12T18:21:04.307Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b1")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7b9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-12T18:21:04.307Z"),
	"role" : "samples",
	"identity" : "TST031BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ba"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-12T18:21:04.307Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST031BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7bd"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-12T18:21:04.307Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Asp404Glu",
	"identity" : "53f37dc8573f5ea6a2abb7bb",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7bc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-12T18:21:04.307Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b9")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7c0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-12T18:21:04.307Z"),
	"role" : "observations",
	"name" : "GSG2 p.Arg82Cys",
	"identity" : "53f37dc8573f5ea6a2abb7be",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7bf"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-12T18:21:04.307Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b9")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7b0")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7c6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-11T14:02:58.088Z"),
	"role" : "participants",
	"identity" : "TST-032",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7c1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-11-11T14:02:58.088Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-032"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7c2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-11-11T14:02:58.088Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-11T14:02:58.088"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7c3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-11-13T16:57:11.236Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-13T16:57:11.236"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7c4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-11-13T18:21:41.650Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-13T18:21:41.650"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7c5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-11-15T19:30:43.379Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-15T19:30:43.379"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7c7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "samples",
	"identity" : "TST032BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7c8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST032BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7cb"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37dc8573f5ea6a2abb7c9",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ca"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7ce"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37dc8573f5ea6a2abb7cc",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7cd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7d1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f37dc8573f5ea6a2abb7cf",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7d0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7d4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb7d2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7d3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c7")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7d5"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "samples",
	"identity" : "TST032BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7d6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST032BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7d9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "observations",
	"name" : "HRAS p.Gln61Arg",
	"identity" : "53f37dc8573f5ea6a2abb7d7",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7d8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7d5")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7dc"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Ala",
	"identity" : "53f37dc8573f5ea6a2abb7da",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7db"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7d5")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7df"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f37dc8573f5ea6a2abb7dd",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7de"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7d5")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7e2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-16T14:49:53.012Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb7e0",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7e1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-16T14:49:53.012Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7d5")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7c6")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7e8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-17T18:46:52.873Z"),
	"role" : "participants",
	"identity" : "TST-033",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7e3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-11-17T18:46:52.873Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-033"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7e4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-11-17T18:46:52.873Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-17T18:46:52.873"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7e5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-11-18T20:35:56.933Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-18T20:35:56.933"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7e6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-11-18T22:25:07.003Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-18T22:25:07.003"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7e7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-11-21T20:39:41.771Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-21T20:39:41.771"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7e9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-21T21:31:26.049Z"),
	"role" : "samples",
	"identity" : "TST033BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ea"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-21T21:31:26.049Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST033BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7e8")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7ed"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-21T21:31:26.049Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37dc8573f5ea6a2abb7eb",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ec"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-21T21:31:26.049Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7e9")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7e8")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7ee"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-21T21:31:26.049Z"),
	"role" : "samples",
	"identity" : "TST033BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ef"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-21T21:31:26.049Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST033BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7e8")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7f2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-21T21:31:26.049Z"),
	"role" : "observations",
	"name" : "TP53 p.Cys83Phe",
	"identity" : "53f37dc8573f5ea6a2abb7f0",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7f1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-21T21:31:26.049Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7ee")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7e8")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7f8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-22T20:49:28.758Z"),
	"role" : "participants",
	"identity" : "TST-034",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7f3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-11-22T20:49:28.758Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-034"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7f4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-11-22T20:49:28.758Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-22T20:49:28.758"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7f5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-11-25T21:07:10.839Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-25T21:07:10.839"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7f6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-11-25T22:47:07.055Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-25T22:47:07.055"
				},
				{
					"key" : "biopsyCores",
					"value" : 6
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7f7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-11-26T17:04:30.617Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-11-26T17:04:30.617"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7f9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-26T22:30:12.717Z"),
	"role" : "samples",
	"identity" : "TST034BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7fa"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-26T22:30:12.717Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST034BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7f8")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7fd"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-26T22:30:12.717Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37dc8573f5ea6a2abb7fb",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7fc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-26T22:30:12.717Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7f9")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7f8")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb7fe"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-26T22:30:12.717Z"),
	"role" : "samples",
	"identity" : "TST034BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb7ff"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-11-26T22:30:12.717Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST034BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7f8")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb802"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-26T22:30:12.717Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37dc8573f5ea6a2abb800",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb801"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-11-26T22:30:12.717Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7fe")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb7f8")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb808"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-27T20:12:10.043Z"),
	"role" : "participants",
	"identity" : "TST-035",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb803"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-11-27T20:12:10.043Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-035"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb804"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-11-27T20:12:10.043Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-27T20:12:10.043"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb805"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-11-28T21:49:29.943Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-11-28T21:49:29.943"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb806"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-11-28T22:22:41.984Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-11-28T22:22:41.984"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb807"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-12-01T20:46:30.985Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-01T20:46:30.985"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb809"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "samples",
	"identity" : "TST035BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb80a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST035BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb80d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37dc8573f5ea6a2abb80b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb80c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb809")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb810"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f37dc8573f5ea6a2abb80e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb80f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb809")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb813"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "observations",
	"name" : "ZNF814 p.Gly320Glu",
	"identity" : "53f37dc8573f5ea6a2abb811",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb812"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb809")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb816"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37dc8573f5ea6a2abb814",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb815"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb809")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb817"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "samples",
	"identity" : "TST035BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb818"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST035BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb81b"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "observations",
	"name" : "OPRD1 p.Cys27Phe",
	"identity" : "53f37dc8573f5ea6a2abb819",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb81a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb817")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb81e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f37dc8573f5ea6a2abb81c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb81d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb817")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb821"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-01T21:32:46.930Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37dc8573f5ea6a2abb81f",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb820"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-01T21:32:46.930Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb817")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb808")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb827"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-11-30T22:22:23.144Z"),
	"role" : "participants",
	"identity" : "TST-036",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb822"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-11-30T22:22:23.144Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-036"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb823"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-11-30T22:22:23.144Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-11-30T22:22:23.144"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb824"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-12-03T17:11:33.715Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-03T17:11:33.715"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb825"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-12-03T17:46:08.047Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-03T17:46:08.047"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb826"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-12-05T18:21:46.101Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-05T18:21:46.101"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb828"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-05T21:46:30.211Z"),
	"role" : "samples",
	"identity" : "TST036BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb829"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-05T21:46:30.211Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST036BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb827")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb82c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-05T21:46:30.211Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37dc8573f5ea6a2abb82a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb82b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-05T21:46:30.211Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb828")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb827")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb82d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-05T21:46:30.211Z"),
	"role" : "samples",
	"identity" : "TST036BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb82e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-05T21:46:30.211Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST036BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb827")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb831"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-05T21:46:30.211Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37dc8573f5ea6a2abb82f",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb830"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-05T21:46:30.211Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb82d")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb827")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb837"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-05T19:39:38.447Z"),
	"role" : "participants",
	"identity" : "TST-037",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb832"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-12-05T19:39:38.447Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-037"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb833"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-12-05T19:39:38.447Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-05T19:39:38.447"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb834"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-12-06T14:06:49.665Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-06T14:06:49.665"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb835"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-12-06T20:24:22.580Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-06T20:24:22.580"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb836"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-12-08T21:01:48.083Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-08T21:01:48.083"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb838"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "samples",
	"identity" : "TST037BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb839"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST037BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb83c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f37dc8573f5ea6a2abb83a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb83b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb838")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb83f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f37dc8573f5ea6a2abb83d",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb83e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb838")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb842"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f37dc8573f5ea6a2abb840",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb841"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb838")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb843"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "samples",
	"identity" : "TST037BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb844"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST037BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb847"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Cys",
	"identity" : "53f37dc8573f5ea6a2abb845",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb846"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb843")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb84a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "observations",
	"name" : "FAM194B p.Glu136Lys",
	"identity" : "53f37dc8573f5ea6a2abb848",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb849"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb843")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb84d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly12Asp",
	"identity" : "53f37dc8573f5ea6a2abb84b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb84c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb843")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb850"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-08T22:28:18.955Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f37dc8573f5ea6a2abb84e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb84f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-08T22:28:18.955Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb843")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb837")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb856"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-11T17:54:05.809Z"),
	"role" : "participants",
	"identity" : "TST-038",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb851"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-12-11T17:54:05.809Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-038"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb852"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-12-11T17:54:05.809Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-11T17:54:05.809"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb853"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-12-13T14:46:37.592Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-13T14:46:37.592"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb854"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-12-13T19:26:26.808Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-13T19:26:26.808"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb855"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-12-15T16:34:57.933Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-15T16:34:57.933"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb857"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "samples",
	"identity" : "TST038BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb858"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST038BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb85b"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37dc8573f5ea6a2abb859",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb85a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb85e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f37dc8573f5ea6a2abb85c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb85d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb861"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala88Thr",
	"identity" : "53f37dc8573f5ea6a2abb85f",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb860"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
				},
				{
					"key" : "aminoAcidMutation",
					"value" : "p.Ala88Thr"
				},
				{
					"key" : "geneName",
					"value" : "FRG1B"
				},
				{
					"key" : "label",
					"value" : "FRG1B p.Ala88Thr"
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb864"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "PTPLA p.Glu29Lys",
	"identity" : "53f37dc8573f5ea6a2abb862",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb863"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb867"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "ANKLE1 p.Leu83Gln",
	"identity" : "53f37dc8573f5ea6a2abb865",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb866"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb86a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f37dc8573f5ea6a2abb868",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb869"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb86d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37dc8573f5ea6a2abb86b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb86c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb870"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f37dc8573f5ea6a2abb86e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb86f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb873"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37dc8573f5ea6a2abb871",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb872"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb876"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37dc8573f5ea6a2abb874",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb875"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb879"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132His",
	"identity" : "53f37dc8573f5ea6a2abb877",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb878"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb857")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb87a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "samples",
	"identity" : "TST038BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb87b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST038BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb87e"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37dc8573f5ea6a2abb87c",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb87d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb881"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f37dc8573f5ea6a2abb87f",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb880"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb884"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala88Thr",
	"identity" : "53f37dc8573f5ea6a2abb882",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb883"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
				},
				{
					"key" : "aminoAcidMutation",
					"value" : "p.Ala88Thr"
				},
				{
					"key" : "geneName",
					"value" : "FRG1B"
				},
				{
					"key" : "label",
					"value" : "FRG1B p.Ala88Thr"
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb887"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "PTPLA p.Glu29Lys",
	"identity" : "53f37dc8573f5ea6a2abb885",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb886"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb88a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "ANKLE1 p.Leu83Gln",
	"identity" : "53f37dc8573f5ea6a2abb888",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb889"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb88d"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f37dc8573f5ea6a2abb88b",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb88c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb890"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TMPRSS13 p.Ala77Gly",
	"identity" : "53f37dc8573f5ea6a2abb88e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb88f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb893"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TP53 p.Gly245Ser",
	"identity" : "53f37dc8573f5ea6a2abb891",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb892"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb896"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "IRF5 p.Arg175Gln",
	"identity" : "53f37dc8573f5ea6a2abb894",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb895"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb899"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "TP53 p.Ile102Thr",
	"identity" : "53f37dc8573f5ea6a2abb897",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb898"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb89c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T16:40:19.594Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132His",
	"identity" : "53f37dc8573f5ea6a2abb89a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb89b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-15T16:40:19.594Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb87a")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb856")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8a2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-15T19:01:56.333Z"),
	"role" : "participants",
	"identity" : "TST-039",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb89d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-12-15T19:01:56.333Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-039"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb89e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-12-15T19:01:56.333Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-15T19:01:56.333"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb89f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-12-16T20:27:18.650Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-16T20:27:18.650"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8a0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-12-16T20:44:30.021Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-16T20:44:30.021"
				},
				{
					"key" : "biopsyCores",
					"value" : 5
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8a1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-12-18T21:12:12.247Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-18T21:12:12.247"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8a3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "samples",
	"identity" : "TST039BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8a4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST039BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8a7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f37dc8573f5ea6a2abb8a5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8a6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8aa"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37dc8573f5ea6a2abb8a8",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8a9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8ad"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37dc8573f5ea6a2abb8ab",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8ac"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8b0"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37dc8573f5ea6a2abb8ae",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8af"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8b3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "IDH1 p.Arg132Cys",
	"identity" : "53f37dc8573f5ea6a2abb8b1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8b2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8b6"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f37dc8573f5ea6a2abb8b4",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8b5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8b9"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "SF3B1 p.Lys700Glu",
	"identity" : "53f37dc8573f5ea6a2abb8b7",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8b8"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a3")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8ba"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "samples",
	"identity" : "TST039BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8bb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST039BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8be"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser37Phe",
	"identity" : "53f37dc8573f5ea6a2abb8bc",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8bd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8ba")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8c1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "BRAF p.Val600Glu",
	"identity" : "53f37dc8573f5ea6a2abb8bf",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8c0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8ba")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8c4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37dc8573f5ea6a2abb8c2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8c3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8ba")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8c7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu542Lys",
	"identity" : "53f37dc8573f5ea6a2abb8c5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8c6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8ba")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8ca"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg175His",
	"identity" : "53f37dc8573f5ea6a2abb8c8",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8c9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8ba")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8cd"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-18T22:33:38.310Z"),
	"role" : "observations",
	"name" : "SF3B1 p.Lys700Glu",
	"identity" : "53f37dc8573f5ea6a2abb8cb",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8cc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-18T22:33:38.310Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8ba")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8a2")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8d3"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-21T14:04:25.253Z"),
	"role" : "participants",
	"identity" : "TST-040",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8ce"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-12-21T14:04:25.253Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-040"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8cf"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-12-21T14:04:25.253Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-21T14:04:25.253"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8d0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-12-23T20:11:58.176Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-23T20:11:58.176"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8d1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-12-23T22:49:10.194Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-23T22:49:10.194"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8d2"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-12-25T17:59:35.676Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-25T17:59:35.676"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8d4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "samples",
	"identity" : "TST040BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8d5"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST040BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8d8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37dc8573f5ea6a2abb8d6",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8d7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d4")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8db"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "ANKLE1 p.Leu83Gln",
	"identity" : "53f37dc8573f5ea6a2abb8d9",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8da"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d4")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8de"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f37dc8573f5ea6a2abb8dc",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8dd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d4")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8e1"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f37dc8573f5ea6a2abb8df",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8e0"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d4")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8e4"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f37dc8573f5ea6a2abb8e2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8e3"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d4")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8e7"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala41Thr",
	"identity" : "53f37dc8573f5ea6a2abb8e5",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8e6"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d4")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8e8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "samples",
	"identity" : "TST040BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8e9"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST040BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8ec"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Glu545Lys",
	"identity" : "53f37dc8573f5ea6a2abb8ea",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8eb"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8e8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8ef"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "ANKLE1 p.Leu83Gln",
	"identity" : "53f37dc8573f5ea6a2abb8ed",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8ee"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8e8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8f2"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "KRAS p.Gly13Asp",
	"identity" : "53f37dc8573f5ea6a2abb8f0",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8f1"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8e8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8f5"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg273Cys",
	"identity" : "53f37dc8573f5ea6a2abb8f3",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8f4"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8e8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8f8"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "CTNNB1 p.Ser38Phe",
	"identity" : "53f37dc8573f5ea6a2abb8f6",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8f7"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8e8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb8fb"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-25T22:14:49.734Z"),
	"role" : "observations",
	"name" : "FRG1B p.Ala41Thr",
	"identity" : "53f37dc8573f5ea6a2abb8f9",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8fa"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-25T22:14:49.734Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8e8")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb8d3")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb901"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-24T17:37:02.172Z"),
	"role" : "participants",
	"identity" : "TST-041",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8fc"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-12-24T17:37:02.172Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-041"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8fd"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-12-24T17:37:02.172Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-24T17:37:02.172"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8fe"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-12-27T17:14:34.768Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-27T17:14:34.768"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb8ff"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-12-27T21:57:54.724Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-27T21:57:54.724"
				},
				{
					"key" : "biopsyCores",
					"value" : 3
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb900"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2014-12-30T14:49:35.652Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2014-12-30T14:49:35.652"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb902"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "samples",
	"identity" : "TST041BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb903"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST041BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb906"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "observations",
	"name" : "ADAD2 p.Gly44Glu",
	"identity" : "53f37dc8573f5ea6a2abb904",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb905"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb902")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb909"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f37dc8573f5ea6a2abb907",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb908"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb902")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb90c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "observations",
	"name" : "TP53 p.Arg155Gln",
	"identity" : "53f37dc8573f5ea6a2abb90a",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb90b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb902")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb90f"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37dc8573f5ea6a2abb90d",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb90e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb902")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb910"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "samples",
	"identity" : "TST041BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb911"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST041BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb914"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "observations",
	"name" : "ADAD2 p.Gly44Glu",
	"identity" : "53f37dc8573f5ea6a2abb912",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb913"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb910")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb917"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "observations",
	"name" : "FAM194B p.Tyr139His",
	"identity" : "53f37dc8573f5ea6a2abb915",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb916"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb910")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb91a"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-30T16:24:52.871Z"),
	"role" : "observations",
	"name" : "EEF1B2 p.Ser43Gly",
	"identity" : "53f37dc8573f5ea6a2abb918",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb919"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2014-12-30T16:24:52.871Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb910")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb901")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb920"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2014-12-27T14:41:43.046Z"),
	"role" : "participants",
	"identity" : "TST-042",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb91b"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45d"),
			"stepDate" : ISODate("2014-12-27T14:41:43.046Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "identifier",
				"identity" : "TST-042"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb91c"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45e"),
			"stepDate" : ISODate("2014-12-27T14:41:43.046Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "enrolmentDate",
				"value" : "2014-12-27T14:41:43.046"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb91d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb45f"),
			"stepDate" : ISODate("2014-12-30T20:10:40.385Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "consentDate",
				"value" : "2014-12-30T20:10:40.385"
			}
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb91e"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb460"),
			"stepDate" : ISODate("2014-12-30T22:30:16.741Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "biopsyDate",
					"value" : "2014-12-30T22:30:16.741"
				},
				{
					"key" : "biopsyCores",
					"value" : 4
				}
			]
		},
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb91f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb461"),
			"stepDate" : ISODate("2015-01-01T21:24:50.829Z"),
			"stepUser" : "swatt",
			"fields" : {
				"key" : "pathologyDate",
				"value" : "2015-01-01T21:24:50.829"
			}
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb921"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2015-01-01T22:21:11.017Z"),
	"role" : "samples",
	"identity" : "TST042BIOXPAR1",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb922"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2015-01-01T22:21:11.017Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST042BIOXPAR1"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb920")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb925"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2015-01-01T22:21:11.017Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f37dc8573f5ea6a2abb923",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb924"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2015-01-01T22:21:11.017Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb921")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb920")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb928"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2015-01-01T22:21:11.017Z"),
	"role" : "observations",
	"name" : "MUC4 p.His4205Gln",
	"identity" : "53f37dc8573f5ea6a2abb926",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb927"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2015-01-01T22:21:11.017Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb921")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb920")
				},
				{
					"key" : "aminoAcidMutation",
					"value" : "p.His4205Gln"
				},
				{
					"key" : "geneName",
					"value" : "MUC4"
				},
				{
					"key" : "label",
					"value" : "MUC4 p.His4205Gln"
				},
				{
					"key" : "geneId",
					"value" : "ENSG00000145113"
				},
				{
					"key" : "transcriptId",
					"value" : "ENST00000463781"
				}
			]
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb92b"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2015-01-01T22:21:11.017Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f37dc8573f5ea6a2abb929",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb92a"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2015-01-01T22:21:11.017Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb921")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb920")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb92c"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2015-01-01T22:21:11.017Z"),
	"role" : "samples",
	"identity" : "TST042BIOXPAR2",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb92d"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb466"),
			"stepDate" : ISODate("2015-01-01T22:21:11.017Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "identifier",
					"identity" : "TST042BIOXPAR2"
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb920")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb930"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2015-01-01T22:21:11.017Z"),
	"role" : "observations",
	"name" : "KCNN3 p.Leu66His",
	"identity" : "53f37dc8573f5ea6a2abb92e",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb92f"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2015-01-01T22:21:11.017Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb92c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb920")
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
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb933"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2015-01-01T22:21:11.017Z"),
	"role" : "observations",
	"name" : "MUC4 p.His4205Gln",
	"identity" : "53f37dc8573f5ea6a2abb931",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb932"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2015-01-01T22:21:11.017Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb92c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb920")
				},
				{
					"key" : "aminoAcidMutation",
					"value" : "p.His4205Gln"
				},
				{
					"key" : "geneName",
					"value" : "MUC4"
				},
				{
					"key" : "label",
					"value" : "MUC4 p.His4205Gln"
				},
				{
					"key" : "geneId",
					"value" : "ENSG00000145113"
				},
				{
					"key" : "transcriptId",
					"value" : "ENST00000463781"
				}
			]
		}
	]
});
db.entities.insert({
	"_id" : ObjectId("53f37dc8573f5ea6a2abb936"),
	"studyId" : ObjectId("53f37dc8573f5ea6a2abb45c"),
	"lastModified" : ISODate("2015-01-01T22:21:11.017Z"),
	"role" : "observations",
	"name" : "PIK3CA p.Arg88Gln",
	"identity" : "53f37dc8573f5ea6a2abb934",
	"steps" : [
		{
			"id" : ObjectId("53f37dc8573f5ea6a2abb935"),
			"stepRef" : ObjectId("53f37dc8573f5ea6a2abb46a"),
			"stepDate" : ISODate("2015-01-01T22:21:11.017Z"),
			"stepUser" : "swatt",
			"fields" : [
				{
					"key" : "sampleEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb92c")
				},
				{
					"key" : "participantEntityRef",
					"ref" : ObjectId("53f37dc8573f5ea6a2abb920")
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
	]
});
