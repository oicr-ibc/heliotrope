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
  .module 'heliotrope.services.interceptor', []

  .factory 'httpInterceptor', Array '$rootScope', '$q', ($rootScope, $q) ->
    result =
      request: (request) ->
        if ! request.url.match(/^\/api\/authentication/)
          $rootScope.$emit "event:startSpinner"
        request

      response: (response) ->
        $rootScope.$emit "event:stopSpinner"
        response

      responseError: (response) ->
        $rootScope.$emit "event:stopSpinner"
        status = response.status

        if status == 401
          deferred = $q.defer()
          if response.config.url.match(/^\/api\/authentication/)
            return $q.reject response
          else
            req = {config: response.config, deferred: deferred}
            $rootScope.requests401.push(req)
            $rootScope.$broadcast 'event:loginRequired'
            deferred.promise
        else
          $q.reject response
