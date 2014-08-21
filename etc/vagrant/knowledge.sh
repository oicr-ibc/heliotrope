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

# Script to build the knowledge base
# Your VM will probably need about 60Gb to do all this. A big slice of this is the
# fasta files for the reference genome. 

INSTALL_BASE=`pwd`

sudo apt-get install curl cvs perlbrew

# Set up a local perl5.16.3 with cpanm
perlbrew init
echo "source ~/perl5/perlbrew/etc/bashrc" >~/.bash_profile
source ~/perl5/perlbrew/etc/bashrc
perlbrew install 5.16.3
perlbrew switch perl-5.16.3
curl -L http://cpanmin.us | perl - App::cpanminus

# Install MongoDB server
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
sudo apt-get update
sudo apt-get install -y mongodb-10gen

# Install Perl dependencies
cpanm common::sense File::HomeDir DateTime::Format::Natural Convert::Scalar CHI Moose MooseX::Singleton MongoDB DBI DBD::SQLite IO::CaptureOutput

# See: http://may2012.archive.ensembl.org/info/docs/webcode/install/ensembl-code.html
mkdir ensembl
pushd ensembl
cvs -d :pserver:cvsuser:CVSUSER@cvs.sanger.ac.uk:/cvsroot/ensembl  login
cvs -d :pserver:cvsuser@cvs.sanger.ac.uk:/cvsroot/ensembl co -r branch-ensembl-72 ensembl-tools
popd

# It would be very nice if the Ensembl VEP installer accepted enough command
# line options to drive the input. It doesn't. In addition, some if it is 
# conditional on context, such as the existence of the cache directory.
# Alleviate that by ensuring the context.

rm -rf ~/.vep
mkdir ~/.vep

# By the way, this will take a (long) while, as we're downloading seriously large
# amounts of stuff, including the whole of Ensembl, basically. Also, they're coming
# from Europe as there are no North American FTP mirrors. 

rsync -av -P rsync://ftp.ensembl.org/ensembl/pub/release-72/variation/VEP/homo_sapiens_vep_72.tar.gz .
tar xvfz homo_sapiens_vep_72.tar.gz
mv homo_sapiens ~/.vep/homo_sapiens

# We also need the human reference genome
mkdir dna
rsync -av -P rsync://ftp.ensembl.org/ensembl/pub/release-72/fasta/homo_sapiens/dna/Homo_sapiens.GRCh37.72.dna.primary_assembly.fa.gz \
  dna/Homo_sapiens.GRCh37.72.dna.primary_assembly.fa.gz
gzip -d dna/Homo_sapiens.GRCh37.72.dna.primary_assembly.fa.gz

rm -f installer_config.txt
echo "n" >> installer_config.txt

perl INSTALL.pl < installer_config.txt

# Testing VEP
# perl variant_effect_predictor.pl \
#      --fork 4 \
#      --format vcf --compress zcat --offline --canonical --check_existing --force_overwrite --numbers \
#      --buffer_size 5000 --sift b --polyphen b --hgvs \
#      --fasta ~/dna/ \
#      --input_file ~/test_snps.vcf \
#      --output_file ~/test_snps_out.vcf

# And our code...

git clone git@github.com:oicr-ibc/heliotrope.git
pushd heliotrope
git checkout develop
cd etc/scripts

# Build the knowledge base
export HELIOTROPE_DATABASE_NAME=heliotrope

# Takes a few seconds at most
perl -I. boot.pl

# Loading Ensembl - four core VM time: 
perl -I. ensembl.pl

# COSMIC 
export VEP_HOME=ensembl/ensembl-tools/scripts/variant_effect_predictor
export HELIOTROPE_FASTA_DIRECTORY=$INSTALL_BASE/dna
perl -I. -Iensembl/ensembl-tools/scripts/variant_effect_predictor cosmic.pl

