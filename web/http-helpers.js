var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var sitesTxt = '/Users/student/2015-02-web-historian/archives/sites.txt';
var sitesPath = '/Users/student/2015-02-web-historian/archives/sites/';
var loadingPath = '/Users/student/2015-02-web-historian/web/public/loading.html';

var writeToFile = function(site) {
  fs.appendFile(sitesTxt, site, {encoding: 'utf8'}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log('The ' + site + ' was appended to file!');
  });
};

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, req, asset, callback) {
  var parsedUrl = url.parse(req.url);

  if (req.method === "POST") {
    fs.readFile(sitesPath + asset, {encoding: 'utf8'}, function(error, data){
      if (error){
        console.log(error);
        // console.log('Asset = ', asset);
        writeToFile(asset + '\n');
        res.writeHead(302);
        fs.readFile(loadingPath, {encoding: 'utf8'}, function(error, data) {
          if (error) {
            console.log(error);
          } else {
            res.end(JSON.stringify(data));
          }
        });

      }else{
        callback(res, data);
      }
    });
  } else {
    fs.readFile(asset, {encoding: 'utf8'}, function(error, data){
      if (error){
        console.log(error);
        res.writeHead(404);
        res.end('can\'t find it');
      }else{
        callback(res, data);
      }
    });
  }


  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};


// As you progress, keep thinking about what helper functions you can put here!
