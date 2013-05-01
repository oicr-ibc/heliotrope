# Directives 

angular
  .module('heliotrope.directives', [])
  .directive('appVersion', ['version', (version) ->
    (scope, elm, attrs) ->
      elm.text(version)
  ])
  
  # This is used to embed an alert, or a set of alerts. The alerts are supposed to be 
  # passed as a parameter somehow, so we can get to them. They will normally be 
  # injected into the response. 
  .directive('heliAlert', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: 'isolate'
      locals: { alert: 'bind' }
      template: '<div class="alert alert-{{alert.level | lowercase}} ">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>{{alert.level | uppercase}}!</strong> {{alert.body}}' +
                '</div>'
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
                    scope.$apply (s) =>
                      fileCount = data.files.length
                      files = (data.files[i] for i in [0..fileCount])
                      scope.files = files
                      scope.progressVisible = false
                      scope.$broadcast('fileadded', {files: fileCount})
                      scope.toUpload = true
                      
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
                    identifiers = data.result.error["files"]
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
  
  # Used to generate a dropdown menu of the available workflows. These can then be
  # used to direct to a form on selection. 
  
  .directive('heliWorkflows', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<ul class="dropdown-menu">' +
                '<li ng-repeat="step in entity.data.availableSteps">' +
                '<a href="{{step.url}}">{{step.label}}</a>' +
                '</li>' +
                '</ul>'
  )
  
  .directive('heliReference', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: 'isolate'
      locals: { reference: 'bind' }
      template: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/{{reference.id}}" rel="external">{{reference.type}}:{{reference.id}}</a>'
  )
  
  .directive('heliErrorAlert', ($compile) ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: false
      link: (scope, iElement, iAttrs, controller) ->
        errorField = iAttrs.field
        scope.$watch errorField, (newValue, oldValue) -> 
          if newValue
            html = '<div class="alert alert-error">' +
                   '<button type="button" class="close" data-dismiss="alert">&times;</button>' + 
                   '<strong>Error.</strong> ' + newValue + '</div>'
            jQuery(iElement).html(html)
  )
  
  # Directive to implement a field access - primarily intended for use within templates
  # defined on the server. The field value is located from the entity, and then the
  # display value inserted, if it exists. 
  
  .directive('heliField', () ->
    result = 
      restrict: "A"
      replace: true
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity', (newValue, oldValue) -> 
          field = newValue.getField(iAttrs.name)
          if (field && field.value) 
            switch field.type
              when "Date"
                dateString = new XDate(field.value, true).toUTCString("d/MMM/yyyy")
                jQuery(iElement).text(dateString)
              else 
                jQuery(iElement).text(field.displayValue)
          else
            jQuery(iElement).text("N/A");
  )
  
  # Dynamic tabs directive, which means we get the views for this entity type from the server.
  # All this happens automatically, and allows us to do all sorts of weird stuff in the server
  # end. 
  .directive('heliSummary', ($compile, Views) ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="summary"></div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity.data', (newValue, oldValue) -> 
          if newValue
            role = newValue.role
            name = newValue.study.name
            element = jQuery(iElement)
            navElement = jQuery("#sidebar .nav-list")
            views = Views.get({study: name, role: role}, () ->
              
              # Insert the views from the server data, one at a time, picking the first to be active
              for view in views.data
                body = '<div class="summary-section">' + view.body  + '</div>'
                active = ""
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append "<h3 id='" + view.name + "'>" + view.label.default + "</h3>"
                iElement.append linkFn(scope)
                result = navElement.append "<li><a class='nav-section' href='#" + view.name + "'>" + view.label.default + "</a></li>"
              navElement.find("a.nav-section").click (e) ->
                e.preventDefault()
                e.stopPropagation()
                target = e.currentTarget.getAttribute('href')
                offset = jQuery(target).offset().top - 150
                jQuery("body").animate({scrollTop: offset},'slow');
            )
  )
  
  .directive('heliSection', () ->
      priority: 1
      restrict: "A"
      replace: true
      transclude: true
      scope: { title: '@title', id: '@bodyId' }
      template: '<div class="row-fluid">' +
                '<div class="tab-content">' +
                '<div class="tab-pane active">' +
                '<div class="row-fluid">' + 
                '<h3 class="pull-left" id="{{id}}">{{title}}</h3>' +
                '</div>' +
                '<div class="body" ng-transclude></div>' +
                '</div' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        navElement = jQuery("#sidebar .nav-list")
        id = iAttrs["bodyId"]
        title = iAttrs["title"]
        newElement = jQuery("<li><a class='nav-section' href='#" + id + "'>" + title + "</a></li>")
        newElement.appendTo(navElement)
        newElement.click (e) ->
          e.preventDefault()
          e.stopPropagation()
          target = e.currentTarget.firstChild.getAttribute('href')
          offset = jQuery(target).offset().top - 150
          jQuery("body").animate({scrollTop: offset}, 'slow')
          true
  )
  
  .directive('heliStudySummary', ($compile, Views) ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="summary"></div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'study.data', (newValue, oldValue) -> 
          if newValue
            name = newValue.name
            element = jQuery(iElement)
            navElement = jQuery("#sidebar .nav-list")
            views = Views.get({study: name, role: "studies"}, () ->
              
              # Insert the views from the server data, one at a time, picking the first to be active
              for view in views.data
                body = '<div class="summary-section">' + view.body  + '</div>'
                active = ""
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append "<h3 id='" + view.name + "'>" + view.label.default + "</h3>"
                iElement.append linkFn(scope)
                result = navElement.append "<li><a class='nav-section' href='#" + view.name + "'>" + view.label.default + "</a></li>"
              navElement.find("a.nav-section").click (e) ->
                e.preventDefault()
                e.stopPropagation()
                target = e.currentTarget.getAttribute('href')
                offset = jQuery(target).offset().top - 150
                jQuery("body").animate({scrollTop: offset},'slow');
            )
  )
  
  .directive('heliStepForm', () ->
    result =
      restrict: 'A',
      replace: true,
      transclude: true,
      template: '<div>' +
                '<form class="form-horizontal">' +
                '<div class="body" ng-transclude></div>' +
                '<div class="control-group">' +
                '<div class="controls">' +
                '<button type="submit" class="btn btn-primary submit" ng-click="update(entity)">Save</button>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '<pre>form = {{entity.data.step | json}}</pre>' +
                '</div>'
  )
  
  .directive('heliChooseStep', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      template: '<form>' +
                '<div class="control-group">' +
                '<label class="control-label" for="apply-workflow">Apply step</label>' +
                '<div class="controls">' +
                '<div class="btn-group">' +
                '<a class="btn dropdown-toggle" data-toggle="dropdown">Choose step <b class="caret"></b></a>' +
                '<div heli-workflows></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</form>'
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
              
              
#              jQuery(iElement).dataTable(
#                sPaginationType: "bootstrap"
#                bPaginate: false
#                aaData: query.data
#                aoColumns: [
#                  { "sTitle": "Participant", "mData" : "identity" }
#                ]
#              )
            )
  )
  
  # Add the directive for the genome frequencies data, which has an optional marker
  # included for a current location. This depends on d3, and is therefore requiring an
  # svg enabled browser. 
  #
  # Note that a variant is a bit different, and we ought to handle it accordingly.
  # Genes can be displayed immediately. 
  
  .directive('heliStructureDistribution', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: false
      template: '<div class="diagram"></div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity.data', (newValue, oldValue) -> 
          if (newValue)
            
            display = jQuery(iElement)
            
            chartWidth = 700
            chartHeight = 140
            element = display.get()[0]
            chart = d3.select(element)
              .append("svg")
              .attr("class", "chart")
              .attr("width", chartWidth)
              .attr("height", chartHeight)
              
            data = newValue.sections.distribution.data
            transcript = newValue.sections.transcripts.data.records[0]
            
            maximumValue = Math.max.apply(Math, data)
      
            leftMargin = 20
            rightMargin = 10
            availableWidth = chartWidth - leftMargin - rightMargin
            w = availableWidth / data.length        #/ -- to shut up the IDE stupidity
            h = 100
            x = d3.scale.linear().domain([0, 200]).range([leftMargin, availableWidth + leftMargin])
            y = d3.scale.linear().domain([0, maximumValue]).rangeRound([0, h])
            xCodon = d3.scale.linear().domain([0, transcript.lengthAminoAcid]).range([leftMargin, availableWidth + leftMargin])
                  
            xOffsetFunction = (d, i) => x(i) + 0.5
            yOffsetFunction = (d) => h - y(d) - 0.5;
            widthFunction = (d) => w + 1
            heightFunction = (d) => y(d);
              
            identity = (x) => x
            chart.selectAll("rect.frequency")
              .data(data)
              .enter()
              .append("rect")
              .attr("class", "frequency")
              .attr("x", xOffsetFunction)
              .attr("y", yOffsetFunction)
              .attr("width", widthFunction)
              .attr("height", heightFunction)
              
            xAxis = d3.svg.axis()
            xAxis.scale(xCodon)
            xAxis.orient("bottom")
            chart.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + (h - 0.5) + ")")
              .call(xAxis)
             
            variantData = newValue.sections.positions
            if variantData
              codon = variantData.data[0].codon
              if codon
                codon = codon.replace(/(?:-\d+)$/, "")
                chart.append("line")
                  .attr("x1", xCodon(codon))
                  .attr("x2", xCodon(codon))
                  .attr("y1", h - 0.5)
                  .attr("y2", h - 20 + 0.5)
                  .attr("stroke", "#000")
                  .attr("stroke-width", 2)
                chart.append("circle")
                  .attr("cx", xCodon(codon))
                  .attr("cy", h - 20 + 0.5)
                  .attr("r", 7)
                  .attr("fill", "#c55")
      
            domains = (element for element in transcript.domains when element.gffSource is "Pfam")
      #      console.debug 'transcript', transcript
      #      console.debug 'domains', domains
            
            xOffsetDomainFunction = (d, i) => xCodon(d.start) - 0.5
            yOffsetDomainFunction = (d) => h + 24 - 0.5;
            widthDomainFunction = (d) => xCodon(d.end) - xCodon(d.start) - 0.5
            heightDomainFunction = (d) => 12;
            textDomainFunction = (d) => d.description
            
            domainColours = d3.scale.category10()
            colorDomainFunction = (d, i) => domainColours(i)
            
      #      console.log xOffsetDomainFunction(domains[0]), yOffsetDomainFunction(domains[0]), widthDomainFunction(domains[0]), heightDomainFunction(domains[0])
      
            domainGroups = chart.selectAll("g.domain")
              .data(domains)
              .enter()
              .append("g")
              .attr("class", "domain")
              .attr("rel", "tooltip")
              .attr("title", textDomainFunction)
               
            domainGroups.append("rect")
              .attr("x", xOffsetDomainFunction)
              .attr("y", yOffsetDomainFunction)
              .attr("width", widthDomainFunction)
              .attr("height", heightDomainFunction)
              .style("fill", colorDomainFunction)
              
            domainElements = jQuery(display).find("g.domain")
            domainElements.tooltip({container: "body", placement: "right"})
            # console.debug display.find("g.domain rect")
  )
  
  .directive('heliGeneFrequencies', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: false
      template: '<div class="diagram"></div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'gene.data', (newValue, oldValue) -> 
          if (newValue)
            
            display = jQuery(iElement)
            
            # console.debug newValue
            
            data = newValue.slice(0, 30)

            chartWidth = 760
            chartHeight = 600

            margin = {top: 20, right: 20, bottom: 30, left: 80}
            width = chartWidth - margin.left - margin.right
            height = chartHeight - margin.top - margin.bottom
      
            formatPercent = d3.format(".0%");
            
            x = d3.scale.linear().range([0, width])
            y = d3.scale.ordinal().rangeRoundBands([0, height], 0.1)
            
            xAxis = d3.svg.axis().scale(x).orient("top").tickFormat(formatPercent)
            yAxis = d3.svg.axis().scale(y).orient("left")
            
            x.domain([0, d3.max(data, (d) -> d.frequency.frequency)])
            y.domain(data.map((d) -> d.name))
      
            element = display.get()[0]
            svg = d3.select(element)
              .append("svg")
              .attr("class", "chart")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              
            svg.append("g")
              .attr("class", "x axis")
              .call(xAxis)
            
            svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
            
      #      console.debug data
              
            node = svg.selectAll(".bar")
              .data(data)
              .enter()
              .append("a")
              .attr("xlink:href", (d) -> "genes/" + d.name)
            
            node.append("rect")
              .attr("class", "bar")
              .attr("x", 0.5)
              .attr("y", (d) -> y(d.name))
              .attr("width", (d) -> x(d.frequency.frequency))
              .attr("height", y.rangeBand())
  )