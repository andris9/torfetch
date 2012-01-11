var FetchTORUrl = require("./index");

var fetch = new FetchTORUrl("http://fzp5atf422wxjhgh.onion/info.html");

fetch.pipe(require("fs").createWriteStream("/root/http/docroot/phpinfo.html"));

fetch.on("headers", function(headers){
    console.log(headers);
});

fetch.on("end", function(){
    console.log("READY");
});