// control the display for search
//
var nil = null;

function SearchModule() {
    // everything in this function is private except the last
    // function, which is returned as an interface to the search
    // functionality

    // ------------------------------------------------------------------
    // parse the URL parameters and determine
    // going to need this soon
    // https://stackoverflow.com/questions/8486099
    // thanks @ Jan Turoň
    // function getJsonFromUrl() {
    //     var query = location.search.substr(1);
    //     var result = {};
    //     query.split("&").forEach(function(part) {
    //         var item = part.split("=");
    //         result[item[0]] = decodeURIComponent(item[1]);
    //     });
    //     return result;
    // }
    
    // ------------------------------------------------------------------
    // Set aside a place for loading the transcript into
    var JSON_TRANSCRIPTS = {};
    var url = "https://drhodes.github.io/transcript_search/js/json-transcripts/6.004.2x.json";
    $.getJSON(url, function(json) {
        JSON_TRANSCRIPTS = json;
        console.log( "JSON Data: " + json );
    });
    
    function hasDirectiveWE(terms) {
        return $.inArray("#we", terms) != -1;
    }

    function hasDirectiveLEC(terms) {
        return $.inArray("#lec", terms) != -1;
    }

    function removeDirectives(terms) {
        return terms
            .filter(function(x) { return x != "#lec"; })
            .filter(function(x) { return x != "#we"; }); 
    }

    // slow linear search is good enough for now.    
    // Terms -> [items that contain terms]
    function searchForTerms(lecId, searchTerms) {
        if (searchTerms == nil) {
            return [];
        }
        
        var lec = JSON_TRANSCRIPTS[lecId];
        var items = lec.items;
        searchTerms = searchTerms.toLowerCase();
        terms = searchTerms.split(" ");

        // which directives are set?
        var workedExamplesOnly = hasDirectiveWE(terms);
        var lecturesOnly = hasDirectiveLEC(terms);
        terms = removeDirectives(terms);

        var results = [];

        // check to see if item.text contains all terms
        items.forEach(function(item) {
            txt = item.text.toLowerCase();
            // iterate over terms

            var allTermsMatch = true;
            terms.forEach(function(term) {
                if (txt.indexOf(term) == -1) {
                    // couldn't find this term in the item text
                    allTermsMatch = false;
                    return;
                } 
            });

            if (allTermsMatch) {
                if (workedExamplesOnly && item.is_worked_example) {
                    results.push(item);
                }
                if (lecturesOnly && item.is_lecture) {
                    results.push(item);
                }
                if (!lecturesOnly && !workedExamplesOnly) {
                    results.push(item);
                }
            }            
        });
        
        return results;
    }

    function generateDiv(url, item) { // -> string
        var resultStr = "";
        
        resultStr += "<hr>";
        resultStr += "<p>" + item.text + "</p>";

        if (item.is_worked_example) {
            resultStr += "<span>worked example <a href='" + url + "'>lecture</a><span>";
        } else { 
            resultStr += "<span><a href='" + url + "'>lecture</a><span>";
        }
        resultStr += " from time: ";
        resultStr += item.start; 
        resultStr += " to ";
        resultStr += item.end;
        return resultStr;
    }

    // take a list of strings, concat them and insert them into the dom.
    function insertResults(resultStrings) { // [string] -> DOM ()
        // concat the results
        var catted = resultStrings.join("");
        var results = $("#results");
        results.append(catted);
    }

    // clear out the results div
    function clearResultsDiv() {
        $("#results").empty();
    }

    // This is the only function that needs to be visible.
    function refreshResults(terms, course) {
        // As of now, this course variable is ignored.  Soon it will
        // be used to select the appropriate JSON_TRANSCRIPTS.
        clearResultsDiv();
        var lectures = Object.keys(JSON_TRANSCRIPTS);
        var numFound = 0;
        const limit = 25;
        var accum = [];
        
        lectures.forEach(function(lecId){
            if (accum.length >= limit) {                    
                return;
            }
            
            var lecture = JSON_TRANSCRIPTS[lecId];
            var results = searchForTerms(lecId, terms);
            if (results.length!=0) {
                numFound += results.length;
                results.forEach(function(item){
                    accum.push(generateDiv(lecture.url, item));
                });            
            }
        });
        
        insertResults(accum);

        if (accum.length > limit) {
            return "more than " + numFound;
        }

        return "exactly " + numFound;
    }

    return refreshResults;
}


var app = angular.module('app', []);
app.controller('myCtrl', function($scope) {
    var course = "6.004.2x";
    // Eventually uncomment this code and use the params to 
    // var params = getJsonFromUrl();
    // if (params.course != "6.004.2x") {
    //     // course isn't defined.
    //     alert("Search isn't implemented for course: " + params.course);
    // }
    
    var refreshResults = SearchModule();
    
    $scope.search = function() {
        return refreshResults($scope.terms, course);
    };    
});
