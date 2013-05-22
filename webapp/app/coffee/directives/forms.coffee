# Directives 

angular
  .module('heliotrope.directives.forms', [])

  .directive('heliFormButton', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<a class="btn btn-primary"><span ng-transclude></span></a>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity', (newValue, oldValue) ->
          if newValue
            iElement.on 'click', (e) ->
              url = newValue.data.config.knowledgeServiceUrl + newValue.data.url + "/report?type=pdf"
              location.href = url
              e.stopPropagation()
              e.preventDefault()
  )

  .directive('heliStepField', ($compile, Entities) ->
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
          if newValue
            switch newValue.controlType
              when "hidden"
                body = '<input type="hidden" id="{{fieldKey}}" ng-model="fieldValue.value">'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
              when "text"
                body = '<input type="text" id="{{fieldKey}}" ng-model="fieldValue.value" placeholder="{{fieldValue.label}}">'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
              when "textarea"
                body = '<textarea class="texteditor" id="{{fieldKey}}" rows="4" style="width: 30em" ng-model="fieldValue.value" placeholder="{{fieldValue.label}}"></textarea>'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
#                if (newValue.controlArguments && newValue.controlArguments.html)
#                  htmlEditor = jQuery(iElement.find(".texteditor"))
#                  htmlEditor.wysihtml5()
              when "select"
                body = '<select ng-model="fieldValue.value"><option ng-repeat="value in fieldValue.range">{{value}}</option></select>'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
              when "integer"
                body = '<input type="text" id="{{fieldKey}}" ng-model="fieldValue.value" placeholder="{{fieldValue.label}}">'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
              when "float"
                body = '<input type="text" id="{{fieldKey}}" ng-model="fieldValue.value" placeholder="{{fieldValue.label}}">'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
              when "file"
                body = '<div>' +
                       '<input type="file" class="control" id="{{fieldKey}}" style="display: none">' + 
                       '<div class="input-append">' +
                       '<input id="{{fieldKey}}-text" class="input-large file-display" type="text">' +
                       '<a class="btn">Browse</a>' +
                       '</div>'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
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
              when "checkbox"
                body = '<input type="checkbox" ng-model="fieldValue.value" id="{{fieldKey}}">'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
              when "chooser"
                body = '<input type="text" class="chooser" ng-model="fieldValue.value" id="{{fieldKey}}" autocomplete="off"></input>'
                template = angular.element(body)
                if newValue.readonly
                  template.prop('readOnly', true)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
                chooser = jQuery(iElement.find(".chooser"))
                chooser.typeahead(
                  source: (query, callback) =>
                    entity = scope.$eval('entity')
                    studyName = entity.data.study.name
                    role = newValue.entity
                    entities = Entities.get({study: studyName, role: role, q: "^"+query}, () ->
                      callback(entry.identity for entry in entities.data)
                      # Must return false to avoid double callback weirdness
                      false
                    )
                )
                # See: https://github.com/twitter/bootstrap/issues/4018 for Chrome issue workaround
                jQuery(document).on('mousedown', 'ul.typeahead', (e) -> 
                  e.preventDefault()
                )
                chooser.change (e) =>
                	scope.fieldValue.value = chooser.val();
                	scope.$apply()
              else
                console.log "Unknown control type", newValue
  )
  

