var UM = require('../main');

module.exports = function() {
  // commands.printInfo(require('../../package.json').version);
  UM.emit('info', require('../../package.json').version);
};