// Prints the current version of the UM command.

var UM = require('../main');

module.exports = function() {
  UM.emit('info', require('../../package.json').version);
};