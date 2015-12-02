#!/usr/bin/env bash

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

# Download and install the prerequisites
sudo apt-get update
sudo apt-get install -y ssl-cert adduser daemon psmisc nginx-light libc6 libssl-dev build-essential pkg-config git

sudo adduser --system --home /usr/lib/heliotrope --no-create-home --disabled-password heliotrope
sudo mkdir -p /usr/lib/heliotrope
sudo mkdir -p /etc/heliotrope
sudo chown -R heliotrope:adm /usr/lib/heliotrope

sudo -u heliotrope git clone https://github.com/oicr-ibc/heliotrope.git /usr/lib/heliotrope

# Download and install the node.js stuff
pushd /tmp
wget -q https://nodejs.org/download/release/v0.12.8/node-v0.12.8.tar.gz
mkdir node-latest-install
cd node-latest-install
tar xz --strip-components=1 < ../../node-v0.12.8.tar.gz
./configure --shared-openssl --shared-zlib --prefix=/usr/lib/heliotrope/node
make
sudo make install
sudo chown -R heliotrope:adm /usr/lib/heliotrope/node
popd
rm -rf /tmp/node-v0.12.8.tar.gz node-latest-install

# Now for MongoDB
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
sudo echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
sudo apt-get update
sudo apt-get install -y mongodb-org=2.6.11

# We also need a JRE
sudo apt-get install -y openjdk-7-jre

# Get the data
pushd /tmp
wget -q -O "heliotrope-dump-1.3.tar.bz2" "https://googledrive.com/host/0B75vAAGHtrjaRGdaQV8wX3VrNVE/heliotrope-dump-1.3.tar.bz2"
mkdir dump
pushd dump
tar xvfj ../heliotrope-dump-1.3.tar.bz2
popd

# Stuff the data into the MongoDB database
mongorestore --db heliotrope dump/heliotrope
rm -rf heliotrope-dump-1.3.tar.bz2 dump/heliotrope

# Now install the required components
pushd /usr/lib/heliotrope
sudo -u heliotrope HOME=/usr/lib/heliotrope PATH=/usr/lib/heliotrope/node/bin:$PATH node/bin/npm install
sudo -u heliotrope HOME=/usr/lib/heliotrope PATH=/usr/lib/heliotrope/node/bin:$PATH node/bin/npm install bower
sudo -u heliotrope HOME=/usr/lib/heliotrope PATH=/usr/lib/heliotrope/node/bin:$PATH node/bin/npm install gulp
sudo -u heliotrope HOME=/usr/lib/heliotrope PATH=/usr/lib/heliotrope/node/bin:$PATH node/bin/node node_modules/bower/bin/bower install --config.interactive=false
sudo -u heliotrope HOME=/usr/lib/heliotrope PATH=/usr/lib/heliotrope/node/bin:$PATH node/bin/node node_modules/gulp/bin/gulp build-all
sudo -u heliotrope HOME=/usr/lib/heliotrope PATH=/usr/lib/heliotrope/node/bin:$PATH node/bin/node node_modules/gulp/bin/gulp dist
sudo -u heliotrope HOME=/usr/lib/heliotrope PATH=/usr/lib/heliotrope/node/bin:$PATH node/bin/npm rebuild
sudo -u heliotrope node/bin/node dist/utils/addAdminUser.js --username "admin" --password "admin"
popd

# Also load the sample tracker data
mongo tracker </usr/lib/heliotrope/src/service/utils/testStudyData.js

# Now set up the nginx site
sudo cp /usr/lib/heliotrope/roles/webserver/templates/nginx-config.j2 /etc/nginx/sites-available/heliotrope
sudo ln -s /etc/nginx/sites-available/heliotrope /etc/nginx/sites-enabled/heliotrope
sudo sed -i "s/root \/usr\/lib\/heliotrope;/root \/usr\/lib\/heliotrope\/dist;/" /etc/nginx/sites-available/heliotrope
sudo service nginx restart

# And finally, set up the heliotrope service, and then start it
sudo cp /usr/lib/heliotrope/roles/webapp/templates/heliotrope-config.json.j2 /etc/heliotrope/config.json
sudo sed -i "s/{% if mongodb_user %}{{mongodb_user}}:{{mongodb_password}}@{% endif %}//" /etc/heliotrope/config.json
sudo sed -i "s/{{mongodb_server}}/localhost/" /etc/heliotrope/config.json
sudo sed -i "s/{{mongodb_port}}/27017/" /etc/heliotrope/config.json
sudo sed -i "s/{{mongodb_name}}/heliotrope/" /etc/heliotrope/config.json
sudo sed -i "s/mongodb:\/\/\:\@/mongodb:\/\//" /etc/heliotrope/config.json

sudo cp /usr/lib/heliotrope/roles/webapp/templates/upstart-heliotrope.conf.j2 /etc/init/heliotrope.conf
sudo sed -i "s/\/usr\/lib\/heliotrope/\/usr\/lib\/heliotrope\/dist/g" /etc/init/heliotrope.conf
sudo sed -i "s/\/usr\/lib\/heliotrope\/dist\/node/\/usr\/lib\/heliotrope\/node/g" /etc/init/heliotrope.conf

sudo service heliotrope start

# We're done if we get here
echo "All done :-)"
