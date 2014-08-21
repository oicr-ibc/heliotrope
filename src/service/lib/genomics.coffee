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

module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

## Some stuff of general usefulness in handling genomics data. This is important when handling some of
## the more data-rich aspects of genomic data, for example.

aminoAcidCodes = {
  "Ala" : "A",
  "Arg" : "R",
  "Asn" : "N",
  "Asp" : "D",
  "Cys" : "C",
  "Gln" : "Q",
  "Glu" : "E",
  "Gly" : "G",
  "His" : "H",
  "Ile" : "I",
  "Leu" : "L",
  "Lys" : "K",
  "Met" : "M",
  "Phe" : "F",
  "Pro" : "P",
  "Ser" : "S",
  "Thr" : "T",
  "Trp" : "W",
  "Tyr" : "Y",
  "Val" : "V",
};

aminoAcidNames = {}
for own key, value of aminoAcidCodes
  aminoAcidNames[aminoAcidCodes[key]] = key

module.exports.aminoAcidCodes = aminoAcidCodes
module.exports.aminoAcidNames = aminoAcidNames

reverseCodeTable = {
  "A" : "T",
  "C" : "G",
  "G" : "C",
  "T" : "A"
}

codePattern = new RegExp("[" + (key for own key of aminoAcidNames).join("") + "]", "g")
namePattern = new RegExp("(?:" + (key for own key of aminoAcidCodes).join("|") + ")", "g")

module.exports.convertCodesToNames = (string) ->
  string.replace codePattern, (match) -> aminoAcidNames[match]

module.exports.convertNamesToCodes = (string) ->
  string.replace namePattern, (match) -> aminoAcidCodes[match]

module.exports.invertSequence = (string) ->
  string.replace /[ACGT]/g, (match) -> reverseCodeTable[match]
