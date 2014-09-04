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

Workflow directives
-------------------


A module for workflow-related directives.

    angular
      .module 'heliotrope.directives.workflows', []


The `heli-choose-step` directive provides a drop-down control that you can use to choose a
workflow (step) to apply to an entity.

      .directive 'heliChooseStep', () ->
        result =
          restrict: "A"
          replace: true
          transclude: true
          template: '<form>' +
                    '<div class="control-group">' +
                    '<label class="control-label" for="apply-workflow">Apply step</label>' +
                    '<div class="controls">' +
                    '<div class="btn-group">' +
                    '<a class="btn dropdown-toggle" data-toggle="dropdown">Choose step <b class="caret"></b></a>' +
                    '<div heli-workflows></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</form>'
