// control the display for search
//
var nil = null;



function hasDirectiveWE(terms) {
    return $.inArray("#we");
}

function hasDirectiveLEC(terms) {
    return $.inArray("#lec");
}

function removeDirectives(terms) {
    terms = jQuery.grep(terms, function(value) {
        return value != "#we" || value != "#lec";
    });
    return terms;
}

// Terms -> [items that contain terms]
function searchForTerm(lecId, term) {
    if (term == nil) {
        return [];
    }
    // slow linear search is good enough for now.    
    var lec = JSON_transcripts[lecId];
    var items = lec.items;
    term = term.toLowerCase();
    terms = term.split(" ");

    var workedExamplesOnly = hasDirectiveWE(terms);
    var lecturesOnly = hasDirectiveLEC(terms);
    terms = removeDirectives(terms);
    
    var results = [];

    // first pass matches on a single term.
    items.forEach(function(item) {
        txt = item.text.toLowerCase();
        // if term is in the txt
        if (txt.indexOf(term) != -1) {
            results.push(item);
        }
    });

    // remaining passes remove matches.
    
    return results;
}

function generateDiv(url, item) {
    var results = $("#results");
    
    results.append("<hr>");
    results.append("<p>" + item.text + "</p>");
    results.append("<span><a href='" + url + "'>lecture</a><span>");   
    results.append(" from time: ");
    results.append(item.start); 
    results.append(" to: ");
    results.append(item.end);
}

function clearResultsDiv() {
    $("#results").empty()
}

function hey(term) {
    clearResultsDiv();
    
    //return ss + " Hey!";
    var lectures = Object.keys(JSON_transcripts);
    var numFound = 0;
    var accum = [];
    lectures.forEach(function(lecId){
        var lecture = JSON_transcripts[lecId];
        var results = searchForTerm(lecId, term);
        if (results.length!=0) {
            accum.push(results);
            numFound += results.length;
            results.forEach(function(item){
                generateDiv(lecture.url, item);
            });
            
        }
    });
    return numFound;
}

var app = angular.module('app', []);
app.controller('myCtrl', function($scope) {
    // $scope.firstName = "John";
    // $scope.lastName = "Doe";
    $scope.search = function() {
        return hey($scope.terms);
    };
    
});


