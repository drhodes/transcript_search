<div id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#sec-1">1. Transcript search for 6.004.2x</a>
<ul>
<li><a href="#sec-1-1">1.1. Description</a></li>
<li><a href="#sec-1-2">1.2. Features</a></li>
<li><a href="#sec-1-3">1.3. Considerations</a></li>
<li><a href="#sec-1-4">1.4. UI</a></li>
</ul>
</li>
</ul>
</div>
</div>

# Transcript search for 6.004.2x<a id="sec-1" name="sec-1"></a>

## Description<a id="sec-1-1" name="sec-1-1"></a>

Until edx gets a search feature for transcripts, this should suffice.
It's not pretty, but it works without any backend. If you want to add
something, then clone, hack and pull request. I'll most likely merge it.

## Features<a id="sec-1-2" name="sec-1-2"></a>

-   Allow users to search the transcripts.
-   Updates result on the fly.
-   Supply URLs back to the edx platform.
-   Supply transcript snippets.
-   Specify lecture or worked example by #LEC or #WE

## Considerations<a id="sec-1-3" name="sec-1-3"></a>

-   Don't need to optimize this, the data set is small.  linear search
    should work fine! If it slows down later, then maybe there is a js
    version of sqlite that could access local storage, or maybe index
    with a bloom filter.

-   Should run completely in javascript

-   python will rummage around and emit a json blob that can be embedded
    in a single html file for people to run locally if they want, or
    access directly from github

-   simple UI

## UI<a id="sec-1-4" name="sec-1-4"></a>

-   A form field with update-as-you-type search results.
