# Directives

angular
  .module 'heliotrope.directives.tables', [
    'heliotrope.services.tracker'
  ]

  .directive 'heliEntitySteps', () ->
    result =
      restrict: "A"
      replace: true
      template: '<table class="table table-bordered table-striped table-condensed">' +
                '<thead>' +
                '<tr>' +
                '<th>Date</th>' +
                '<th>Step</th>' +
                '<th>User</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody class="step-body">' +
                '</tbody>' +
                '</table>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity', (entity) ->
          if entity
            body = iElement.find(".step-body")
            steps = entity.data.steps.sort (a, b) ->
              b.stepDate.localeCompare(a.stepDate)
            availableSteps = entity.data.availableSteps
            stepTable = {}
            stepTable[step._id] = step for step in availableSteps
            for id, step in stepTable
              step['count'] = 0
            for step in steps
              stepData = stepTable[step.stepRef]
              rowData = []
              url = entity.data.url + "/step/" + stepData["name"]
              if stepData['count']++ > 1
                url = url + ";" + stepData['count']
              rowData.push(new Date(step["stepDate"]).toLocaleDateString())
              rowData.push("<a href='" + step["url"] + "'>" + stepData["label"] + "</a>")
              rowData.push(step["stepUser"] || "anonymous")
              row = ("<td>" + element + "</td>" for element in rowData).join("")
              jQuery("<tr>" + row + "</tr>").appendTo(body)


  .directive 'heliStudyEntities', Array '$compile', 'Study', ($compile, Study) ->
    result =
      restrict: "A"
      replace: true
      scope: true
      template: '<table class="table table-bordered table-striped table-condensed">' +
                '<thead>' +
                '<tr>' +
                '<th class="step-headers">{{ label }}</th>' +
                '<th ng-repeat="step in headersByRole">{{ step.label }}</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody class="step-body">' +
                '<tr ng-repeat="entity in entitiesByRole">' +
                '<td><a ng-href="{{study|trackerURL:&apos;study&apos;}}/{{entity.role | encodeURIComponent}}/{{entity.identity | encodeURIComponent}}">{{ entity.identity }}</a></td>' +
                '<td ng-repeat="step in headersByRole"><span ng-show="stepCompleted(entity, step._id)" class="glyphicon glyphicon-ok"></span></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.label = iAttrs.label
        scope.stepCompleted = (record, stepId) ->
          for recordStep in record.steps
            return true if stepId == recordStep.stepRef && scope.stepTable.hasOwnProperty(recordStep.stepRef)
          false
        scope.$watch 'study', (newValue, oldValue) ->
          if newValue
            role = iAttrs.role
            header = iElement.find(".step-headers")
            body = iElement.find(".step-body")
            stepTable = {}
            stepIndex = 1
            headersByRole = []
            for step in newValue.data.steps[role]
              if step.showSummary
                stepTable[step._id] = stepIndex++
                headersByRole.push step
            scope.headersByRole = headersByRole
            scope.stepTable = stepTable

            query = Study.get {study: newValue.data.name, q: 'getEntities', role: role}, () ->
              scope.entitiesByRole = query.data


  # Add the directive for the data tables for frequencies. This could be parameterised, but encapsulates all the
  # primary logic for the frequencies table.

  .directive 'heliFrequencies', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      scope: {frequencies: '='}
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
        scope.$watch 'frequencies', (newValue, oldValue) ->

          if (newValue && ! angular.equals(newValue, oldValue))
            renderName = (x) ->
              '%s %s'.format(x.type.site || 'N/S', x.type.hist || 'N/S')
            renderPercent = (x) ->
              '<b>%0.2f%%</b> (%d of %d samples)'.format(x.frequency * 100.0, x.mutated, x.total)
            jQuery(iElement).dataTable(
              pagingType: "bs_normal"
              paging: true
              data: angular.copy(newValue)
              columns: [
                { "title": "Tumour type", "orderable" : true, "className": "span8", "data": renderName }
                { "title": "Frequency", "orderable" : true, "className": "span4", "data": renderPercent }
              ]
              order: [1, 'desc']
              columnDefs: [ {
                "targets": 1,
                "type": "html-percent"
              } ]
            )
    result

  # Add the directive for the data tables for frequencies. This could be parameterised, but encapsulates all the
  # primary logic for the frequencies table.

  .directive 'heliObservations', () ->
    result =
      restrict: "A"
      replace: true
      transclude: false
      scope: false
      template: '<table class="table table-bordered table-striped table-condensed table-paginated">' +
                '<thead>' +
                '<tr>' +
                '<th>Mutation</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '</tbody>' +
                '</table>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity', (newValue, oldValue) ->
          if (newValue)
            entity = newValue
            baseUrl = '/studies/' + encodeURIComponent(entity.data.study.name) + '/observations'
            jQuery(iElement).dataTable(
              pagingType: "bs_normal"
              paging: true
              lengthChange: false
              pageLength: 5
              data: entity.data.related.observations
              columns: [
                { "title": "Mutation", "className": "span4", "data": (data, type, val) ->
                  url = baseUrl + '/' + encodeURIComponent(data.identity)
                  if type == undefined
                    data
                  else
                    "<a href='" + url + "'>" + data.name + "</b>"
                }
              ]
            )
    result
