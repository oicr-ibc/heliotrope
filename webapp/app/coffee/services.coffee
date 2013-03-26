angular.module('heliotrope.services', [])
  .value('version', '0.1');

angular.module('knowledge.services', ['ngResource'])
  .factory('GeneFrequencies', ($resource) ->
    $resource('/knowledge/api/queries/gene_frequencies', {},
      query: 
        method: 'GET'
    )
  )
  .factory('Gene', ($resource) ->
    $resource('/knowledge/api/genes/:gene', {},
      query: 
        method: 'GET'
    )
  )
  .factory('Variant', ($resource) ->
    Variant = $resource('/knowledge/api/variants/:variant', {},
      query: 
        method: 'GET'
    )
    Variant.prototype.getOrderedPositions = () ->
      positions = @data.sections.positions.data
      positions.forEach((a) ->
        a.codon = null if a.codon == "-"
      )
      positions.sort((a, b) -> 
        result = 0
        result = -1 if ("sift" in a and ! "sift" in b)
        result = 1 if ("sift" in b and ! "sift" in a)
        return result if (result != 0)
        result = -1 if ("polyphen" in a and ! "polyphen" in b)
        result = 1 if ("polyphen" in b and ! "polyphen" in a)
        return result if (result != 0)
        result = Math.max(-1, Math.min(1, a.HGVSc.length - b.HGVSc.length))
        return result
      )
      positions
    Variant
  )
  .factory('Study', ($resource) ->
    $resource('/tracker/api/studies/:study', {},
      query: 
        method: 'GET'
    )
  )
  .factory('Entity', ($resource) ->
    Entity = $resource('/tracker/api/studies/:study/:role/:identity', {},
      query: 
        method: 'GET'
    )
    Entity.prototype.getField = (x) ->
    	this.data.values[x]
    Entity
  )
  .factory('Views', ($resource) ->
    $resource('/tracker/api/views/:study/:role', {},
      query: 
        method: 'GET'
    )
  )
  .factory('EntityStep', ($resource) ->
    EntityStep = $resource('/tracker/api/studies/:study/:role/:identity/step/:step', {},
      query: 
        method: 'GET'
    )
    EntityStep.prototype.getField = (x) ->
      this.data.values[x]
    EntityStep
  )
  