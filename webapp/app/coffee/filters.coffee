
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
  .filter('capitalize', () ->
    (input) ->
      return input.substring(0, 1).toUpperCase() + input.substring(1)
  )
  .filter('keywordToString', () ->
    (input) ->
      value = input.substring(0, 1).toUpperCase() + input.substring(1)
      return value.replace(/_/g, " ").replace(/,\b/g, ", ")
  )