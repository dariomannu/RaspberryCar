#!/bin/bash

HOST=172.20.80.165
rsync -avz ./ pi@$HOST:/home/pi/RaspberryCar/ --exclude=node_modules

