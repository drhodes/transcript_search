TRANSCRIPT_FILE=./js/transcripts.js

build:
	echo ok

test:
	sleep .1
	./tsearch.py -d ./transcripts

json:
	echo "JSON_transcripts=" > $(TRANSCRIPT_FILE)
	./tsearch.py -d ./transcripts >> $(TRANSCRIPT_FILE)
	echo ";" >> $(TRANSCRIPT_FILE)

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

