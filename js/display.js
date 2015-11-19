// control the display for search
//
var nil = null;


// Terms -> [(url, items that contain terms)]
function searchForTerm(lecId, term) {
    var lec = JSON_transcripts[lecId];
    var items = lec.items;
    if (term != nil) {
        term = term.toLowerCase();
    }

    var results = [];
    items.forEach(function(item) {
        txt = item.text.toLowerCase();
        // if term is in the txt
        if (txt.indexOf(term) != -1) {
            results.push(item);
        }
    });
    return results;
}

function generateDiv(url, item) {
    // {
    //     "start":"00:00:00",
    //     "end":"00:00:06",
    //     "text":"Finally, let's ...  program counter.",
    // }
    var results = $("#results");
    
    results.append("<hr>");
    results.append("<div>" + item.text + "</div>");
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


