
# Filters

angular
  .module('heliotrope.filters', [])
  
  .filter 'interpolate', 
    ['version', (version)->
      (text) ->
        String(text).replace(/\%VERSION\%/mg, version)
    ]

  .filter 'split', () ->
    (value) -> value.split(/,/)


  .filter 'field', () ->
     (field) -> 
       if field
         switch field.type
           when "Boolean"
             field.displayValue || "N/A"
           when "Date"
             if field.value
               new XDate(field.value, true).toUTCString("d/MMM/yyyy")
             else
               "N/A"
           else 
             if field.displayValue != undefined then field.displayValue else "N/A"
       else
         "N/A"

  .filter 'capitalize', () ->
    (input) ->
      if input
        input.substring(0, 1).toUpperCase() + input.substring(1)
      else
        ""

  .filter 'singularize', () ->
    (input) ->
      if input
        input.slice(0, -1)
      else 
        ""

  .filter 'keywordToString', () ->
    (input) ->
      value = input.substring(0, 1).toUpperCase() + input.substring(1)
      value.replace(/_/g, " ").replace(/,\b/g, ", ")
