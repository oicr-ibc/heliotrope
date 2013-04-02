// This file is loaded when running the Scala test suite. Really, we should use a test database
// containing a minimal set of objects which we can use to test out the service. 

userObjectId = "swatt";
db.users.drop();
db.createCollection("users");
db.users.insert({ "name" : userObjectId});

db.studies.drop();
db.entities.drop();
db.steps.drop();
db.views.drop();

db.createCollection("studies");
db.createCollection("entities");
db.createCollection("views");

db.studies.insert({
  "version": 1,
  "name": "GPS",
});

// Helper method for compatibility: see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toISOString
// This allows us to use toISOString() method calls within this, even when deploying to MongoDB's shell, which doesn't (yet) support
// it.
if (!Date.prototype.toISOString) {
    (function() {
        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        }
        Date.prototype.toISOString = function() {
            return this.getUTCFullYear()
                + '-' + pad( this.getUTCMonth() + 1 )
                + '-' + pad( this.getUTCDate() )
                + 'T' + pad( this.getUTCHours() )
                + ':' + pad( this.getUTCMinutes() )
                + ':' + pad( this.getUTCSeconds() )
                + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                + 'Z';
        };
    }());
}

// Helper function to create an object with dynamic keys, since the usual object
// literal formal doesn't allow that. 
function obj() {
  var result = {};
  for (var i = 0; i < arguments.length; i += 2) {
    result[arguments[i]] = arguments[i+1];
  }
  return result;
}

db.studies.ensureIndex({name:1},{unique:true});
db.steps.ensureIndex({studyId:1,ownerType:1,name:1},{unique:true});

study_id = db.studies.find({"name" : "GPS"}).next()._id;

function get_step_id(study_id, ownerType, name) {
  return db.steps.find({"studyId" : study_id, "ownerType" : ownerType, "name" : name}).next()._id;
}

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "Global",
  "name" : "CreateParticipant",
  "stepOptions" : {
    "method" : "CreateEntity",
    "role" : "participants",
    "identityField" : "identifier"
  },
  "label" : { "default" : "Create participant" },
  "fields" : {
    "identifier" : {
      "controlType" : "text",
      "type" : "String",
      "label" : { "default" : "Identifier" }
    },
    "institution" : {
      "controlType" : "select",
      "type" : "String",
      "range" : ["PMH/UHN", "London", "Ottawa", "Thunder Bay"],
      "label" : { "default" : "Institution" }
    },
  }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "participants",
  "name" : "enrolment",
  "label" : {
    "default" : "Enrolment",
  },
  "fields" : {
    "enrolmentDate" : {
      "controlType" : "date",
      "type" : "Date",
      "label" : { "default" : "Enrolment date" }
    }
  }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "participants",
  "name" : "consent",
  "label" : { "default" : "Consent" },
  "fields" : {
    "consentDate" : {
      "controlType" : "date",
      "type" : "Date",
      "label" : { "default" : "Consent date" }
    }
  }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "participants",
  "name" : "biopsy",
  "label" : { "default" : "Biopsy" },
  "fields" : {
    "biopsyDate" : {
      "controlType" : "date",
      "type" : "Date",
      "label" : { "default" : "Biopsy date" }
    },
    "biopsyCores" : {
      "controlType" : "integer",
      "type" : "Integer",
      "label" : { "default" : "Number of cores" }
    }
  }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "participants",
  "name" : "pathology",
  "label" : { "default" : "Pathology" },
  "fields" : {
    "pathologyDate" : {
      "controlType" : "date",
      "type" : "Date",
      "label" : { "default" : "Pathology date" }
    }
  }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "participants",
  "name" : "expertPanel",
  "label" : { "default" : "Expert panel date" },
  "fields" : {
    "consentDate" : {
      "controlType" : "date",
      "type" : "Date",
      "label" : { "default" : "Expert panel date" }
    }
  }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "participants",
  "stepOptions" : {
    "method" : "CreateEntity",
    "role" : "samples",
    "identityField": "identifier",
    "parentField": "participantEntityRef"
  },
  "name" : "CreateSample",
  "label" : { "default" : "Create sample" },
  "fields" : {
    "identifier" : {
      "controlType" : "text",
      "type" : "String",
      "label" : { "default" : "Barcode" }
    },
    "participantEntityRef" : {
      "controlType" : "chooser",
      "entity" : "participants",
      "type" : "Reference",
      "label" : { "default" : "Participant" }
    },
    "type" : {
      "controlType" : "select",
      "type" : "String",
      "range" : ["FFPE", "Frozen", "Blood", "Fluid", "FNA"],
      "label" : { "default" : "Type" }
    },
    "site" : {
      "controlType" : "select",
      "type" : "String",
      "range" : ["Primary", "Metastates"],
      "label" : { "default" : "Site" }
    },
    "requiresCollection" : {
      "controlType" : "checkbox",
      "type" : "Boolean",
      "label" : { "default" : "Requires collection" }
    }
  }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "samples",
  "name" : "assessSample",
  "label" : { "default" : "Record sample quality" },
  "fields" : {
    "dnaConcentration" : {
      "controlType" : "float",
      "type" : "Float",
      "label" : { "default" : "DNA concentration" }
    },
    "dnaQuality" : {
      "controlType" : "select",
      "type" : "String",
      "range" : ["Good", "Moderate", "Poor"],
      "label" : { "default" : "DNA quality" }
    }
  }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "samples",
  "name" : "markAsCollected",
  "label" : { "default" : "Mark as collected" }
});

db.steps.insert({
  "studyId" : study_id,
  "ownerType" : "samples",
  "name" : "CreateObservation",
  "stepOptions" : {
    "method" : "CreateEntity",
    "role" : "observations",
    "parentField": "sampleEntityRef"
  },
  "label" : { "default" : "Create observation" },
  "fields" : {
    "sampleEntityRef" : {
      "controlType" : "chooser",
      "type" : "Reference",
      "entity" : "samples",
      "label" : { "default" : "Sample" }
    },
    "mutation" : {
      "controlType" : "text",
      "type" : "String",
      "label" : { "default" : "Mutation" }
    }
  }
});

db.views.ensureIndex({"studyId": 1, "role" : 1, "name": 1}, {"unique" : true});

db.views.insert({
  "studyId" : study_id,
  "name" : "summary",
  "role" : "participants",
  "label" : { "default" : "Summary" },
  "weight" : 0,
  "body" : 
"<dl>" +
"  <dt>Registered</dt>" +
"  <dd><span heli-field name='enrolmentDate'></span></dd>" +
"  <dt>Consent</dt>" +
"  <dd><span heli-field name='consentDate'></span></dd>" +
"  <dt>Biopsy</dt>" +
"  <dd><span heli-field name='biopsyDate'></span></dd>" +
"  <dt>Pathology</dt>" +
"  <dd><span heli-field name='pathologyDate'></span></dd>" +
"  <dt>Clinical lab</dt>" +
"  <dd><span heli-field name='clinicalLaboratoryDate'></span></dd>" +
"  <dt>Research lab</dt>" +
"  <dd><span heli-field name='researchLaboratoryDate'></span></dd>" +
"  <dt>Expert panel</dt>" +
"  <dd><span heli-field name='expertPanelDate'></span></dd>" +
"</dl>"
});

db.views.insert({
  "studyId" : study_id,
  "name" : "enrolment",
  "role" : "participants",
  "label" : { "default" : "Enrolment" },
  "weight" : 100,
  "body" : 
"<dl>" +
"  <dt>Registered</dt>" +
"  <dd><span heli-field name='enrolmentDate'></span></dd>" +
"  <dt>Consent</dt>" +
"  <dd><span heli-field name='consentDate'></span></dd>" +
"</dl>"
});

db.views.insert({
  "studyId" : study_id,
  "name" : "samples",
  "role" : "participants",
  "label" : { "default" : "Samples" },
  "weight" : 200,
  "body" : 
"<table>" +
"  <thead></thead>" +
"  <tbody>" +
"    <tr ng-repeat='sample in entity.data.related.samples'>" + 
"      <td><a href='{{sample.url}}'>{{sample.identity}}</a>" +
"    </tr>" +
"  <tbody>" +
"</table>"
});

db.views.insert({
  "studyId" : study_id,
  "name" : "history",
  "role" : "participants",
  "label" : { "default" : "Clinical history" },
  "weight" : 300,
  "body" : 
"<div>" +
"<span heli-field name='clinicalHistory'></span>" +
"<p><b>Last updated:</b> <span heli-field name='clinicalHistoryUpdated'></span></p>" +
"</div>"
});

db.views.insert({
  "studyId" : study_id,
  "name" : "observations",
  "role" : "participants",
  "label" : { "default" : "Observations" },
  "weight" : 400,
  "body" : 
"<table>" +
"  <thead></thead>" +
"  <tbody>" +
"    <tr ng-repeat='observation in entity.data.related.observations'>" + 
"      <td><a href='{{observation.url}}'>{{observation.label}}</a>" +
"    </tr>" +
"  <tbody>" +
"</table>"
});

// Locates a step within a case, and ensures uniqueness
db.entities.ensureIndex({"studyId": 1, "steps.id": 1});
// Locates steps by type within a case
db.entities.ensureIndex({"studyId": 1, "steps.stepRef": 1});
// Enforce identity uniqueness within a study - handy for search, too
db.entities.ensureIndex({"studyId": 1, "role" : 1, "identity": 1}, {"unique" : true, "sparse": true});
// To quickly find related entities
db.entities.ensureIndex({"steps.fields.ref": 1});

function get_entity_id(study_id, role, identifier) {
  return db.entities.find({"studyId" : study_id, "role" : role, "identity" : identifier}, {"_id" : 1}).next()._id;
}

db.entities.insert({
  "studyId" : study_id,
  "lastModified" : new Date(2012, 10, 12, 11, 45),
  "role" : "participants",
  "identity" : "TST-001",
  "steps" : [{
    "id" : ObjectId("511d220dea2a8c2f1e2c1fef"),
    "stepRef" : get_step_id(study_id, "Global", "CreateParticipant"),
    "stepDate" : new Date(2012, 10, 12, 11, 45),
    "fields" : [{
      "key" : "identifier", 
      "identity" : "TST-001"
    }]
  }, {
    "id" : ObjectId("511d2252ea2a8c2f1e2c1ff0"),
    "stepRef" : get_step_id(study_id, "participants", "enrolment"),
    "stepDate" : new Date(2012, 10, 12, 11, 45),
    "fields" : [{
      "key" : "enrolmentDate",
      "value" : (new Date(2012, 10, 12, 11, 45)).toISOString()
    }]
  }, {
    "id" : ObjectId("511d2295ea2a8c2f1e2c1ff1"),
    "stepRef" : get_step_id(study_id, "participants", "consent"),
    "stepDate" : new Date(2012, 10, 13, 13, 45),
    "fields" : [{
      "key" : "consentDate",
      "value" : (new Date(2012, 10, 13, 13, 45)).toISOString()
    }]
  }, {
    "id" : ObjectId("511d2295ea2a8c2f1e2c1ff2"),
    "stepRef" : get_step_id(study_id, "participants", "biopsy"),
    "stepDate" : new Date(2012, 10, 14, 9, 12),
    "fields" : [{
      "key" : "biopsyDate",
      "value" : (new Date(2012, 10, 14, 9, 12)).toISOString()
    }]
  }, {
    "id" : ObjectId("511d389aea2a8c2f1e2c1ff7"),
    "stepRef" : get_step_id(study_id, "participants", "pathology"),
    "stepDate" : new Date(2012, 10, 17, 12, 19),
    "fields" : [{
      "key" : "pathologyDate",
      "value" : (new Date(2012, 10, 17, 12, 19)).toISOString()
    }]
  }]
});

db.entities.insert({
  "studyId" : study_id,
  "lastModified" : new Date(2012, 10, 12, 11, 45),
  "role" : "samples",
  "identity" : "TST001BIOXPAR1",
  "steps" : [{
    "id" : ObjectId("511d3842ea2a8c2f1e2c1ff4"),
    "stepRef" : get_step_id(study_id, "participants", "CreateSample"),
    "stepDate" : new Date(2012, 10, 12, 11, 45),
    "fields" : [{
      "key" : "identifier",
      "identity" : "TST001BIOXPAR1"
    }, {
      "key" : "participantEntityRef",
      "ref" : get_entity_id(study_id, "participants", "TST-001")
    }]
  }]
});

db.entities.insert({
  "studyId" : study_id,
  "lastModified" : new Date(2012, 10, 12, 11, 45),
  "role" : "samples",
  "identity" : "TST001BIOXPAR2",
  "steps" : [{
    "id" : ObjectId("511d3842ea2a8c2f1e2c1ff4"),
    "stepRef" : get_step_id(study_id, "participants", "CreateSample"),
    "stepDate" : new Date(2012, 10, 12, 11, 45),
    "fields" : [{
      "key" : "identifier",
      "identity" : "TST001BIOXPAR2"
    }, {
      "key" : "participantEntityRef",
      "ref" : get_entity_id(study_id, "participants", "TST-001")
    }]
  }]
});

// The uniqueness (identity) of an observation is different. We don't
// always have one. In this case, therefore, we need to model out a
// way of handling the reference to the observation and its related
// data. There is possibly a very good case for denormalization here, 
// with an identity top-level field which we can use to enforce
// uniqueness, independent of an identity field value. The identity
// field value is still useful, as it provides a hook for setting the
// top-level field. 
//
// The label field offers an alternative to an identity for presentation
// purposes, but isn't enforced as unique. 

db.entities.insert({
  "studyId" : study_id,
  "lastModified" : new Date(2012, 10, 12, 11, 45),
  "role" : "observations",
  "label" : "KRAS p.G12D",
  "steps" : [{
    "id" : ObjectId("511d3f90ea2a8c2f1e2c1ffe"),
    "stepRef" : get_step_id(study_id, "samples", "CreateObservation"),
    "stepDate" : new Date(2012, 10, 12, 11, 45),
    "fields": [{
      "key" : "sampleEntityRef", 
      "ref" : get_entity_id(study_id, "samples", "TST001BIOXPAR1")
    }, {
      "key" : "participantEntityRef", 
      "ref" : get_entity_id(study_id, "participants", "TST-001")
    }, {
      "key" : "variant", 
      "value" : "KRAS p.G12D"
    }]
  }]
});
