var path = require('path');

var config = {
  file_db_test:   'filetest.db',
  tag_db_test:    'tagtest.db',
  file_db:        'file.db',
  tag_db:         'tag.db',
  home_path:      path.join(getUserHome()),
  um_path:        path.join(getUserHome(), 'um'),
  sources_path:   path.join(getUserHome(), 'um', 'sources'),
  into_path:      path.join(getUserHome(), 'um', '.sh', 'into.sh'),
  last_response:  path.join(__dirname, 'data', 'lastresponse.json')
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = config;