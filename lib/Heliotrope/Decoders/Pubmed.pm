package Heliotrope::Decoders::Pubmed;

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

use common::sense;

use Moose;

extends 'Heliotrope::Util::XMLtoJSON';

has element_list_entries => (
  is => 'rw',
  default => sub { {
    "/Article/AuthorList/Author" => 1,
    "/Article/Abstract/AbstractText" => 1,
    "/Article/PublicationTypeList/PublicationType" => 1,
    "/Article/DataBankList/DataBank" => 1,
    "/Article/DataBankList/DataBank/AccessionNumberList/AccessionNumber" => 1,
    "/Article/Language" => 1,
    "/Article/ELocationID" => 1,
    "/ChemicalList/Chemical" => 1,
    "/MeshHeadingList/MeshHeading" => 1,
    "/MeshHeadingList/MeshHeading/QualifierName" => 1,
    "/CitationSubset" => 1,
    "/Article/GrantList/Grant" => 1,
    "/OtherID" => 1,
    "/CommentsCorrectionsList/CommentsCorrections" => 1,
    "/KeywordList" => 1,
    "/KeywordList/Keyword" => 1,
    "/GeneralNote" => 1,
    "/InvestigatorList/Investigator" => 1,
    "/SupplMeshList/SupplMeshName" => 1,
    "/PersonalNameSubjectList/PersonalNameSubject" => 1,
    "/GeneSymbolList/GeneSymbol" => 1
  } }
);

has object_list_entries => (
  is => 'rw',
  default => sub { {"/Article/Abstract/AbstractText" => 1} }
);

has date_list_entries => (
  is => 'rw',
  default => sub { {
    "/DateCreated" => 1,
    "/DateCompleted" => 1,
    "/DateRevised" => 1,
    "/Article/ArticleDate" => 1
  } }
);

has ordered => (
  is => 'rw',
  default => sub { 0; },
);

1;