npm install
bower install
node node_modules/gulp/bin/gulp.js build-all
node node_modules/gulp/bin/gulp.js dist
vagrant up --no-provision
ansible-playbook -v -i .vagrant/provisioners/ansible/inventory/vagrant_ansible_inventory --private-key=~/.vagrant.d/insecure_private_key -u vagrant packaging.yml


## Testing the package really works best when you can install dependencies as well as a .deb

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org

sudo apt-get install gdebi-core
sudo gdebi -n /vagrant/.tmp/heliotrope_0.1.0_amd64.deb
