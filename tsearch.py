#!/usr/bin/env python
import argparse
import pysrt
import os
import re
import json

# determine URL template.
# iterate over transcripts.

PROG_DESCRIPTION = '''
Generate a JSON blob given a collection of .SRT files
'''


# URL_TEMPLATE = (
#     "https://courses.edx.org/courses/"
#     "course-v1:MITx+6.004.3x+2T2016/"
#     #"course-v1:MITx+6.004.2x+3T2015/"
#     "courseware/c<CHAPTER>/c<CHAPTER>s<SEQ>/<BLOCK>"
#     "?activate_block_id=block-v1"
#     "%3AMITx"
#     "%2B6.004.2x"
#     "%2B3T2015"
#     "%2Btype"
#     "%40discussion"
#     "%2Bblock"
#     "%40c<CHAPTER>s<SEQ>v<BLOCK>"
# )

URL_TEMPLATE = (
    "https://courses.edx.org/courses/"
    "course-v1:MITx+6.004.3x+2T2016/"
    "courseware/c<CHAPTER>/c<CHAPTER>s<SEQ>/<BLOCK>"
    "?activate_block_id=block-v1"
    "%3AMITx"
    "%2B6.004.3x"
    "%2B2T2016"
    "%2Btype"
    "%40discussion"
    "%2Bblock"
    "%40c<CHAPTER>s<SEQ>v<BLOCK>"
)



# https://courses.edx.org/courses/
# course-v1:MITx+6.004.2x+3T2015/
# courseware/c4/c4s1/1
# ?activate_block_id=block-v1
# %3AMITx
# %2B6.004.2x
# %2B3T2015
# %2Btype
# %40discussion
# %2Bblock%40c4s1v1



def get_srt_filenames(srt_path):
    # this needs to change to os.walk if sub directories are used.
    srts = os.listdir(srt_path)
    
    if len(srts) == 0:
        raise IOError("No .srt files found in path: " + srt_path)

    files = []
    for f in srts:
        fullpath = os.path.join(srt_path, f)
        if os.path.isfile(fullpath):
            files.append(fullpath)
            
    # important, there is a convention on file naming, such that their
    # ordering informs the time sequence.   
    files.sort()
    return files

def divine_scrape_parameters(basename):
    # given C02S09B04.srt
    # return something like {sequence: 9, page: 4, chapter: 2}
    if "S" not in basename:
        raise ValueError(".srt basename must be of the form C##S##B##-[LEC|WE].srt,")

    params = {
        "sequence": "",
        "page": "",
        "chapter": "",
    }

    # if an exception happens here then it's game over.
    # robustify this.
    m = re.search('S([0-9]+)', basename)
    params["sequence"] = m.group(1).strip("0")
    m = re.search('B([0-9]+)', basename)
    params["page"] = m.group(1).strip("0")
    m = re.search('C([0-9]+)', basename)
    params["chapter"] = m.group(1).strip("0")

    return params

# note that for 6.004x.2, Sequence 9 of the course must be referred to
# as Sequence 1 in the transcript filenames, because the edx system
# sees this as a different course.
def generate_url(basename): 
    params = divine_scrape_parameters(basename)
    s = params["sequence"]
    p = params["page"]
    c = params["chapter"]
    
    # the url contains lots of % to begin with, so string
    # interpolation can't be used

    # hrm. sequence seems to be local to chapters.
    if "LEC" in basename:
        url = URL_TEMPLATE.replace("<SEQ>", "1")
    if "WE" in basename:
        url = URL_TEMPLATE.replace("<SEQ>", "2")
            
    url = url.replace("<BLOCK>", p)
    url = url.replace("<CHAPTER>", c)
    return url
   
def generate_json(srt_path):
    blob = {}
    for srt_filename in get_srt_filenames(srt_path):
        basename = os.path.split(srt_filename)[-1]
        url = generate_url(basename)
        
        # each item in srt file is a 
        items = pysrt.open(srt_filename)
        subitems = []
        for item in items:            
            subitems.append({'start': str(item.start).split(",")[0],
                             'end': str(item.end).split(",")[0],
                             'text': item.text,
                             'is_lecture': "LEC" in basename,
                             'is_worked_example': "WE" in basename,
                         })            
        item_table = {
            'url': url,
            'items': subitems,
        }        
        blob[basename] = item_table
    return json.dumps(blob)



def main():
    # output is sent to stdout, so these cmdline args are mutally
    # exclusive.
    parser = argparse.ArgumentParser(description=PROG_DESCRIPTION)  
    parser.add_argument('-d', '--srt-path',
                        dest='srt_path',
                        required=False,
                        default=None,
                        help='supply the path to a transcript directory')
    
    parser.add_argument('-p', '--pdf-path',
                        dest='pdf_path',
                        required=False,
                        default=None,
                        help='supply the path to a pdf directory')

    
    args = parser.parse_args()

    if args.pdf_path and args.srt_path:
        raise ValueError("-d and -p options are mutally exclusive")

    if args.pdf_path:
        pass

    if args.srt_path:
        print generate_json(args.srt_path)

    
if __name__ == "__main__":
    main()
