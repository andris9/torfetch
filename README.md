# torfetch

**torfetch** makes it possible to access URLs in the TOR Network.

## Installation

At first you need to have TOR installed in your server

On Debian run as root:

    apt-get install tor tor-geoipdb

**torfetch** also requires **curl** to be installed

Install **torfetch** from npm

    npm install torfetch


## Usage

    var TORFetch = require("torfetch");

    var options = {
        method:"post",
        postBody:{
            param1: "value1",
            param2: "value2"
        }
    }

    var request = new TORFetch("http://torurl.onion", options);

    request.on("headers", function(headers){
        console.log(headers);
    });

    request.on("data", function(chunk){
        console.log(chunk);
    });
    
    request.on("end", function(){
        console.log("Ready");
    });


    