var path      = require('path'),
    Datastore = require('nedb');

module.exports = function(db) {
  var dbb = path.join(getUserHome(), 'um', '.data', db);
  var ds = new Datastore({ filename: dbb, autoload: true });
  return ds;
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}