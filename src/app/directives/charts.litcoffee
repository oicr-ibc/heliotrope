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


Charting directives
-------------------

This module provides the directives which implement charts in the application. Charting is done
by d3 at the low level.

    angular
      .module 'heliotrope.directives.charts', [ 'heliotrope.services.genomics' ]


Add the directive for the genome frequencies data, which has an optional marker
included for a current location. This depends on d3, and is therefore requiring an
svg enabled browser.

Note that a variant is a bit different, and we ought to handle it accordingly.
Genes can be displayed immediately.

      .directive 'heliStructureDistribution', Array 'transformDomains', '$location', (transformDomains, $location) ->
        result =
          restrict: "A"
          replace: true
          transclude: true
          scope: false
          scope: { transcript: '=transcript', mutations: '=mutations' }
          template: '<div class="diagram"></div>'
          link: (scope, iElement, iAttrs, controller) ->

            chart = undefined
            mutationsData = undefined

            scope.$watch 'mutations', (mutations) ->
              if mutations?
                mutationsData = for m in mutations when m.codon
                  {id: m.name, position: m.codon , url: "/variants/#{m.variant}", value: m.frequency, selected: m.selected}

                # Make sure selected markers are at the front. Don't use sort for this, no need. We can
                # filter and concatenate in two passes.
                mutationsSelected = mutationsData.filter (a) -> a.selected
                mutationsUnselected = mutationsData.filter (a) -> !a.selected
                mutationsData = [].concat(mutationsUnselected, mutationsSelected)

                if chart?
                  chart.setMutations(mutationsData)


            scope.$watch 'transcript', (transcript) ->
              if transcript?
                domains = (domain for domain in transcript["domains"] when domain["gffSource"] == "Pfam")

                markerTooltipHtmlFn = (d) ->
                  'Mutation: ' + d.id + '<br>' +
                  'Number of samples: ' + d.value

                markerUrlFn = (d) ->
                  jQuery(this).tooltip('hide')
                  scope.$apply () ->
                    $location.path(d.url)

                markerClassFn = (d) ->
                  if d.selected then 'marker marker-selected' else 'marker marker-unselected'

                transcriptData =
                  start: 1
                  stop: transcript["lengthAminoAcid"]
                  domains: transformDomains(domains)

                display = jQuery(iElement)
                chartWidth = 700
                chartHeight = 140
                element = display.get()[0]

                chartOptions =
                  tooltips: false
                  leftMargin: 30
                  markerRadius: 6
                  domainLegendBarSize: 55
                  domainLegendBarDescriptionOffset: 58
                  displayWidth: chartWidth
                  valueHeight: chartHeight
                  markerTooltipHtmlFn: markerTooltipHtmlFn
                  markerUrlFn: markerUrlFn
                  markerClassFn: markerClassFn

                if mutationsData?
                  transcriptData['mutations'] = mutationsData

                chart = new ProteinStructureChart(chartOptions, transcriptData)
                chart.display(element)

                # domains = (domain for domain in transcript["domains"] when domain["gffSource"] == "Pfam")
                # domains = transformDomains(domains)

                # data =
                #   start: 1,
                #   stop: transcript["lengthAminoAcid"],
                #   domains: domains
                # if entityData.sections.positions
                #   positions = entityData.sections.positions
                #   codon = positions.data[0]["codon"]
                #   position = codon && parseInt((codon).toString())
                #   if ! isNaN(position)
                #     data.mutations = [{id: entityData["shortMutation"], position: position, url: null, value: 4}]

                # if entityData.sections.distribution
                #   data["background"] = entityData.sections.distribution["data"]


Add the directive for the gene frequencies bubble diagram. This depends on d3, and is therefore requiring an
svg enabled browser.

      .directive 'heliGeneFrequenciesBubble', () ->
        result =
          restrict: "A"
          replace: true
          transclude: true
          scope: false
          template: '<div class="diagram"></div>'
          link: (scope, iElement, iAttrs) ->
            scope.$watch 'gene.data', (genes) ->
              if genes

                display = jQuery(iElement)
                element = display.get()[0]

                chartWidth = 840
                chartHeight = 650
                color = d3.scale.category20c()

                svg = d3.select(element)
                  .append("svg")
                  .attr("width", chartWidth)
                  .attr("height", chartHeight)
                  .attr("class", "bubble")

                classes = (nodes) ->
                  result = []
                  for element in nodes
                    result.push
                      name: element.name
                      value: Math.sqrt(element.frequency)
                  output =
                    children: result

                bubble = d3.layout.pack()
                  .sort(null)
                  .size([chartWidth, chartHeight])
                  .padding(1.5)

                filtered = bubble.nodes(classes(genes)).filter((d) -> !d.children)

                nodes = svg.selectAll(".bubble")
                  .data(filtered)
                  .enter()
                  .append("g")
                  .attr("class", "bubble")
                  .attr("transform", (d) -> "translate(#{d.x},#{d.y})")

                nodes.append("title")
                  .text((d) -> d.name)

                links = nodes.append("a")
                  .attr("xlink:href", (d) -> "genes/" + d.name)

                links.append("circle")
                  .attr("r", (d) -> d.r)
                  .style("fill", (d) -> color(d.name))

                links.append("text")
                  .attr("dy", ".3em")
                  .style("text-anchor", "middle")
                  .style("font-size", (d) -> (d.r / 2).toString() + "px")
                  .text((d) -> d.name)

