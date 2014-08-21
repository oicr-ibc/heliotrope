#!/bin/bash

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

# This script initializes the knowledge base. Best run when you have plenty of time
# to spare.

export TMPDIR=

export HELIOTROPE_DATABASE_NAME=heliotrope_new
export HELIOTROPE_DATABASE_SERVER=localhost:27017
export HELIOTROPE_DATABASE_USERNAME=
export HELIOTROPE_DATABASE_PASSWORD=

export HELIOTROPE_CACHE_ROOT=/Volumes/LaCie/data/heliotrope

export VEP_HOME=
export VEP_CACHE_DIRECTORY=

perl boot.pl --force
perl ensembl.pl --force
perl cosmic.pl --force
perl entrez.pl --force
perl cancer_gene_census.pl --force
perl statistics.pl --force
