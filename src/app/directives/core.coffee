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

# Directives

angular
  .module 'heliotrope.directives.core', []

  .directive 'appVersion', ['version', (version) ->
    (scope, elm, attrs) ->
      elm.text(version)
  ]

  # This is used to embed an alert, or a set of alerts. The alerts are supposed to be
  # passed as a parameter somehow, so we can get to them. They will normally be
  # injected into the response.
  .directive 'heliAlert', () ->
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

  .directive 'heliDewikify', ['$compile', 'dewikifier', ($compile, dewikifier) ->
    result =
      restrict: "A"
      replace: false
      transclude: true
      scope: { "text": '=', "references": '=' }
      link: (scope, iElement, iAttrs) ->
        scope.$watch 'text', (newValue, oldValue) ->
          if newValue != undefined
            element = dewikifier(newValue, scope.references)
            iElement.append(element)
  ]

  .directive 'heliBibliographyElement', () ->
    result =
      restrict: "A"
      replace: false
      template: '<span>{{reference.author | authorList}}. {{reference.title}}. <i>{{reference.journal}}</i> ' +
                '<b ng-show="reference.volume">{{reference.volume}}</b><span ng-show="reference.issue">({{reference.issue}})</span>, ' +
                '<span ng-show="reference.pages">pp.{{reference.pages}}, </span> {{reference.date}}' +
                '  <a href="/publications/pmid/{{reference.pmid}}">PMID {{reference.pmid}}</a>' +
                '</span>'

  .directive 'heliValidate', () ->
    result =
      link: (scope, iElement, iAttrs) ->
        iElement.jqBootstrapValidation()

  .directive 'heliReference', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      scope: 'isolate'
      locals: { reference: 'bind' }
      template: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/{{reference.id}}" rel="external">{{reference.type}}:{{reference.id}}</a>'

  .directive 'heliEnsemblGene', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      scope: 'isolate'
      locals: { id: 'bind' }
      template: '<a href="http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g={{id}}" rel="external">{{id}}</a>'

  .directive 'heliEnsemblTranscript', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      scope: 'isolate'
      locals: { id: 'bind' }
      template: '<a href="http://useast.ensembl.org/Homo_sapiens/Transcript/Summary?t={{id}}" rel="external">{{id}}</a>'

  .directive 'heliErrorAlert', ['$compile', ($compile) ->
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
  ]

  # Dynamic tabs directive, which means we get the views for this entity type from the server.
  # All this happens automatically, and allows us to do all sorts of weird stuff in the server
  # end.
  .directive 'heliSummary', ['$compile', 'Views', ($compile, Views) ->
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
              for view in views.data.views
                body = '<div class="summary-section">' + view.body  + '</div>'
                active = ""
                template = angular.element(body)
                linkFn = $compile(template)
                iElement.append "<h3 class='summary-section-header' id='" + view.name + "'>" + view.label.default + "</h3>"
                iElement.append linkFn(scope)
                result = navElement.append "<li><a class='nav-section' href='#" + view.name + "'>" + view.label.default + "</a></li>"
              navElement.find("a.nav-section").click (e) ->
                e.preventDefault()
                e.stopPropagation()
                target = e.currentTarget.getAttribute('href')
                offset = jQuery(target).offset().top - 150
                jQuery("body").animate({scrollTop: offset},'slow');
            )
  ]

  .directive 'heliStudySummary', ['$compile', 'Views', ($compile, Views) ->
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
              for view in views.data.views
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
  ]
