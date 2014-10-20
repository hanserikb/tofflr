"use strict";



var walk = require('walk'),
  Class = require('jclass');

var Tofflr = Class.extend({

  packages: {},

  init: function(packages) {
    this.packages = packages;
  },

  import: function(library) {
    if(this.packages[library] != undefined)
      return this.packages[library];

    if(library.substr(-1) == '*') {

      library = library.substr(0, library.length -1);

      var packages = {};

      for(var pkg in this.packages) {


        var regexp = new RegExp("^" + library + "[\\-\\w]+");

        if(pkg.match(regexp)) {

          var split = pkg.split('.');
          var name = split[split.length - 1];


          packages[name] = this.packages[pkg];
        }

      }

      return packages;

    }

  }

});


module.exports = function(folders, callback) {

  if(__base == undefined) {
    callback(new Error("Missing __base!"));
  }

  var src_folders = folders;

  var packages = {};

  var options = {
    followLinks: true
  };


  var ended = 0;

  for(var i in src_folders) {

    var folder = src_folders[i];

    var walker = walk.walk(folder, options);

    walker.on("file", function (root, fileStats, next) {

      // Not a .js file
      if(fileStats.type != 'file' || fileStats.name.substr(-3) != ".js" || fileStats.name.length <= 3) {
        next();
        return;
      }

      var pkg = packageFromRoot(folder, root);
      var name = fileStats.name.substr(0, fileStats.name.length - 3);
      var path = __base + root + '/' + fileStats.name;

      packages[pkg + '.' + name] = require(path);

      next();

    });

    walker.on("end", function () {
      if(++ended == src_folders.length) {
        try {
          var tofflr = new Tofflr(packages);

          callback(false, tofflr);
        } catch (err) {
          callback(err);
        }
      }


    });

  }

}

var packageFromRoot = function(folder, root) {
  root = root.substr(folder.length).trim();
  if(root.substr(0, 1) == '/') {
    root = root.substr(1);
  }

  root = root.split('/').join('.');

  return root;
}

