# Directives 

angular
  .module('heliotrope.directives.charts', ['heliotrope.services.genomics'])

  # Add the directive for the genome frequencies data, which has an optional marker
  # included for a current location. This depends on d3, and is therefore requiring an
  # svg enabled browser. 
  #
  # Note that a variant is a bit different, and we ought to handle it accordingly.
  # Genes can be displayed immediately. 

  .directive('heliStructureDistribution', (domainService) ->

    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: false
      template: '<div class="diagram"></div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'entity.data', (entityData) -> 
          if (entityData)

            display = jQuery(iElement)
            chartWidth = 700
            chartHeight = 140
            element = display.get()[0]

            charter = ProteinStructureChart

            transcript = entityData.sections.transcripts.data.records[0]
            domains = (domain for domain in transcript["domains"] when domain["gffSource"] == "Pfam")
            domains = domainService.transform(domains)

            data = 
              start: 1,
              stop: transcript["lengthAminoAcid"],
              domains: domains

            if entityData.sections.positions
              data.mutations = [{id: entityData["shortMutation"], position: entityData.sections.positions.data[0]["codon"], url: null, value: 4}]

            if entityData.sections.distribution
              data["background"] = entityData.sections.distribution["data"]

            chart = new ProteinStructureChart({
              tooltips: false, 
              leftMargin: 30, 
              markerRadius: 6, 
              domainLegendBarSize: 55,
              domainLegendBarDescriptionOffset: 58,
              displayWidth: chartWidth, 
              valueHeight: chartHeight}, 
              data)

            result = chart.display(element)
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