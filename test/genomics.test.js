require.extensions['.testjs'] = require.extensions['.js'];

var genomics = require("../lib/genomics"),
    should = require('should');

describe('convertCodesToNames', function() {
  it('should convert p.G12D to p.Gly12Asp', function(done){
  	genomics.convertCodesToNames('p.G12D').should.equal("p.Gly12Asp");
  	done();
  });
});

describe('convertNamesToCodes', function() {
  it('should convert p.Gly12Asp to p.G12D', function(done){
  	genomics.convertNamesToCodes('p.Gly12Asp').should.equal("p.G12D");
  	done();
  });

  it('should convert p.G12D to p.G12D', function(done){
  	genomics.convertNamesToCodes('p.G12D').should.equal("p.G12D");
  	done();
  });

  it('should convert p.Arg97Glyfs*16 to p.R97Gfs*16', function(done){
    genomics.convertNamesToCodes('p.Arg97Glyfs*16').should.equal("p.R97Gfs*16");
    done();
  });
});

describe('invertSequence', function() {
  it('should convert A to T', function(done){
  	genomics.invertSequence('A').should.equal("T");
  	done();
  });

  it('should convert AC to TG', function(done){
  	genomics.invertSequence('AC').should.equal("TG");
  	done();
  });

  it('should convert ACGT to TGCA', function(done){
  	genomics.invertSequence('ACGT').should.equal("TGCA");
  	done();
  });
});
