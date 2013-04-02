# Directives 

angular
  .module('heliotrope.directives', [])
  .directive('appVersion', ['version', (version) ->
    (scope, elm, attrs) ->
      elm.text(version)
  ])
  
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
              when "select"
                body = '<select ng-model="fieldValue.value"><option ng-repeat="value in fieldValue.range">{{value}}</option></select>'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
              when "date"
                body = '<input type="text" class="datepicker" id="{{fieldKey}}" placeholder="{{fieldValue.label}}">'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
                datepicker = jQuery(iElement.find(".datepicker"))
                datepicker.datepicker({autoclose: true, format: "yyyy-mm-dd"})
                datepicker.datepicker('update', new Date(scope.fieldValue.value))
                datepicker.change (e) =>
                  scope.fieldValue.value = new Date(datepicker.val()).toISOString();
                  scope.$apply()
              when "checkbox"
                body = '<input type="checkbox" ng-model="fieldValue.value" id="{{fieldKey}}">'
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append linkFn(scope)
              when "chooser"
                body = '<input type="text" class="chooser" ng-model="fieldValue.value" id="{{fieldKey}}" autocomplete="off"></input>'
                template = angular.element(body)
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
          if (field) 
            jQuery(iElement).text(field.displayValue)
          else
            jQuery(iElement).text("N/A");
  )
  
  # The tab directive can use the scope to find out some views, and then use those views to 
  # select how to display. This really needs to be souped up into some uber control which
  # can manage display and everything.
  
  .directive('heliTab', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<ul class="nav nav-tabs">' +
                '<li class="active"><a href="#tab1" data-toggle="tab">Summary</a></li>' +
                '<li><a href="#tab2" data-toggle="tab">Enrolment</a></li>' +
                '<li><a href="#tab3" data-toggle="tab">Samples</a></li>' +
                '<li><a href="#tab4" data-toggle="tab">Clinical history</a></li>' +
                '<li><a href="#tab5" data-toggle="tab">Results</a></li>' +
                '<li><a href="#tab6" data-toggle="tab">Reports</a></li>' +
                '<li><a href="#tab7" data-toggle="tab">Panel decision</a></li>' +
                '<li><a href="#tab8" data-toggle="tab">Log</a></li>' +
                '</ul>'
      link: (scope, iElement, iAttrs, controller) ->
        jQuery(iElement).find("a").click (e) ->
          e.preventDefault()
          e.stopPropagation()
          jQuery(this).tab('show')
  )
  
  # Dynamic tabs directive, which means we get the views for this entity type from the server.
  # All this happens automatically, and allows us to do all sorts of weird stuff in the server
  # end. 
  .directive('heliDynatab', ($compile, Views) ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="tabbable tabs-left"><ul class="nav nav-tabs"></ul><div class="tab-content"></div></div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity.data', (newValue, oldValue) -> 
          if newValue
            role = newValue.role
            name = newValue.study.name
            element = jQuery(iElement)
            menuElement = element.find(".nav")
            contentElement = element.find(".tab-content")
            views = Views.get({study: name, role: role}, () ->
              active = "active"
              
              # Insert the views from the server data, one at a time, picking the first to be active
              for view in views.data
                link = jQuery('<li class="' + active + '"><a href="#' + view.name + '" data-toggle="tab">' + view.label.default + '</a></li>')
                link.appendTo(menuElement)
                link.find("a").click (e) ->
                  e.preventDefault()
                  e.stopPropagation()
                  jQuery(this).tab('show')
                body = '<div class="tab-pane ' + active + '" id="' + view.name + '">' + view.body  + '</div>'
                active = ""
                template = angular.element(body)
                linkFn = $compile(template)
                contentElement.append linkFn(scope)
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
        scope.$watch 'gene.data.sections.frequencies.data.tumour', (newValue, oldValue) -> 
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
  
  # Add the directive for the genome frequencies data, which has an optional marker
  # included for a current location. This depends on d3, and is therefore requiring an
  # svg enabled browser.
  
  .directive('heliStructureDistribution', () ->
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
             
            variantData = undefined
            
            if variantData
              variantPositionData = variantData.get("data")["sections"]["positions"]
              if variantPositionData
                codon = variantPositionData.data[0].codon
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
              
            domainGroups.append("rect")
              .attr("x", xOffsetDomainFunction)
              .attr("y", yOffsetDomainFunction)
              .attr("width", widthDomainFunction)
              .attr("height", heightDomainFunction)
              .attr("rel", "tooltip")
              .attr("title", textDomainFunction)
              .style("fill", colorDomainFunction)
              
            display.find("g.domain rect").tooltip({container: "body"})
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