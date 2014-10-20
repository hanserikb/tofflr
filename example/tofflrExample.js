global.__base = __dirname + '/';

require('tofflr')(['src/test', 'src/main' ], function(err, toffl) {

  var Crap = toffl.import("you.must.be.stupid.to.use.this.Crap");
  new Crap("hello world");

});
