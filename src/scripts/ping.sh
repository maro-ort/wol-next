#!/bin/bash

if [[ -z "$1" ]]; then
  exit 1
else
  /usr/bin/ping -c 1 $1 &> /dev/null && echo -n true || exit 1
fi


