// Called when a command that we don't currently support / unknown is entered

var UM = require('../main');
var util = require('util');

module.exports = function(args) {

  UM.emit('error', util.format(
    "'%s' is not a valid command.",
    args[0]
  ));
};