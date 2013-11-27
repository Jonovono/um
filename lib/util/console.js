var cliff = require('cliff');
var log = require('winston');

log.cli();

module.exports.error = function(msg) {
  log.error(msg);
};

module.exports.info = function(msg) {
  log.info(msg);
};

module.exports.printRows = function(rows, columns, colors) {
  console.log(cliff.stringifyObjectRows(rows, columns, colors))
};

