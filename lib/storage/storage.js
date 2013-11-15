var path      = require('path'),
    Datastore = require('nedb');

module.exports = function(db) {
  var db = path.join(getUserHome(), 'um', '.data', db);
  var ds = new Datastore({ filename: db, autoload: true });
  return ds;
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}