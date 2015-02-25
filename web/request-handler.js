var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!


var getHandler = function(request, response){

  helpers.serveAssets(response, '/Users/student/2015-02-web-historian/web/public/index.html', function(response, assetData){
    if (assetData){
      response.writeHead(200);
      response.end(JSON.stringify(assetData));
    }else{
      response.writeHead(502);
      response.end();
    }
  });

};


var actions = {
  'GET': getHandler,
  // 'POST': getHandler
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action){
    action(req, res);
  }else{
    res.statusCode = 418;
    res.end('method not supported');
  }
  // res.end(archive.paths.list);
};
