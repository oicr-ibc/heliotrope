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


Genomics functions
------------------

Some stuff of general usefulness in handling genomics data. This is important when handling some of
the more data-rich aspects of genomic data, for example.

    log4js = require("log4js")
    logger = log4js.getLogger('genomics')


A table of names to codes. This is data that is used to generate the regular expressions used
to drive the main translations later in the module.

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
      "Ter" : "X"
    };

Use that same table to build a reverse table, that is used to generate the regular expressions
needed to translate codes back to names.

    aminoAcidNames = {}
    for own key, value of aminoAcidCodes
      aminoAcidNames[aminoAcidCodes[key]] = key

    module.exports.aminoAcidCodes = aminoAcidCodes
    module.exports.aminoAcidNames = aminoAcidNames


A reverse code table, which is needed if we ever have to interpret data from a different strand.

    reverseCodeTable = {
      "A" : "T",
      "C" : "G",
      "G" : "C",
      "T" : "A"
    }

    codePattern = new RegExp("[" + (key for own key of aminoAcidNames).join("") + "]", "g")
    namePattern = new RegExp("(?:" + (key for own key of aminoAcidCodes).join("|") + ")", "g")


Exports a function, `convertCodesToNames`, which translates single-letter amino-acid codes
to three-letter names.

    module.exports.convertCodesToNames = (string) ->
      string.replace codePattern, (match) -> aminoAcidNames[match]


Exports a function, `convertNamesToCodes`, which translates three-letter amino-acid names
to single-letter codes. This is used, for example, to generate the short version HGVS nomenclature
from the long version that is generated by the Ensembl VEP tool.

    module.exports.convertNamesToCodes = (string) ->
      string.replace namePattern, (match) -> aminoAcidCodes[match]


Exports a function, `invertSequence`, which inverts the sequence, mapping A to T, C to G, G to C, and T to A.
This is needed for handling reverse strands.

    module.exports.invertSequence = (string) ->
      string.replace /[ACGT]/g, (match) -> reverseCodeTable[match]
