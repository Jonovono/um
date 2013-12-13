var CLI = require('../../lib/cli');
var cli;

var expect = require('expect.js');

//
// Specification: $ hoodie help
//

describe('um help', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
  });

  describe('$ um help', function() {
    it('should output the usage information', function() {
      cli.argv(['help']);
      expect(process.stdout.write.args[0]).to.match(/Usage/);
    });
  });
});
