// CLI module to have all the commands available to call.

var UM = require('./main');
function CLI() {
  this.cli = this;
}

// Check if there is an update for this Module.
UM.emit('checkUpdate');

CLI.prototype.argv = require('./argv');
CLI.prototype.completion = require('./commands/completion');

CLI.prototype.help = require('./commands/help');
CLI.prototype.version = require('./commands/version');
CLI.prototype.add = require('./commands/add');
CLI.prototype.update = require('./commands/update');
CLI.prototype.delete = require('./commands/delete');
CLI.prototype.replace = require('./commands/replace');
CLI.prototype.merge = require('./commands/merge');
CLI.prototype.unknown = require('./commands/unknown');

CLI.prototype.files = require('./commands/files');
CLI.prototype.tags = require('./commands/tags');
CLI.prototype.comments = require('./commands/comments');

CLI.prototype.into = require('./commands/into');
CLI.prototype.open = require('./commands/open');

CLI.prototype.updatetree = require('./commands/updatetree');

CLI.prototype.write = function(level, msg ) {
  UM.emit(level, msg);
};

module.exports = CLI;