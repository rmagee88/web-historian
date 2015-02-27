var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httprequest = require('http-request');
var sqlite3 = require('sqlite3').verbose();


exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback){
  var varray = fs.readFileSync(exports.paths.list, {encoding: 'utf8'}).split("\n");
  console.log('URLs Read Successfully');
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
  fs.writeFile(exports.paths.archivedSites + '/' + urlObj.url, html, {encoding: 'utf8'}, function(error){
    if (error) console.log('Add file error', error);
  });
  exports.removeFromList(urlObj.url);
};

exports.downloadUrls = function(urlArray){
  for (var i = 0; i < urlArray.length; i++){
    if (urlArray[i]){
      httprequest.get(urlArray[i], function(err, response){
        if (err) {
          console.log('Download URL Error ', err);
        }else{
          addFile(this, response.buffer.toString());
        }
      }.bind({url: urlArray[i]}));
    }
  }
};

exports.removeFromList = function(url){
  exports.readListOfUrls(function(varray){
    var newArray = _.filter(varray, function(item){
      if (item !== url){return true;}
    });
    fs.writeFile(exports.paths.list, newArray.join('\n'), {encoding: 'utf8'}, function(err){
      if (err) {
        console.log('Write file error ', err);
      }
    });
  });
};





var openDb = function(callback){
  var db = new sqlite3.Database('/Users/student/2015-02-web-historian/archives/sitesDatabase.db');
  db.on('open', function(){
    callback(db);
  });
};

var tableCheck = function() {

  var initTable = function(db) {
    db.run("CREATE TABLE IF NOT EXISTS SITES (URL TEXT, HTML TEXT)", function(error){
      if (error) {console.log(error);}
    });
  };

  openDb(initTable);
};


exports.db = {};

exports.db.urlExists = function(url, callback){
  var urlExistsFn = function(db){
    db.run("SELECT URL FROM SITES WHERE URL =" + url + ";", function(error, rows){
      db.close();
      if (rows){
        callback(true);
      }else{
        callback(false);
      }
    });
  };
  openDb(urlExistsFn);
};

exports.db.insertUrl = function(url){

  var insertUrlFn = function(db) {
    console.log('insertUrlFn called.');
    db.run("INSERT INTO SITES(URL,HTML) VALUES ('" + url + "','null');", function(error){
      if (error) console.log(error);
      db.close();
      console.log('DB closed by insertUrlFn');
    });
  };

  openDb(insertUrlFn);
};

exports.db.insertHTML  = function(url, data){

  var insertHTMLFn = function(db){
    db.run("UPDATE SITES SET HTML = ? WHERE URL = ?;", data, url, function(error){
      if (error) console.log(error);
      db.close();
    });
  };

  openDb(insertHTMLFn);
};

exports.db.fetchHTML = function(url, callback){

  var fetchHTMLFn = function(db){
    db.all("SELECT HTML FROM SITES WHERE URL =" + url + ";", function(error, row){
      if (error){
        console.log(error);
      }else{
        callback(row.HTML);
        db.close();
      }
    });
  };

  openDb(fetchHTMLFn);
};

exports.db.selectAll = function(){

  var selectAllFn = function(db){
    db.all("SELECT * FROM SITES;", function(error, rows){
      if (error){
        console.log("error: " + error);
      }else{
        rows.forEach(function(row) {
          console.log('url: ', row.URL);
        });
        db.close();
      }
    });
  };
  openDb(selectAllFn);
};


// // test commands
// exports.db.insertUrl('www.test.com');
// exports.db.insertUrl('stuffy-stuff');
// exports.db.selectAll();










































