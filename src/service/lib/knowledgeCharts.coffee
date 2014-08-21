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

sys = require("sys")

ChartMaker = require("./chartmaker")

transformDomains = (domains) ->
  sortedDomains = domains.sort (a, b) -> a["start"] - b["start"]
  domainCount = sortedDomains.length
  d = 0

  while d < domainCount
    next = d + 1

    ## Simple case, no more domains. Stop.
    break if next == domainCount

    thisDomain = sortedDomains[d]
    nextDomain = sortedDomains[next]

    ## Simple case, next domain starts after this one, no overlap
    if thisDomain["end"] < nextDomain["start"]
      d++
      continue

    ## The domains do overlap. Keep the biggest. Note we splice the sortedDomains
    ## array and adjust count so we can continue.
    thisSize = thisDomain["end"] - thisDomain["start"]
    nextSize = nextDomain["end"] - nextDomain["start"]

    if thisSize >= nextSize

      ## Next is smaller, remove it.
      sortedDomains.splice(next, 1)
    else

      ## This is smaller. Juggle them
      sortedDomains.splice(d, 2, nextDomain)

    domainCount--
    continue

  ({id: domain["hitName"], start: domain["start"], stop: domain["end"], description: domain["description"]} for domain in sortedDomains)

module.exports.getVariantChartSVG = (entity) ->

  transcript = entity.data.sections.transcripts.data.records[0]

  positionString = entity.data.sections.positions.data[0]["codon"]
  position = parseInt((positionString).toString())
  mutations = if isNaN(position) then [] else [{id: entity["shortMutation"], position: position, url: null, value: 4}]

  domains = transcript["domains"].filter (domain) -> domain["gffSource"] == "Pfam"

  data =
    start: 1
    stop: transcript["lengthAminoAcid"]
    domains: transformDomains(domains)
    mutations: mutations

  gene = entity["data"]["genesRefx"]["_body"]
  if gene.sections.distribution
    data["background"] = gene.sections.distribution["data"]

  chart = new ChartMaker({tooltips: false, displayWidth: 500, valueHeight: 80}, data)
  result = chart.display('body')

  result.html()
