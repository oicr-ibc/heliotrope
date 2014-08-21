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

angular
  .module 'heliotrope.services.genomics', []

  .factory 'transformDomains', () ->

    (domains) ->
      sortedDomains = domains.sort (a, b) -> a["start"] - b["start"]

      domainCount = sortedDomains.length
      d = 0
      while d < domainCount - 1

        next = d + 1
        thisDomain = sortedDomains[d]
        nextDomain = sortedDomains[next]

        if thisDomain["end"] < nextDomain["start"]

          # Simple case, next domain starts after this one, no overlap
          d++

        else

          # The domains do overlap. Keep the biggest. Note we splice the sortedDomains
          # array and adjust count so we can continue.
          thisSize = thisDomain["end"] - thisDomain["start"]
          nextSize = nextDomain["end"] - nextDomain["start"]

          if thisSize >= nextSize

            sortedDomains.splice(next, 1)
            domainCount--

          else

            sortedDomains.splice(d, 2, nextDomain)
            domainCount--

      domainFn = (domain) ->
        result =
          id: domain["hitName"]
          start: domain["start"]
          stop: domain["end"]
          description: domain["description"]

      result = domainFn(domain) for domain in sortedDomains
