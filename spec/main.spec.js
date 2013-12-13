var UM = require('../lib/um');
var um = require('../lib/main');

var expect = require('expect.js');

describe('main', function() {

  it('should be an instance of UM', function() {
    expect(um).to.be.a(UM);
  });
});