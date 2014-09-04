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
  .module 'heliotrope.services.publications', ['ngSanitize']

  .factory 'dewikifier', Array '$sanitize', ($sanitize) ->
    return (text, citations) ->

      text = text.replace /(?:===\n)(\w)/g, (match, p1) -> "===\n\n" + p1

      getAuthors = (citation) ->
        input = citation.author
        result =
          if input.length
            if input.length > 3 then input[0] + " et al." else input.join(", ")
          else
            ''
        result = result.trim()
        result = result + "." if ! /[!?.]$/.test(result)
        return if result then $sanitize(result) else result

      getTitle = (citation) ->
        title = citation.title.trim()
        title = title + "." if ! /[!?.]$/.test(title)
        $sanitize(title)

      getJournal = (citation) -> '<i>' + $sanitize(citation.journal) + '</i>'
      getVolume = (citation) ->
        if citation.volume?
          '<b>' + $sanitize(citation.volume) + '</b>'
        else
          ''

      getIssue = (citation) -> if citation.issue? then "(" + $sanitize(citation.issue) + ")" else ''
      getPages = (citation) -> if citation.pages? then "pp." + $sanitize(citation.pages) + ", " else ''
      getLink = (citation) ->
        encoded = encodeURIComponent(citation.identifier)
        "<a href='#{citation.externalUrl}' rel='external'>#{citation.identifier}</a>"

      bibiographyElement = (citation) ->
        "<span>#{getAuthors(citation)} #{getTitle(citation)} #{getJournal(citation)} " +
        "#{getVolume(citation)}#{getIssue(citation)}, #{getPages(citation)}#{getLink(citation)}<span>"

      iElement = angular.element('<div></div>')
      paragraphs = text.split(/\n\n/)

      if !citations?
        citations = []

      citationIds = {}
      for citation in citations
        citationIds[citation.identifier] = citation

      citationList = undefined

      citationIndexes = {}
      citationIndex = 1
      foundCitations = {}

      for paragraph in paragraphs
        tag = 'p'
        paragraph = paragraph.trim()
        paragraph = paragraph.replace /^(====?)?(.*?)(====?)?$/, (match, p1, p2, p3) ->
          switch p1
            when '===' then tag = 'h4'
            when '====' then tag = 'h5'
          p2
        element = angular.element("<#{tag}></#{tag}>")
        paragraph = paragraph.replace /''([^']+)''/g, (match, p1) ->
          "<i>" + p1 + "</i>"
        paragraph = paragraph.replace /<ref refId="([^"]+)"\/>/g, (match, p1) ->
          index = citationIndexes[p1] or citationIndexes[p1] = citationIndex++
          found = citationIds[p1]
          foundCitations[found.identifier] = true
          "<a class='citation' href='#{found.externalUrl}'>#{'[' + index + ']'}</a>"
        element.html $sanitize(paragraph)
        iElement.append element

      if citations.length > 0
        citationList = []
        for own key, citation of citations
          if foundCitations[citation.identifier]
            citationList.push { index: citationIndexes[key], body: bibiographyElement(citation) }
        citationList.sort (a, b) -> a.index - b.index

      if citationList and citationList.length > 0
        iElement.append angular.element('<h4>References</h4>')
        citationListElement = angular.element('<ol class="citations"></ol>')
        for ref in citationList
          citationElement = angular.element("<li class='citation' value='#{ref.index}''>#{ref.body}</li>")
          citationListElement.append citationElement
        iElement.append citationListElement

      iElement