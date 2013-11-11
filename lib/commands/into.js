var UM = require('../main');
var argv = require('optimist');
var config = require('../../config');
var shell = require('shelljs');
var fs = require('fs');
var path = require('path');

module.exports = function(args) {
  var parsedArgs = argv.parse(args.slice(1));


  // If no args passed to into we will just cd into the 
  // main UM directory where all the files are stored
  if (parsedArgs._.length === 0) {
    fs.writeFileSync(config.into_path, 'cd ' + config.um_path);
    return;
  }

  // If we pass in one argument we will CD into that if it is a dir
  // else we will not.
  if (parsedArgs._.length === 1) {
    var file = parsedArgs._[0];
    console.log(file);
    UM.files.getFile(file, function(doc) {
      if (!doc) {
        console.log('No file exists with that name.');
        return;
      }

      // CHeck if it is a file we can not CD into it
      var p = path.join(config.um_path, doc.file);
      fs.writeFileSync(config.into_path, 'cd ' + p);
    });
  }

  // If greater than one argument we need to use applescript to create
  // tabs.

  

  // var nums = parsedArgs._;
  // var lastCommandResp = require(LASTCOMMANDRESPONSE);

  // _.each(nums, function(num) {
  //   console.log(lastCommandResp[--num]);
  // }); 
};