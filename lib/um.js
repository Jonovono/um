var events = require('events');
var util = require('util');
var updateNotifier = require('./util/notifier');
var storage = require('./storage/storage');
var File = require('./storage/file');
var Tag = require('./storage/tag');
var config = require('../config.js');

var cnsl = require('./util/console');


function initialize() {
  this.on('error', function(msg) {
    cnsl.error(msg);
  });

  this.on('info', function(msg) {
    cnsl.info(msg);
  });

  this.on('checkUpdate', function() {
    updateNotifier();
  })
}

function UM() {
  initialize.call(this);
  events.EventEmitter.call(this);

  this.files = new File(storage(config.file_db_test));
  this.tags = new Tag(storage(config.tag_db_test));
}

util.inherits(UM, events.EventEmitter);

module.exports = UM;