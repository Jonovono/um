var events = require('events');
var util = require('util');
var updateNotifier = require('./util/notifier');
var storage = require('./storage/storage');
var File = require('./storage/file');
var Tag = require('./storage/tag');
var config = require('../config.js');


function initialize() {
  this.on('error', function(err) {
    console.log('oaethu');
  });

  this.on('penis', function(err) {
    console.log("FUCKCCKCK");
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
  this.commands = require('./commands');
}

util.inherits(UM, events.EventEmitter);

module.exports = UM;