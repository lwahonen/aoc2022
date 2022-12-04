#!/bin/bash
mkdir html/dist
browserify src/day00.js -o html/dist/day00.js -t [ babelify  ]