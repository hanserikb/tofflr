tofflr
======

Java like package handling.


```javascript

// Needs a global variable to root directory
global.__base = __dirname + '/';

require('Tofflr')(['src/test/', 'src/main/' ], function(err, toffl) {

  if(err) {
    throw err;
    return;
  }

  var Crap = toffl.import("you.must.be.stupid.to.use.this.Crap");
  new Crap("hello world");

});
```
