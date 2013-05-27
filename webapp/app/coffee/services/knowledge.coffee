angular.module('knowledge.services', ['ngResource'])

  # Service to access the gene frequencies. This doens't want any parameters or 
  # or routing usually, it's all global.

  .factory('GeneFrequencies', ($resource) ->
    $resource('/knowledge/api/queries/gene_frequencies', {},
      query: 
        method: 'GET'
    )
  )

  # Service to retrieve gene information. 

  .factory('Gene', ($resource) ->
    $resource('/knowledge/api/genes/:gene', {},
      query: 
        method: 'GET'
    )
  )

  # Service to retrieve search information. 

  .factory('Search', ($resource) ->
    $resource('/knowledge/api/search', {},
      query: 
        method: 'GET'
    )
  )

  # Service to retrieve variant information. 

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

