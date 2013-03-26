
# Filters

angular
  .module('heliotrope.filters', [])
  .filter('interpolate', 
    ['version', (version)->
      (text) ->
        return String(text).replace(/\%VERSION\%/mg, version)
    ])
  .filter('reference', () ->
  	  (input) -> 
  	  	console.debug input.id, input.type
  	  	return """<a href="http://www.ncbi.nlm.nih.gov/pubmed/""" + 
  	  	              input.id + 
  	  	              """" rel="external">""" +
  	  	              input.type + ":" + input.id + 
  	  	              """</a>"""
  )