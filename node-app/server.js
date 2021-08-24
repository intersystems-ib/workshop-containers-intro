var http = require('http');

// handle HTTP requests
var handleRequest = function (request, response) {
    response.writeHead(200);
    response.end("Hello World!");
}

// HTTP server
var www = http.createServer(handleRequest);

// run HTTP server on port 8080
www.listen(8080);