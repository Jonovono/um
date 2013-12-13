var UM = require('../lib/um');
var um = new UM();

var expect = require('expect.js');

/*!
 * Specification: hoodie.
 */

describe('um', function() {
  it('should define um.files', function() {
    expect(um).to.have.property('files');
  });
  
  it('should define um.tags', function() {
    expect(um).to.have.property('tags');
  });
});

