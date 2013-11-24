// Handles showing the appropriate help documentation.

var UM = require('../main');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var log = require("winston");

log.cli();

module.exports = function(args) {
  var basepath = path.join(__dirname, '..', '..', 'doc', 'cli');
  var filepath;
  var data;

  //  filename format: command.command.txt
  filepath = args.slice(0);
  filepath.push('txt');
  filepath = filepath.join('.');

  // full doc file path
  filepath = path.join(basepath, filepath);

  var rd = readline.createInterface({
    input: fs.createReadStream(filepath),
    output: process.stdout,
    terminal: false
  });

  rd.on('line', function(line) {
    log.help(line);
  });
};