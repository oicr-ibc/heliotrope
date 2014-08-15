npm install
bower install
node node_modules/gulp/bin/gulp.js build-all
node node_modules/gulp/bin/gulp.js dist
vagrant up
ansible-playbook -v -i .vagrant/provisioners/ansible/inventory/vagrant_ansible_inventory --private-key=~/.vagrant.d/insecure_private_key -u vagrant packaging.yml
