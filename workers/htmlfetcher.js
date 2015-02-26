// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var archiveHelpers = require('../helpers/archive-helpers');

// read list of urls
archiveHelpers.readListOfUrls(function (array) {
  // download list of urls
  archiveHelpers.downloadUrls(array);
});



