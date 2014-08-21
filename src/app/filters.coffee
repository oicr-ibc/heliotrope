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

# Filters

angular
  .module 'heliotrope.filters', []

  .filter 'interpolate',
    ['version', (version)->
      (text) ->
        String(text).replace(/\%VERSION\%/mg, version)
    ]

  .filter 'split', () ->
    (value) ->
      if value
        value.split(/,/)
      else
        value

  .filter 'field', () ->
     (field) ->
       if field
         switch field.type
           when "Boolean"
             field.displayValue || "N/A"
           when "Date"
             if field.value
               new XDate(field.value, true).toUTCString("d/MMM/yyyy")
             else
               "N/A"
           else
             if field.displayValue != undefined then field.displayValue else "N/A"
       else
         "N/A"

  .filter 'encodeURIComponent', () ->
    (input) ->
      encodeURIComponent(input)

  .filter 'capitalize', () ->
    (input) ->
      if input
        input.substring(0, 1).toUpperCase() + input.substring(1)
      else
        ""

  .filter 'classifySignificances', () ->
    (input) ->
      if input
        classified = {}
        for significance in input
          tumourType = significance["tumourType"]
          classified[tumourType] = [] unless classified[tumourType]?
          classified[tumourType].push(significance)
        console.log "Classified", input, classified
        classified
      else
        input

  .filter 'uniqueKeys', () ->
    (input, property) ->
      if input
        classified = {}
        for element in input
          classified[element[property]] = property
        Object.keys(classified)
      else
        input

  .filter 'hasPropertyValue', () ->
    (input, property, value) ->
      if input
        result = []
        for element in input
          if element[property] == value
            result.push(element)
        result
      else
        input

  .filter 'singularize', () ->
    (input) ->
      if input
        input.slice(0, -1)
      else
        ""

  .filter 'keywordToString', () ->
    (input, capitalize) ->
      if input?
        value = if capitalize != false
          input.substring(0, 1).toUpperCase() + input.substring(1)
        else
          input
        value.replace(/_/g, " ").replace(/,\b/g, ", ")
      else
        input

  .filter 'default', () ->
    (input, value) ->
      if input?
        input
      else
        value

  .filter 'authorList', () ->
    (input) ->
      if input?
        if input.length > 3
          input[0] + " et al."
        else
          input.join(", ")
      else
        input

  .filter 'trackerURL', () ->
    (value, type) ->
      path = ['']
      if value?.data?

        switch type
          when 'study'
            path.push 'studies', value.data.name
          when 'entity'
            path.push 'studies', value.data.study.name, value.data.role, value.data.identity

      (encodeURIComponent(x) for x in path).join('/')
