> Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
>
> This program and the accompanying materials are made available under the terms of the GNU Public
> License v3.0. You should have received a copy of the GNU General Public License along with this
> program. If not, see <http://www.gnu.org/licenses/>.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
> IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
> FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
> CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
> DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
> DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
> WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
> WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Table directives
----------------


A module for directive sused to create a variety of tables.

    angular
      .module 'heliotrope.directives.tables', [
        'heliotrope.services.tracker'
      ]


Creates a table with a date-ordered list of steps for an entity.

      .directive 'heliEntitySteps', () ->
        result =
          restrict: "A"
          replace: true
          scope: true
          template: '<table class="table table-bordered table-striped table-condensed">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Date</th>' +
                    '<th>Step</th>' +
                    '<th>User</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody class="step-body">' +
                    '<tr ng-repeat="step in entitySteps">' +
                    '<td>{{ step.stepDate | date:"medium" }}</td>' +
                    '<td><a ng-href="/studies/{{ entity.data.study.name | encodeURIComponent}}/{{ entity.data.role | encodeURIComponent}}/{{ entity.data.identity | encodeURIComponent}}/step/{{ step.name }}">{{ step.label }}</a></td>' +
                    '<td>{{ step.stepUser | default:"anonymous"}}</td>' +
                    '</tbody>' +
                    '</table>'
          link: (scope, iElement, iAttrs, controller) ->
            scope.$watch 'entity', (entity) ->
              if entity
                steps = entity.data.steps.sort (a, b) ->
                  b.stepDate.localeCompare(a.stepDate)
                availableSteps = entity.data.availableSteps
                stepTable = {}
                stepTable[step._id] = step for step in availableSteps
                for id, step in stepTable
                  step['count'] = 0
                rowData = []
                for step in steps
                  entityStep = angular.copy(step)
                  stepData = stepTable[step.stepRef]
                  entityStep.name = stepData.name
                  entityStep.label = stepData.label
                  if stepData['count']++ > 1
                    entityStep.name = entityStep.name + ";" + stepData['count']
                  rowData.push entityStep
                scope.entitySteps = rowData

                  # rowData.push(new Date(step["stepDate"]).toLocaleDateString())
                  # rowData.push("<a href='" + step["url"] + "'>" + stepData["label"] + "</a>")
                  # rowData.push(step["stepUser"] || "anonymous")
                  # row = ("<td>" + element + "</td>" for element in rowData).join("")
                  # jQuery("<tr>" + row + "</tr>").appendTo(body)


Creates a table with a list of entities for a study.

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
                    '<td><a ng-href="/studies/{{ study.data.name | encodeURIComponent}}/{{entity.role | encodeURIComponent}}/{{entity.identity | encodeURIComponent}}">{{ entity.identity }}</a></td>' +
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


Add the directive for the data tables for frequencies. This could be parameterised, but encapsulates all the
primary logic for the frequencies table.

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


Add the directive for the data tables for frequencies. This could be parameterised, but encapsulates all the
primary logic for the frequencies table.

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
