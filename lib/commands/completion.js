#!/usr/bin/env node
var UM = require('../main');
var _ = require('underscore');
var tabtab = require('tabtab');
var sh = require('shelljs');


module.exports = function(args) {

  if(args[0] === 'completion') return tabtab.complete('um', function(err, data) {
    // simply return here if there's an error or data not provided.
    // stderr not showing on completions
    if(err || !data) return;
    var first = data.line.split(' ')[1];
    var commands = ['add', 'delete', 'files', 'tags', 'comments', 'help', 'into',
                'replace', 'merge', 'update'];

    UM.files.all(function(fs) {
      var files = _.pluck(fs, 'file');
      UM.tags.all(function(ts) {
        var tags = _.pluck(ts, 'tag');

        if (data.prev === 'add') return tabtab.log(sh.ls('*'), data);
        if (data.prev === '-t') return tabtab.log(tags, data);
        if (data.words === 1) return tabtab.log(commands, data);

        if (first === 'into') return tabtab.log(files, data);
        if (first === 'delete') return tabtab.log(files, data);
        if (first === 'merge') return tabtab.log(tags, data);
        if (first === 'tags') return tabtab.log(tags, data);
        if (first === 'replace') return tabtab.log(files, data);
        if (first === 'update') return tabtab.log(files, data);

        return tabtab.log(sh.ls('*'), data);
      });
    });
  });
};