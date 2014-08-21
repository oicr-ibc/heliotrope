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
    return (text, references) ->

      text = text.replace /(?:===\n)(\w)/g, (match, p1) -> "===\n\n" + p1

      getAuthors = (reference) ->
        input = reference.author
        result =
          if input.length
            if input.length > 3 then input[0] + " et al." else input.join(", ")
          else
            ''
        result = result.trim()
        return if result then $sanitize(result + ". ") else result

      getTitle = (reference) -> $sanitize(reference.title)
      getJournal = (reference) -> '<i>' + $sanitize(reference.journal) + '</i>'
      getVolume = (reference) ->
        if reference.volume?
          '<b>' + $sanitize(reference.volume) + '</b>'
        else
          ''

      getIssue = (reference) -> if reference.issue? then "(" + $sanitize(reference.issue) + ")" else ''
      getPages = (reference) -> if reference.pages? then "pp." + $sanitize(reference.pages) + ", " else ''
      getLink = (reference) ->
        encoded = encodeURIComponent(reference.pmid)
        "<a href='/publications/pmid/#{encoded}'>PMID #{encoded}</a>"

      bibiographyElement = (reference) ->
        "<span>#{getAuthors(reference)}#{getTitle(reference)}. #{getJournal(reference)} " +
        "#{getVolume(reference)}#{getIssue(reference)}, #{getPages(reference)}#{getLink(reference)}<span>"

      iElement = angular.element('<div></div>')
      paragraphs = text.split(/\n\n/)

      if !references?
        references = {}

      refList = undefined

      referenceIndexes = {}
      referenceIndex = 1

      for paragraph in paragraphs
        tag = 'p'
        paragraph = paragraph.replace /^(====?)?(.*?)(====?)?$/, (match, p1, p2, p3) ->
          switch p1
            when '===' then tag = 'h4'
            when '====' then tag = 'h5'
          p2
        element = angular.element("<#{tag}></#{tag}>")
        paragraph = paragraph.replace /<ref refId="([^"]+)"\/>/g, (match, p1) ->
          index = referenceIndexes[p1] or referenceIndexes[p1] = referenceIndex++
          found = references[p1]
          "<a class='citation' href='/publications/pmid/#{found.pmid}'>#{'[' + index + ']'}</a>"
        element.html $sanitize(paragraph)
        iElement.append element

      if Object.keys(references).length > 0
        refList = []
        for own key, reference of references
          if reference.significant
            refList.push { index: referenceIndexes[key], body: bibiographyElement(reference) }
        refList.sort (a, b) -> a.index - b.index

      if refList and refList.length > 0
        iElement.append angular.element('<h4>References</h4>')
        refListElement = angular.element('<ol class="references"></ol>')
        for ref in refList
          refElement = angular.element("<li class='reference' value='#{ref.index}''>#{ref.body}</li>")
          refListElement.append refElement
        iElement.append refListElement

      iElement