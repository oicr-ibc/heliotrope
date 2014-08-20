#!/usr/bin/env bash

# Download and install the prerequisites
sudo apt-get update
sudo apt-get install -y ssl-cert adduser daemon psmisc nginx-light libc6 build-essential pkg-config git

sudo mkdir -p /usr/lib/heliotrope
sudo mkdir -p /etc/heliotrope
sudo chown vagrant:vagrant /usr/lib/heliotrope
git clone https://github.com/oicr-ibc/heliotrope.git /usr/lib/heliotrope

# Download and install the node.js stuff
pushd /tmp
wget http://nodejs.org/dist/node-latest.tar.gz
mkdir node-latest-install
cd node-latest-install
tar xz --strip-components=1 < ../node-latest.tar.gz
./configure --shared-openssl --shared-zlib --prefix=/usr/lib/heliotrope/node
make && make install
popd
rm -rf /tmp/node-latest.tar.gz node-latest-install

# Now for MongoDB
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
sudo echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
sudo apt-get update
sudo apt-get install -y mongodb-org=2.6.4

# We also need a JRE
sudo apt-get install -y openjdk-7-jre

# Now install the required components
pushd /usr/lib/heliotrope
node/bin/npm install
node/bin/npm install bower
node/bin/npm install gulp
node/bin/node node_modules/bower/bin/bower install --config.interactive=false
node/bin/node node_modules/gulp/bin/gulp build-all
node/bin/node node_modules/gulp/bin/gulp dist
popd

# Get the data
pushd /tmp
wget -q -O "https://googledrive.com/host/0B75vAAGHtrjaRGdaQV8wX3VrNVE/heliotrope-dump-1.1.tar.bz2"
mkdir dump
pushd dump
tar xvfj ../heliotrope-dump-1.1.tar.bz2
popd

# Stuff the data into the MongoDB database
mongorestore --db heliotrope dump/heliotrope
rm -rf heliotrope-dump-1.0.tar.xz dump/heliotrope

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
/usr/lib/heliotrope/node/bin/node /usr/lib/heliotrope/dist/utils/addAdminUser.js --username "admin" --password "admin"

sudo cp /usr/lib/heliotrope/roles/webapp/templates/upstart-heliotrope.conf.j2 /etc/init/heliotrope.conf
sudo sed -i "s/\/usr\/lib\/heliotrope/\/usr\/lib\/heliotrope\/dist/g" /etc/init/heliotrope.conf
sudo sed -i "s/\/usr\/lib\/heliotrope\/dist\/node/\/usr\/lib\/heliotrope\/node/g" /etc/init/heliotrope.conf

sudo adduser --system --home /usr/lib/heliotrope --no-create-home --disabled-password heliotrope
sudo chown -R heliotrope:adm /usr/lib/heliotrope
sudo chown -R heliotrope:adm /etc/heliotrope

sudo service heliotrope start

# # We're done if we get here
# echo "All done :-)"
