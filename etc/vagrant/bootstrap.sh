#!/usr/bin/env bash

# Download and install the node.js stuff
apt-get update
apt-get install -y python-software-properties python g++ make xz-utils
add-apt-repository -y ppa:chris-lea/node.js
add-apt-repository -y ppa:nginx/stable
apt-get update
apt-get install -y nodejs ssl-cert

npm install -g coffee-script

# Now for MongoDB
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | tee /etc/apt/sources.list.d/10gen.list
apt-get update
apt-get install -y mongodb-10gen

# We also need a JRE and nginx
apt-get install -y openjdk-7-jre nginx

# Now let's get the stuff where we need it. Note that we need to make a copy
# because node_modules will contain binary shit. 
rm -rf /var/local/heliotrope
cp -rf /vagrant /var/local/heliotrope

# Remove node_modules, which likely contains garbage synced here
rm -rf /var/local/heliotrope/node_modules

# Remove config.json if we have one (synced from host) and put in the deployment one
rm -f /var/local/heliotrope/config.json
cp -f /vagrant/etc/vagrant/heliotrope-config.json /var/local/heliotrope/config.json

# And set up the server configuration
cp /vagrant/etc/vagrant/nginx-heliotrope.conf /etc/nginx/sites-available/heliotrope
cp /vagrant/etc/vagrant/upstart-nginx.conf /etc/init/nginx.conf
cp /vagrant/etc/vagrant/upstart-heliotrope.conf /etc/init/heliotrope.conf

# Replace the default site
rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/heliotrope /etc/nginx/sites-enabled/heliotrope

# Build
cd /var/local/heliotrope
npm install 
cake build

# Start daemons
initctl start nginx
initctl start heliotrope

# Run from the command line
# cd /var/www
# npm install
# cake build
# cake server

# Now let's get and install the database - this is a compressed pre-built data dump
# hosted on Google Drive. The build process is documented in "knowledge.sh", but it takes
# more than a few hours to run. The uncompressed BSON is about 1.5Gb, but compressed it's
# an 80Mb file which is fine to host from Google Drive. For now. 
wget -q -O heliotrope-dump-1.0.tar.xz "https://googledrive.com/host/0B75vAAGHtrjaRGdaQV8wX3VrNVE/heliotrope-dump-1.0.tar.xz"
mkdir dump
pushd dump
xzcat ../heliotrope-dump-1.0.tar.xz | tar xvf -
popd

# Stuff the data into the MongoDB database
mongorestore --db heliotrope dump/heliotrope
rm -rf heliotrope-dump-1.0.tar.xz dump/heliotrope

# Now at this stage it would also be right to boot up the test data. These are in 
# the .jsinit files, and we need to load them into the right databases. 
cat /var/local/heliotrope/test/data/user.*.jsinit | mongo user
cat /var/local/heliotrope/test/data/tracker.*.jsinit | mongo tracker

# We're done if we get here
echo "All done :-)"
