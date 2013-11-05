var UM = require('./main');
function CLI() {
  this.cli = this;
}

UM.emit('checkUpdate');

CLI.prototype.argv = require('./argv');
CLI.prototype.help = require('./commands/help');


CLI.prototype.write = function(level, msg ) {
  UM.emit(level, msg);
}

module.exports = CLI;