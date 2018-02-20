#!/bin/sh
pm2 -n RaspberryCar --max-restarts 1 --cwd ${PWD} start app.js
