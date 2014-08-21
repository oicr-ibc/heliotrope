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

'use strict'

# http://docs.angularjs.org/guide/dev_guide.e2e-testing

describe 'heliotrope', () ->

  beforeEach () ->
    browser().navigateTo '../../app/index.html'

  it 'should automatically redirect to / when location hash/fragment is empty', () ->
    expect(browser().location().url()).toBe("")

  describe 'gene page', () ->

    beforeEach () ->
      browser().navigateTo('/genes/KRAS')

    it 'should render KRAS page when user navigates to /genes/KRAS', () ->
      sleep(3)
      expect(element('h1:first').text()).toMatch("KRAS")

  describe 'home page', () ->

    beforeEach () ->
      browser().navigateTo('/')

    it 'should render home page when user navigates to /', () ->
      sleep(3)
      expect(element('h1:first').text()).toMatch("Most frequently mutated genes")
