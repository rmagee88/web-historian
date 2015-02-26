var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var url = require('url');
// require more modules/folders here!
var indexPath = '/Users/student/2015-02-web-historian/web/public/index.html';
var sitePath = '/Users/student/2015-02-web-historian/archives/sites';


var getHandler = function(request, response){

  var parsedUrl = url.parse(request.url);
  var lookupPath;
  if (parsedUrl.pathname === '/') {
    lookupPath = indexPath;
  } else {
    lookupPath = sitePath + parsedUrl.pathname;
  }

  helpers.serveAssets(response, request, lookupPath, function(response, assetData){
    if (assetData){
      response.writeHead(200);
      response.end(JSON.stringify(assetData));
    }else{
      response.writeHead(502);
      response.end('we\'re wrong');
    }
  });

};

var postHandler = function(request, response) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });

  request.on('end', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("DATAAAAAAAAA: " + data);
      helpers.serveAssets(response, request, data.slice(4), function(response, assetData){
        if (assetData){
          response.writeHead(200);
          response.end(JSON.stringify(assetData));
        }else{
          response.writeHead(502);
          response.end('we\'re wrong');
        }
      });
    }
  });


};


var actions = {
  'GET': getHandler,
  'POST': postHandler
};

exports.handleRequest = function (req, res) {
  var parsedUrl = url.parse(req.url);
  console.log( 'URL path = ', parsedUrl.pathname);

  var action = actions[req.method];
  if (action){
    action(req, res);
  }else{
    res.statusCode = 418;
    res.end('method not supported');
  }
  // res.end(archive.paths.list);
};
