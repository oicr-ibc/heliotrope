
# Filters

angular
  .module 'heliotrope.filters', []

  .filter 'interpolate',
    ['version', (version)->
      (text) ->
        String(text).replace(/\%VERSION\%/mg, version)
    ]

  .filter 'split', () ->
    (value) ->
      if value
        value.split(/,/)
      else
        value

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

  .filter 'encodeURIComponent', () ->
    (input) ->
      encodeURIComponent(input)

  .filter 'capitalize', () ->
    (input) ->
      if input
        input.substring(0, 1).toUpperCase() + input.substring(1)
      else
        ""

  .filter 'classifySignificances', () ->
    (input) ->
      if input
        classified = {}
        for significance in input
          tumourType = significance["tumourType"]
          classified[tumourType] = [] unless classified[tumourType]?
          classified[tumourType].push(significance)
        console.log "Classified", input, classified
        classified
      else
        input

  .filter 'uniqueKeys', () ->
    (input, property) ->
      if input
        classified = {}
        for element in input
          classified[element[property]] = property
        Object.keys(classified)
      else
        input

  .filter 'hasPropertyValue', () ->
    (input, property, value) ->
      if input
        result = []
        for element in input
          if element[property] == value
            result.push(element)
        result
      else
        input

  .filter 'singularize', () ->
    (input) ->
      if input
        input.slice(0, -1)
      else
        ""

  .filter 'keywordToString', () ->
    (input, capitalize) ->
      if input?
        value = if capitalize != false
          input.substring(0, 1).toUpperCase() + input.substring(1)
        else
          input
        value.replace(/_/g, " ").replace(/,\b/g, ", ")
      else
        input

  .filter 'default', () ->
    (input, value) ->
      if input?
        input
      else
        value

  .filter 'authorList', () ->
    (input) ->
      if input?
        if input.length > 3
          input[0] + " et al."
        else
          input.join(", ")
      else
        input

  .filter 'trackerURL', () ->
    (value, type) ->
      path = ['']
      if value?.data?

        switch type
          when 'study'
            path.push 'studies', value.data.name
          when 'entity'
            console.log "Value", value
            path.push 'studies', value.data.study.name, value.data.role, value.data.identity

      (encodeURIComponent(x) for x in path).join('/')
