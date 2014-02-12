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
CLI.prototype.add.tag = require('./commands/add/tag');
CLI.prototype.add.workspace = require('./commands/add/workspace');

CLI.prototype.update = require('./commands/update');
CLI.prototype.update.workspace = require('./commands/update/workspace');
CLI.prototype.delete = require('./commands/delete');
CLI.prototype.delete.tag = require('./commands/delete/tag');
CLI.prototype.delete.workspace = require('./commands/delete/workspace');
CLI.prototype.replace = require('./commands/replace');
CLI.prototype.merge = require('./commands/merge');
CLI.prototype.merge.tag = require('./commands/merge/tag');
CLI.prototype.merge.workspace = require('./commands/merge/workspace');
CLI.prototype.unknown = require('./commands/unknown');

// CLI.prototype.all = require('./commands/all');
// CLI.prototype.projects = require('./commands/all');
CLI.prototype.files = require('./commands/files');
CLI.prototype.tags = require('./commands/tags');
CLI.prototype.comments = require('./commands/comments');
CLI.prototype.workspaces = require('./commands/workspaces');

CLI.prototype.into = require('./commands/into');
CLI.prototype.open = require('./commands/open');
CLI.prototype.backup = require('./commands/backup');

CLI.prototype.updatetree = require('./commands/updatetree');

// Aliases
CLI.prototype.at = CLI.prototype.add.tag;
CLI.prototype.aw = CLI.prototype.add.workspace;
CLI.prototype.dt = CLI.prototype.delete.tag;
CLI.prototype.dw = CLI.prototype.delete.workspace;
CLI.prototype.uw = CLI.prototype.update.workspace;

CLI.prototype.add.tags = CLI.prototype.add.tag;
CLI.prototype.delete.tags = CLI.prototype.delete.tag;


CLI.prototype.write = function(level, msg ) {
  UM.emit(level, msg);
};

module.exports = CLI;