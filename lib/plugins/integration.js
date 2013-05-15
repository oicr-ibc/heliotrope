// This plugin is used to provide a number of useful hooks. Although it isn't strictly
// part of the core application, it helps us maintain a useful separation between the
// tracker and the knowledge base. 

function addKnowledgeFields(db, err, result, callback) {	
	return callback(db, err, result);
}

module.exports.addKnowledgeFields = addKnowledgeFields;
