var UM = require('./main');
function CLI() {
  this.cli = this;
}

UM.emit('checkUpdate');

CLI.prototype.argv = require('./argv');
CLI.prototype.help = require('./commands/help');
CLI.prototype.version = require('./commands/version');
CLI.prototype.add = require('./commands/add');
CLI.prototype.unknown = require('./commands/unknown');

CLI.prototype.files = require('./commands/files');
CLI.prototype.tags = require('./commands/tags');



CLI.prototype.write = function(level, msg ) {
  UM.emit(level, msg);
}

module.exports = CLI;