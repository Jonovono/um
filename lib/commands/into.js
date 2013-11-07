var argv = require('optimist');
var config = require('../../config');
var shell = require('shelljs');
var fs = require('fs');
var path = require('path');

module.exports = function(args) {
  var parsedArgs = argv.parse(args.slice(1));


  if (parsedArgs._.length === 0) {
    fs.writeFileSync(config.into_path, 'cd ' + config.um_path);
    return;
  }

  // var nums = parsedArgs._;
  // var lastCommandResp = require(LASTCOMMANDRESPONSE);

  // _.each(nums, function(num) {
  //   console.log(lastCommandResp[--num]);
  // }); 
};