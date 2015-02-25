var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");

// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();

var routes = {
  '/': handler.handleRequest
};

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(function(request, response){
  console.log("serving " + request.method + " at url" + request.url);
  var route = routes[request.url];

  if (route){
    route(request, response);
  }else{
    response.statusCode = 404;
    response.end();
  }


});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
