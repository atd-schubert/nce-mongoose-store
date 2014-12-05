"use strict";

/*
  You have to start mongod for this test!
*/

var NC = require("nc");
var Ext = require("../");
describe('Basic integration in NC', function(){
  var nc = new NC();
  it('should be insertable into NC', function(done){
    var ext = Ext(nc);
    if(ext) return done();
    return done(new Error("Is not able to insert extension into NC"));
  });
});
describe('Basic functions in NC', function(){
  var nc = new NC({"mongoose-store":{href:"mongodb://localhost/test"}});
  var ext = Ext(nc);
  
  it('should be installable', function(done){
    if(ext.install()) return done();
    return done(new Error("Can not install extension"));
  });
  it('should be activatable', function(done){
    if(ext.activate()) return done();
    return done(new Error("Can not activate extension"));
  });
  it('should be deactivatable', function(done){
    if(ext.deactivate()) return done();
    return done(new Error("Can not deactivate extension"));
  });
  it('should be uninstallable', function(done){
    if(ext.uninstall()) return done();
    return done(new Error("Can not uninstall extension"));
  });
});
describe('Basic store commands', function(){
  var nc = new NC({"mongoose-store":{href:"mongodb://localhost/test"}});
  var ext = Ext(nc);
  ext.install();
  ext.activate();
  it('should create a schema', function(done){
    var schema = ext.createSchema({test: String});
    if(schema && schema.methods && schema.statics) return done();
    return done(new Error("This is not a schema!"));
  });
  it('should create a model', function(done){
    var schema = ext.createSchema({test: String});
    schema.methods.getText = function(){
      return this.get("test");
    };
    schema.statics.getText = function(cb){
      return this.findOne({}, function(err, doc){
        if(err) return cb(err);
        if(!doc) return cb(new Error("Can not find a doc."));
        return cb(null, doc.getText()); 
      });
    };
    var model = ext.createModel("test1", schema);
    var tmp = new model({test: "ok"});
    tmp.save(function(err){
      if(err) return done(err);
      model.getText(function(err, txt){
        if(err) return done(err);
        if(txt === "ok") return done();
        return done(new Error("Do not get the right content"));
      });
    });
  });
});