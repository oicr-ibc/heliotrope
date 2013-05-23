
# Filters

angular
  .module('heliotrope.filters', [])
  
  .filter 'interpolate', 
    ['version', (version)->
      (text) ->
        return String(text).replace(/\%VERSION\%/mg, version)
    ]

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
      return input.substring(0, 1).toUpperCase() + input.substring(1)

  .filter 'singularize', () ->
    (input) ->
      return input.slice(0, -1)

  .filter 'keywordToString', () ->
    (input) ->
      value = input.substring(0, 1).toUpperCase() + input.substring(1)
      return value.replace(/_/g, " ").replace(/,\b/g, ", ")
