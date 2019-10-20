#!/bin/bash
echo '-=Installing Ukuu=-'
sudo apt-add-repository ppa:teejee2008/ppa -y
sudo apt update
apt install ukuu -y
echo '-=Script Finished=-'