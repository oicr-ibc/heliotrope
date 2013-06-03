# Directives 

angular
  .module('heliotrope.directives.charts', [])

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

            d3.select('svg').remove();

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