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


Navigation directives
---------------------

This module provides the directives which implement navigation in the application.

    angular
      .module 'heliotrope.directives.navigation', [
        'heliotrope.services.tracker'
      ]


Used to generate a dropdown menu of the available workflows. These can then be
used to direct to a form on selection.

      .directive 'heliWorkflows', () ->
        result =
          restrict: "A"
          replace: true
          template: '<ul class="dropdown-menu">' +
                    '<li ng-repeat="step in entity.data.availableSteps">' +
                    '<a ng-href="/studies/{{entity.data.study.name | encodeURIComponent}}/{{entity.data.role | encodeURIComponent}}/{{entity.data.identity | encodeURIComponent}}/step/{{step.name}}">{{step.label}}</a>' +
                    '</li>' +
                    '</ul>'


To display the study menu link, make a request and see what we get. This should
probably be done more elegantly in the root scope, and then handled from there.

      .directive 'heliStudyMenuLink', Array 'StudyList', (StudyList) ->
        result =
          restrict: "A"
          replace: true
          template: '<li class="disabled"><a>studies</a></li>'
          link: (scope, iElement, iAttrs, controller) ->

            studyList = StudyList.get({}, () ->
              iElement.toggleClass("disabled")
              iElement.find('a').attr('href','/studies');
            )


Used to connect observations through to the knowledge base by transparently searching
for a corresponding entity and making a link to it, if possible.

      .directive 'heliKnowledgeBaseSearch', Array '$http', ($http) ->
        result =
          restrict: "A"
          scope: { term: '&', entity: '&entity' }
          link: (scope, iElement, iAttrs, controller) ->
            scope.$watch "term", (newTerm) ->
              term = newTerm()
              if term
                scope.$watch "entity", (newEntity) ->
                  entity = newEntity()
                  if entity

                    serviceUrl = entity.config.baseUrl + entity.config.knowledgeUriBase + "/variants/" + term
                    frontUrl = entity.config.baseUrl + "/variants/" + term

                    $http(
                      method: 'GET'
                      url: serviceUrl
                    ).success((data, status, headers, config) ->
                      jQuery(iElement).html("<a href='" + frontUrl + "'>" + frontUrl + "</a>")
                    ).error((data, status, headers, config) ->
                      jQuery(iElement).html("<span class='warn'>Not found in knowledge base</span>")
                    )


A section control, which determines when a section can be shown, and if it is, generates
an appropriate heading and entry for navigation in the sidebar.

      .directive 'heliSection', () ->
        result =
          restrict: "A"
          replace: true
          transclude: true
          scope: { heading: '@heading', id: '@bodyId', source: '=source', when: '=when' }
          template: '<div class="row-fluid ng-hide">' +
                    '<div class="tab-content">' +
                    '<div class="tab-pane active">' +
                    '<div class="row-fluid">' +
                    '<h3 id="{{id}}">{{heading}} <small class="source ng-hide"></small></h3>' +
                    '</div>' +
                    '<div class="body" ng-transclude></div>' +
                    '</div' +
                    '</div>'
          link: (scope, iElement, iAttrs, controller) ->

            navElement = jQuery("#sidebar .nav-list")
            id = iAttrs["bodyId"]
            heading = iAttrs["heading"]
            newElement = jQuery("<li class='ng-hide'><a class='nav-section' href='#" + id + "'>" + heading + "</a></li>")
            newElement.appendTo(navElement)
            newElement.click (e) ->
              e.preventDefault()
              e.stopPropagation()
              target = e.currentTarget.firstChild.getAttribute('href')
              offset = jQuery(target).offset().top - 150
              jQuery("body").animate({scrollTop: offset}, 'slow')
              true

            # If there's a when attribute, this is a conditional section. We should hide it
            # any time we get a false value. This includes the TOC entry, too.
            if iAttrs.when?
              scope.$watch 'when', (value) ->
                newElement.toggleClass('ng-hide', !value?)
                jQuery(iElement).toggleClass('ng-hide', !value?)

            if iAttrs.source?
              scope.$watch 'source', (source) ->
                if source?
                  sourceElement = iElement.find(".source")
                  sourceElement.append 'Source: <a href="' + source.url + '" rel="external">' + source.name + '</a'
                  jQuery(sourceElement).toggleClass('ng-hide', !source?)

            else
              jQuery(iElement).toggleClass('ng-hide')
              newElement.toggleClass('ng-hide')
