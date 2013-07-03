# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "precise64"

  # The url from where the 'config.vm.box' box will be fetched if it
  # doesn't already exist on the user's system.
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  # Our bootstrapping
  config.vm.provision :shell, :path => "etc/vagrant/bootstrap.sh"

  # Redirect networking from host to guest
  # Now you can navigate to https://localhost:8443/
  config.vm.network :forwarded_port, guest: 443, host: 8443

  # For VirtualBox, set RAM availability. 
  config.vm.provider "virtualbox" do |v|
    v.customize ["modifyvm", :id, "--memory", 1024]
  end
  
end
