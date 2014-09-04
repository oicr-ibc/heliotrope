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


Tracker controllers
-------------------

This module provides all the controllers used by the tracker.

    angular
      .module 'heliotrope.controllers.tracker', [
        'heliotrope.services.common'
        'heliotrope.services.tracker'
      ]


Controller for the study list.

      .controller 'StudyListController', Array '$scope', '$routeParams', 'StudyList', ($scope, $routeParams, StudyList) ->
        $scope.studies = StudyList.get($routeParams
          (study) ->

          (error) ->
            console.log error
        )


Controller for a single study.

      .controller 'StudyController', Array '$scope', '$routeParams', 'Study', ($scope, $routeParams, Study) ->
        $scope.study = Study.get($routeParams
          (study) ->

          (error) ->
            console.log error
        )


Controller for a single entity, i.e., a participant, sample, or even observation.

      .controller 'EntityController', Array '$scope', '$routeParams', 'Entity', ($scope, $routeParams, Entity) ->
        $scope.entity = Entity.get($routeParams
          (entity) ->

          (error) ->
            console.log error
        )


Controller for a single entity step.

      .controller 'EntityStepController', ['$scope', '$routeParams', '$location', 'EntityStep', ($scope, $routeParams, $location, EntityStep) ->
        $scope.entity = EntityStep.get($routeParams
          (entityStep) ->

          (error) ->
            console.log error
        )

        # This is where the step data is pushed back to the service.
        $scope.update = (entity) ->
          entityUrl = '/studies/' + encodeURIComponent(entity.data.study.name) + '/' + encodeURIComponent(entity.data.role) + '/' + encodeURIComponent(entity.data.identity)
          entity.$save(
            {study: $routeParams.study, role: $routeParams.role, identity: $routeParams.identity, step: $routeParams.step},
            (entityStep, responseHeaders) ->
              $location.path(entityUrl).replace()
            (error) ->
              console.log "Error from $save", error
              $scope.error = error
          )
      ]


Controller for administering a set of studies.

      .controller 'AdminController', Array '$scope', '$routeParams', 'StudyList', ($scope, $routeParams, StudyList) ->

        $scope.studiesAvailable = false

        $scope.studies = StudyList.get(
          {}
          () -> $scope.studiesAvailable = true
          () ->
        )


A relatively neutral controller that can create an initial empty study or
retrieve an identified one. We can always well which by the presence/absence
of the _id.

      .controller 'AdminStudyController', Array '$scope', '$routeParams', '$location', 'Study', ($scope, $routeParams, $location, Study) ->

        $scope.study = new Study()

        if ($routeParams["study"])
          $scope.study = Study.get($routeParams
            (study) ->

            (error) ->
              console.log error
          )

        $scope.update = () ->
          $scope.study.$save()
          $location.path("admin")

        $scope.newStep = (study) ->
          $location.path("admin/steps/" + study.data.name)

        $scope.editStep = (study, step) ->
          $location.path("admin/steps/" + study.data.name + "/" + step["appliesTo"] + "/" + step["name"])


A relatively neutral controller that can create an initial empty study step or
retrieve an identified one. We can always well which by the presence/absence
of the _id.

      .controller 'AdminStepController', Array '$scope', '$routeParams', 'Step', 'Study', ($scope, $routeParams, Step, Study) ->

        $scope.original = new Step()

        $scope.fieldTypes = ["String", "Boolean", "Integer", "Reference", "Float", "File", "Date"]
        $scope.controlTypes = ["identity", "select", "date", "integer", "textarea", "file", "reference", "chooser", "checkbox", "float", "hidden", "text"]

        $scope.step = new Step()
        $scope.fields = []

        # We actually unpack fields into a separate array, because iterating over a
        # hash is really bad form. We therefore need to repack on save.
        initializeFields = () ->
          if $scope.step.data.step.fields
            fields = angular.copy($scope.step.data.step.fields)
            $scope.fields = Object.keys(fields).map (key) ->
              field = fields[key]
              field["key"] = key
              field

        if $routeParams["study"] && $routeParams["role"] && $routeParams["step"]
          $scope.step = Step.get($routeParams
            (step) ->
              angular.copy($scope.step, $scope.original)
              initializeFields()
            (error) ->

          )
        else if $routeParams["study"]
          study = Study.get($routeParams
            (study) ->
              $scope.step.data = {}
              $scope.step.data.study = angular.copy(study.data)
          )

        $scope.update = () ->

          fields = new Object
          $scope.fields.forEach (field) ->
            key = field["key"]
            delete field["key"]
            fields[key] = field

          if ! $scope.step.data
            $scope.step.data = {}
          if ! $scope.step.data.step
            $scope.step.data.step = {}
          $scope.step.data.step.fields = fields

          $scope.step.$save({study: $scope.step.data.study.name, role: $scope.step.data.step.appliesTo, step: $scope.step.data.step.name})
          $location.path("admin/studies/" + $scope.step.data.study.name + "/steps")

        $scope.resetStep = () ->
          angular.copy($scope.original, $scope.step)
          initializeFields()

        $scope.addField = () ->
          $scope.fields.push
            key: "newfield"


A relatively neutral controller that can create an initial empty study view or
retrieve an identified one. We can always well which by the presence/absence
of the _id.

      .controller 'AdminViewController', Array '$scope', '$routeParams', '$location', 'View', 'Study', ($scope, $routeParams, $location, View, Study) ->

        $scope.original = new View($routeParams)

        $scope.view = new View($routeParams)

        if $routeParams["study"] && $routeParams["role"] && $routeParams["view"]
          $scope.view = View.get($routeParams
            (view) ->
              angular.copy($scope.view, $scope.original)
            (error) ->
              console.log error
          )
        else if $routeParams["study"]
          study = Study.get($routeParams
            (study) ->
              $scope.view.data = {}
              $scope.view.data.study = angular.copy(study.data)
          )

        $scope.resetView = () ->
          angular.copy($scope.original, $scope.view)

        $scope.update = () ->
          $scope.view.$save({study: $scope.view.data.study.name, role: $scope.view.data.view.role, view: $scope.view.data.view.name})
          $location.path("admin/studies/" + $scope.view.data.study.name + "/views")


A relatively neutral controller that can manage a set of study views.

      .controller 'AdminViewsController', Array '$scope', '$routeParams', '$location', 'Views', ($scope, $routeParams, $location, Views) ->

        $scope.views = Views.get($routeParams
          (study) ->

          (error) ->
            console.log error
        )

        $scope.newView = (study) ->
          $location.path("admin/views/" + $scope.views.data.study.name)

        $scope.editView = (study, view) ->
          $location.path("admin/views/" + $scope.views.data.study.name + "/" + view["role"] + "/" + view["name"])


A controller for user management. This manages the Users service, which allows
users and passwords to be managed within the application, roles to be assigned, and
so on. User authentication through LDAP is also available.

      .controller 'AdminUsersController', Array '$scope', '$routeParams', '$location', 'Users', ($scope, $routeParams, $location, Users) ->

        $scope.error = false

        $scope.original = new Users

        if ! $routeParams["create"]
          $scope.users = Users.get($routeParams
            (users) ->
              angular.copy($scope.users, $scope.original)
            (error) ->
              console.log error
          )
        else
          $scope.users = new Users

        $scope.cancel = () ->
          $location.path("admin/users")

        $scope.reset = () ->
          angular.copy($scope.original, $scope.users)

        $scope.create = () ->
          console.log "Create new user"
          $location.path("admin/users/newuser?create")

        $scope.update = () ->
          $scope.users.$save(
            (users) ->
              $location.path("admin/users")
            (error) ->
              $scope.error = error
          )
