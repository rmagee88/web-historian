var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httprequest = require('http-request');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  var varray = fs.readFileSync(exports.paths.list, {encoding: 'utf8'}).split("\n");
  callback(varray);
};

exports.isUrlInList = function(url){
  exports.readListOfUrls(function(varray){
    for (var i = 0; i < varray.length; i++){
      if (varray[i] === url){return true;}
    }
  });
  return false;
};

exports.addUrlToList = function(url){
  fs.appendFile(exports.paths.list, url, {encoding: 'utf8'}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log('The ' + url + ' was appended to file!');
  });
};

exports.isURLArchived = function(url, callback){
  fs.readFile(exports.paths.archivedSites + /* backslash? */url, {encoding: 'utf8'}, function(error, data){
    if (error){
      console.log(error);
      exports.addUrlToList(url);
      callback(url, false, data);
    }else{
      callback(url, true, data);
    }
  });
};


var addFile = function(urlObj, html){
  fs.writeFile(exports.paths.archivedSites + '/' + urlObj.url, {encoding: 'utf8'}, html, function(error){
    console.log(error);
  });
  exports.removeFromList(urlObj.url);
};

exports.downloadUrls = function(urlArray){
  for (var i = 0; i < urlArray.length; i++){
    httprequest.get(urlArray[i], function(err, response){
      if (err) {
        console.log(err);
      }else{
        addFile(this, response.buffer.toString());
      }
    }.bind({url: urlArray[i]}));
  }
};

exports.removeFromList = function(url){
  exports.readListOfUrls(function(varray){
    var newArray = _.filter(varray, function(item){
      if (item !== url){return true;}
    });
    fs.writeFile(exports.paths.list, {encoding: 'utf8'}, newArray.join('\n'), function(err){
      if (err) {
        console.log(err);
      }
    });
  });
};





