# Directives 

angular
  .module('heliotrope.directives.tables', [])

  .directive('heliStudyEntities', (Study) ->
    result = 
      restrict: "A"
      replace: true
      template: '<table class="table table-bordered table-striped table-condensed">' +
                '<thead>' +
                '<tr>' +
                '<th class="step-headers">XXXX</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody class="step-body">' +
                '</tbody>' + 
                '</table>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'study', (newValue, oldValue) -> 
          if newValue
            role = iAttrs.role
            label = iAttrs.label
            header = iElement.find(".step-headers")
            body = iElement.find(".step-body")
            header.text(label)
            stepTable = {}
            stepIndex = 1
            for step in newValue.data.steps[role]
              if step.showSummary
                stepTable[step._id] = stepIndex++
                newHeader = jQuery("<th>" + step.label + "</th>")
                header.after newHeader
                header = newHeader
            query = Study.get({study: newValue.data.name, q: 'getEntities', role: role}, () ->
              
              for record in query.data
                row = ("" for i in [1..stepIndex])
                row[0] = "<a href='" + record.url + " '>" + record.identity + "</a>"
                for recordStep in record.steps
                  index = stepTable[recordStep.stepRef]
                  row[index] = '<i class="icon-ok"></i>' if index
                row = ("<td>" + rowData + "</td>" for rowData in row).join("")
                jQuery("<tr>" + row + "</tr>").appendTo(body)
            )
  )
  
  # Add the directive for the data tables for frequencies. This could be parameterised, but encapsulates all the
  # primary logic for the frequencies table. 
  
  .directive('heliFrequencies', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: false
      template: '<table class="table table-bordered table-striped table-condensed">' +
                '<thead>' +
                '<tr>' +
                '<th>Tumour type</th>' +
                '<th>Frequency</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '</tbody>' + 
                '</table>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity.data.sections.frequencies.data.tumour', (newValue, oldValue) -> 
          if (newValue)
            renderPercent = (x) -> 
              formatter = new NumberFormat(x.frequency * 100.0)
              formatter.setPlaces(2)
              '<b>' + formatter.toFormatted() + "%" + '</b> (' + x.affected + ' of ' + x.total + ' samples)'
            jQuery(iElement).dataTable(
              sPaginationType: "bootstrap"
              bPaginate: true
              aaData: newValue
              aoColumns: [
                { "sTitle": "Tumour type", "sClass": "span8", "mData": "tumourTypesRefx.name" }
                { "sTitle": "Frequency", "sClass": "span4", "mData": renderPercent, "sType": "percent" }
              ]
              aaSorting: [[ 1, "desc" ]]
            )
    result
  )