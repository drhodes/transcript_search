#!/usr/bin/env bash

# iterate over directories in
TRANSCRIPTS=transcripts
JSON_TRANSCRIPTS=js/json-transcripts

for d in $(find $TRANSCRIPTS/* -type d); do
    echo processing $d;
    ./tsearch.py -d $d > $JSON_TRANSCRIPTS/$(basename $d).json
done
