var TORFetch = require("../index");

var request = new TORFetch("http://fzp5atf422wxjhgh.onion");

request.on("headers", function(headers){
    console.log(headers);
});

request.on("data", function(chunk){
    console.log(chunk.toString("utf-8"));
});

request.on("end", function(){
    console.log("Ready");
});