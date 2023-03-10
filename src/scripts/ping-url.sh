#!/bin/bash

if [[ -z "$1" ]]; then
  exit 1
else
  /usr/bin/curl -I $1 &> /dev/null && echo -n true || exit 1
fi
