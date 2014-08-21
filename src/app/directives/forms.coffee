## Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
##
## This program and the accompanying materials are made available under the terms of the GNU Public
## License v3.0. You should have received a copy of the GNU General Public License along with this
## program. If not, see <http://www.gnu.org/licenses/>.
##
## THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
## IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
## FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
## CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
## DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
## DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
## WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
## WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

# Directives

angular
  .module 'heliotrope.directives.forms', [
    'heliotrope.services.tracker'
  ]

  .directive 'heliTagControl', () ->
    result =
      restrict: 'A'
      replace: false
      scope:
        model: '='
      link: (scope, iElement, iAttrs, controller) ->
        loading = false
        iElement.select2({tags: [], tokenSeparators: [",", " "]})
        scope.$watch 'model', (val) ->
          if val
            loading = true
            iElement.val(val).trigger("change")
            loading = false
        iElement.on 'change', (evt) ->
          if !loading
            scope.$apply () ->
              scope.model = evt.val


  .directive 'heliDescription', () ->
    result =
      restrict: 'A'
      replace: false
      scope:
        html: '='
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'html', (val) ->
          if val
            iElement.html(val)


  .directive 'heliStepForm', () ->
    result =
      restrict: 'A'
      replace: true
      transclude: true
      template: '<div>' +
                '<form class="form-horizontal">' +
                '<div class="body" ng-transclude></div>' +
                '<div class="form-group">' +
                '<div class="col-sm-3"></div>' +
                '<div class="controls col-sm-9">' +
                '<button type="submit" class="btn btn-primary submit" ng-click="update(entity)">Save</button>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>'


  .directive 'heliFormButton', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      template: '<a class="btn btn-primary"><span ng-transclude></span></a>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity', (newValue, oldValue) ->
          if newValue
            iElement.on 'click', (e) ->
              url = newValue.url + "/report?mimeType=application/pdf"
              location.href = url
              e.stopPropagation()
              e.preventDefault()


  .directive 'heliStepField', Array '$compile', 'RelatedEntities', ($compile, RelatedEntities) ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      scope: true
      locals: { "fieldKey": 'bind', "fieldValue": 'bind' }
      template: '<div class="controls">' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->

        scope.$watch 'fieldValue', (newValue, oldValue) ->

          linkBody = (body, attributes) ->
            template = angular.element(body)
            if attributes
              Object.keys(attributes).forEach (key) ->
                fieldKey = attributes[key]
                if newValue[fieldKey]
                  template.attr(key, newValue[fieldKey])
            linked = $compile(template)(scope)
            iElement.append linked
            #### linked.jqBootstrapValidation()
            linked
          if newValue
            switch newValue.controlType
              when "hidden"
                linkBody('<input type="hidden" id="{{fieldKey}}" ng-model="fieldValue.value">')
              when "identity"
                linkBody('<input type="text" id="{{fieldKey}}" class="form-control" ng-model="fieldValue.identity" placeholder="{{fieldValue.label}}">', {"pattern" : "pattern", "data-validation-pattern-message" : "pattern-message"})
              when "text"
                linkBody('<input type="text" id="{{fieldKey}}" class="form-control" ng-model="fieldValue.value" placeholder="{{fieldValue.label}}">', {"pattern" : "pattern", "data-validation-pattern-message" : "pattern-message"})
              when "textarea"
                linkBody('<textarea class="texteditor" class="form-control" id="{{fieldKey}}" rows="4" style="width: 30em" ng-model="fieldValue.value" placeholder="{{fieldValue.label}}"></textarea>')
              when "select"
                select = linkBody('<input type="text" id="{{fieldKey}}"></input>')
                values = ({id: i, text: v.toString(), value: v} for v, i in newValue.range)
                select.select2({"val": newValue.value, "placeholder": newValue.label, "allowClear": true, "data": values})
                select.on 'change', (e) ->
                  if e.added?
                    scope.fieldValue.value = e.added.value
                  else
                    scope.fieldValue.value = null
                  scope.$apply()
              when "integer"
                linkBody('<input type="text" id="{{fieldKey}}" class="form-control" ng-model="fieldValue.value" data-validation-regex-regex="[0-9]+" data-validation-regex-message="Must be a valid integer" placeholder="{{fieldValue.label}}">')
              when "float"
                linkBody('<input type="text" id="{{fieldKey}}" class="form-control" ng-model="fieldValue.value" data-validation-regex-regex="(?:[1-9]\d*|0)?(?:\.\d+)?" data-validation-regex-message="Must be a valid number" placeholder="{{fieldValue.label}}">')
              when "checkbox"
                linkBody('<input type="checkbox" class="form-control" ng-model="fieldValue.value" id="{{fieldKey}}">')
              when "file"
                body = '<div>' +
                       '<input type="file" class="form-control" id="{{fieldKey}}" style="display: none">' +
                       '<div class="input-append">' +
                       '<input id="{{fieldKey}}-text" class="input-large file-display" class="form-control" type="text">' +
                       '<a class="btn">Browse</a>' +
                       '</div>'
                template = angular.element(body)
                linked = $compile(template)(scope)
                iElement.append linked

                iElement.find(".btn").click (e) ->
                  iElement.find(".control").click()
                iElement.find(".control").change (e) ->
                  iElement.find(".file-display").val jQuery(this).val()
                form = iElement.parents("form")

                # File-containing forms are a little different. We actually want to
                # push the files somehow through the service. The step can then take these
                # values and handle the data. The question is: how to incorporate the
                # file data into the final submission process for the step, and still
                # push to the same URL. That should really involve capturing the form
                # submission process.
                #
                # We actually want to stop (defer) the regular form submission process
                # for these cases. That involves removing the current click handler for
                # the submit button.

                form.fileupload
                  dataType: 'json'
                  url: scope.entity.data.serviceUrl + "/files"

                  add: (e, data) =>
                    fileCount = data.files.length
                    files = (data.files[i] for i in [0..fileCount])
                    scope.files = files
                    scope.progressVisible = false
                    scope.toUpload = true
                    scope.$digest()
                    scope.$broadcast('fileadded', {files: fileCount})

                    form.find(".submit").off('click')

                    form.find(".submit").on('click', (e) =>
                      e.preventDefault()
                      e.stopPropagation()
                      data.submit()
                      false
                    )
                  done: (e, data) =>
                    # We should get a response here, and if we do, and if we get some files back, we
                    # can then add them into the control data and re-initiate the form submission. This
                    # will then put the file identifiers into the form value. Sorted.

                    console.log "Done", data, scope

                    identifiers = data.result["files"]
                    scope.fieldValue.value = identifiers
                    scope.$apply()

                    # And now, hey presto, let's submit the form for real now. Of course, we do this using
                    # Angular rather than naive stuff
                    scope.update(scope.entity)

                  progress: (e, data) =>
                  progressall: (e, data) =>

              when "date"
                body = '<input type="text" class="datepicker" id="{{fieldKey}}" placeholder="{{fieldValue.label}}">'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
                datepicker = jQuery(iElement.find(".datepicker"))
                datepicker.datepicker({autoclose: true, format: "yyyy-mm-dd"})
                if scope.fieldValue.value
                  datepicker.datepicker('update', new Date(scope.fieldValue.value))
                datepicker.change (e) =>
                  timeString = (new Date(datepicker.val())).toISOString()
                  if timeString.slice(-1) == "Z"
                    timeString = timeString.slice(0, -1)
                  scope.fieldValue.value = timeString
                  scope.$apply()

              when "reference"
                linkBody('<input type="text" id="{{fieldKey}}" class="form-control" ng-model="fieldValue.displayValue" disabled readonly>')

              # The chooser is how we link to related entities. The chooser control type is a selection,
              # but there could be other controls some time. Ideally, this would be a dynamic dispatch
              # with some better factoring.

              when "chooser"

                template = '<input class="chooser form-control" type="text" name="{{fieldKey}}" id="{{fieldKey}}" required>'
                linked = $compile(template)(scope)
                iElement.append linked
                if newValue.ref
                  linked.val(newValue.ref)

                entity = scope.$eval('entity')
                studyName = entity.data.study.name
                role = entity.data.role
                identity = entity.data.identity
                relatedEntity = newValue.entity

                entities = RelatedEntities.get {"study": studyName, "role": role, "identity": identity, "_role" : relatedEntity}, () ->
                  data = ({id: entity.identity, text: (entity.name || entity.identity), _id: entity._id} for entity in entities.data)
                  configure = {data: data, width: "element"}
                  configure.initSelection = (element, callback) ->
                    for entry in data
                      if entry._id == element.val()
                        callback entry

                  console.log "About to configure select2", configure
                  linked.select2(configure)

                linked.on "change", (e) ->
                  scope.$apply () ->
                    scope.fieldValue.value = linked.select2("val")

              else
                console.log "Unknown control type", newValue


