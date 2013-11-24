var UM = require('../main');
var argv = require('optimist');
var config = require('../../config');
var fs = require('fs');
var path = require('path');
var as = require('applescript');
var _ = require('underscore');
var log = require('winston');
var shell = require('shelljs');
var open = require('open');
var helpers = require('../util/helpers');

module.exports = function(args) {
  var parsedArgs = argv.parse(args.slice(1));
  var files = parsedArgs._;
  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);

  _.each(files, function(file) {
    UM.files.sourcedPath(file, function(p) {
      if (!p) return console.log('no file');
      open(p, "Sublime Text");
    });
  });

  _.each(tags, function(tag) {
    UM.tags.tagPath(tag, function(p) {
      console.log(p);
      if (!p) return console.log('no tag');
      open(p);
    });
  });
};