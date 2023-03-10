#!/bin/bash

if [[ -z "$1" ]]; then
  exit 1
else
  # echo -v $1
  # /usr/bin/whoami
  ssh  -i "/home/aumon/.ssh/keys/sshsuspend.caixo.pem" -o PasswordAuthentication=no $1 -t "sudo systemctl suspend"
fi


