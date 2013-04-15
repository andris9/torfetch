var spawn = require('child_process').spawn,
    Stream = require("stream").Stream,
    utillib = require("util");

module.exports = FetchTORUrl;

/*
 * options:
 *   - hostname: tor proxy host
 *   - port: tor proxy port
 *   - method: Request method (defaults to GET)
 *   - postBody: Post body string or an object of key-value pairs {key: value}
 * 
 * emits:
 *   - 'data' incoming data, param chunk (Buffer)
 *   - 'headers' headers object, {'status':200, 'content-type':'text/html',...}
 *   - 'end' file is received
 */
function FetchTORUrl(url, options){
    Stream.call(this);
    this.readable = true;
    self = this;

    options = options || {};
    options.hostname = options.hostname || "localhost";
    options.port = options.port || 9050;

    var params = [
        "--include",
        "--location",
        "--header",
        "User-Agent: robot",
        "--insecure",
        "--socks5-hostname",
        options.hostname+":"+options.port
    ];

    if(options.method){
        params.push("X"+options.method.trim().toUpperCase());
    }

    params.push(url);
    
    if(options.postBody){
        if(typeof options.postBody == "object"){
            var keys = Object.keys(options.postBody),
                postData = [];
            for(var i=0, len = keys.length; i<len; i++){
                postData.push(encodeURIComponent(keys[i])+"="+encodeURIComponent(options.postBody[keys[i]]));
            }
            options.postBody = postData.join("&");
        }
        params.push("-d");
        params.push(options.postBody);
    }
    
    var request = spawn("curl", params);
    
    var stateHeader = true, headers = "";
    
    request.stdout.on('data', function (data) {
        var str, match, lastpos;
        if(stateHeader){
            str = data.toString("binary");
            if((match = str.match(/\r?\n\r?\n/))){
                lastpos = match.index + match[0].length;
                headers += str.substr(0, lastpos);
                
                self.emit("headers", parseHeaders(headers));
                stateHeader = false;
                
                self.emit("data", data.slice(lastpos));
            }else{
                headers += str;
            }
        }else{
            self.emit("data", data);
        }
    })
    
    request.stderr.on('data', function (data) {
        //this.emit("error", new Error(data.toString("utf-8")));
    });
    
    request.on('exit', function (code) {
        self.emit("end");
    });

}
utillib.inherits(FetchTORUrl, Stream);


function parseHeaders(str){
    var lines = str.trim().split(/\r?\n/), parts, key, value,
        status = parseInt((lines[0] || "").match(/\d\d\d/),10) || 0,
        headers = {};
    
    lines.shift(); // status line
    for(var i=0, len = lines.length; i<len; i++){
        if((lines[i] = lines[i].trim())){
            parts = lines[i].split(":");
            key = parts.shift().trim().toLowerCase();
            value = parts.join(":").trim();
            if(Array.isArray(headers[key])){
                headers[key].push(value);
            }else if(!headers[key]){
                headers[key] = value;
            }else{
                headers[key] = [headers[key], value];
            }
        }
    }
    
    headers.status = status;
    return headers;
}
