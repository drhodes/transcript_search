build:
	echo ok

test:
	sleep .1
	./tsearch.py -d ./transcripts

json:
	echo "JSON_transcripts=" > ./js/transcripts.js
	./tsearch.py -d ./transcripts >> ./js/transcripts.js
	echo ";" >> ./js/transcripts.js

# check for dependencies more reliably.


deps:
	@echo "Hello,"
	@echo "you'll need pysrt"
	@echo "to learn more, goto https://pypi.python.org/pypi/pysrt"

add:
	git add -A

commit:
	git commit -a


clean: .SILENT
	# cleanup emacs tmp files quietly.
	-trash *~ 2> /dev/null || true
	-trash ./js/*~ 2> /dev/null || true
	-trash ./js/transcripts.js 2> /dev/null || true


.SILENT:
