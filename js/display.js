// control the display for search
//
var nil = null;

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
    
    var lec = JSON_transcripts[lecId];
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

function insertResults(resultStrings) { // [string] -> DOM ()
    // concat the results
    var catted = resultStrings.join("");
    var results = $("#results");
    results.append(catted);
}

function clearResultsDiv() {
    $("#results").empty();
}

function refreshResults(terms) {
    clearResultsDiv();
    var lectures = Object.keys(JSON_transcripts);
    var numFound = 0;
    const limit = 25;
    var accum = [];
    
    lectures.forEach(function(lecId){
        if (accum.length >= limit) {                    
            return;
        }
        
        var lecture = JSON_transcripts[lecId];
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

var app = angular.module('app', []);
app.controller('myCtrl', function($scope) {
    $scope.search = function() {
        return refreshResults($scope.terms);
    };
    
});


