var config = {
  file_db_test:   'filetest.db',
  tag_db_test:    'tagtest.db',
  file_db:        'file.db',
  tag_db:         'tag.db',
  home_path:      getUserHome(),
  um_path:        getUserHome() + '/um',
  sources_path:   getUserHome() + '/um' + '/sources',
  into_path:      getUserHome() + '/um' + '/.sh' + '/into.sh'
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = config;