TRANSCRIPT_FILE=./js/json-transcripts/6.004.3x.json
TRANSCRIPT_PATH=./transcripts/6.004.3x

build:
	echo ok

test:
	sleep .1
	./tsearch.py -d $(TRANSCRIPT_PATH)

json:
	./build-json.bash

# check for dependencies more reliably.
deps:
	@echo "Hello,"
	@echo "you'll need pysrt"
	@echo "to learn more, goto https://pypi.python.org/pypi/pysrt"

add:
	git add -A

commit:
	git commit -a

work:
	emacs -nw tsearch.html tsearch.py Makefile battle-plan.org ./js/display.js 

clean: 
	-trash *~ 2> /dev/null || true
	-trash ./js/*~ 2> /dev/null || true
	-trash ./js/transcripts.js 2> /dev/null || true
	-trash *.pyc 2> /dev/null || true

