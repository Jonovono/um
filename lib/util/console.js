var log = require('winston');

log.cli();

module.exports.error = function(msg) {
  log.error(msg);
};

module.exports.info = function(msg) {
  log.info(msg);
};

