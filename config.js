var path = require('path');

var config = {
  // Databases for the files and tags
  file_db_test:   'filetest.db',
  tag_db_test:    'tagtest.db',
  workspace_db_test: 'workspacetest.db',
  file_db:        'file.db',
  tag_db:         'tag.db',
  workspace_db:   'workspace.db',
  home_path:      path.join(getUserHome()),

  // Main UM directory
  um_path:        path.join(getUserHome(), 'um'),

  // Directory that stores EVERY project/file added to UM
  // When you add a file it gets MOVED to this place.
  sources_path:   path.join(getUserHome(), 'um', 'sources'),

  // Holds the workspaces
  workspaces_path: path.join(getUserHome(), 'um', 'workspaces'),

  // File that enables CDing into a project in the current shell
  into_path:      path.join(getUserHome(), 'um', '.data', 'into.sh'),

  // If this file exists we did something that requires re-drawing of the
  // directory tree in the main UM directory
  dirty_path:     path.join(getUserHome(), 'um', '.data', '.dirty'),

  // Keep track of the last response output
  last_response:  path.join(__dirname, 'data', 'lastresponse.json'),

  // Shell/applescript file for opening multiple tabs (in iterm now, using applescript)
  as_new_tab:     path.join(__dirname, 'doc', 'applescript', 'new-terminal-tabs'),

  dropbox_path:   path.join(getUserHome(), 'Dropbox'),

  um_dropbox_backup: path.join(getUserHome(), 'Dropbox', 'um-backup')
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = config;