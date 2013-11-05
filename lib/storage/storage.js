var path      = require('path'),
    Datastore = require('nedb');

module.exports = function(db) {
  var db = path.join(__dirname, '..', '..', 'data', db);
  var ds = new Datastore({ filename: db, autoload: true });
  return ds;
}