// Command to show all the files with their comment //

var config = require('../../config');
var fs = require('fs');
var path = require('path');
var log = require('winston');
var AdmZip = require('adm-zip');

var zip = new AdmZip();

module.exports = function() {
  fs.exists(config.dropbox_path, function(exists) {
    if (!exists) {
      log.error('Could not find Dropbox folder in your home directory');
      return;
    }
    fs.exists(config.um_dropbox_backup, function(exists) {
      if (!exists) fs.mkdirSync(config.um_dropbox_backup);
      
      zip.addLocalFolder(config.um_path);
      var willSendThis = zip.toBuffer();
      var p = path.join(config.um_dropbox_backup, String(new Date().getTime()) + '.zip');
      zip.writeZip(p);
      log.info('Successfully backed up to', config.um_dropbox_backup);
    });
  });
};