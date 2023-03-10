#!/bin/bash
if [[ -z "$1" ]]; then
  exit 1
elif command -v "/usr/bin/wol" > /dev/null; then
  /usr/bin/wol $1
elif command -v "/usr/bin/wakeonlan" > /dev/null; then
  /usr/bin/wakeonlan $1
else
  exit 1
fi