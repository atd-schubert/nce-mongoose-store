"use strict";

/*
  You have to start mongod for this test!
*/

var NCE = require("nce");
var ExtMgr = require("nce-extension-manager");
var Ext = require("../");

describe('Basic integration in NCE', function(){
  var nce = new NCE();
  
  it('should be insertable into NCE', function(done){
    var ext = Ext(nce);
    if(ext) return done();
    return done(new Error("Is not able to insert extension into NCE"));
  });
});
describe('Basic functions in NCE', function(){
  var nce = new NCE({"mongoose-store":{href:"mongodb://localhost/test"}});
  var ext = Ext(nce);
  var extMgr = ExtMgr(nce);
  extMgr.activateExtension(extMgr);
  
  it('should be installable', function(done){
    if(extMgr.installExtension(ext) && ext.status === "installed") return done();
    return done(new Error("Can not install extension"));
  });
  it('should be activatable', function(done){
    if(extMgr.activateExtension(ext) && ext.status === "activated") return done();
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
  it('should be installable again', function(done){
    if(ext.install()) return done();
    return done(new Error("Can not install extension"));
  });
  it('should be activatable again', function(done){
    if(ext.activate()) return done();
    return done(new Error("Can not activate extension"));
  });
});
describe('Basic store commands', function(){
  var nce = new NCE({"mongoose-store":{href:"mongodb://localhost/test"}});
  var ext = Ext(nce);
  var extMgr = ExtMgr(nce);
  extMgr.activateExtension(extMgr);
  extMgr.activateExtension(ext);
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
    if(ext.getStore().models["test1"]=== model) return done();
    return done(new Error("Do not get the right content"));
  });
  
  it('should remove a model', function(done){
    ext.removeModel("test1");
    if(ext.getStore().models["test1"] === undefined) return done();
    return new Error("Unable to remove a model");
  });
  it('should create a removed model', function(done){
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
    if(ext.getStore().models["test1"]=== model) return done();
    return done(new Error("Do not get the right content"));
  });
  it('should create a test document', function(done){
    var model = ext.getModel("test1");
    var doc = new model({test:"OK"});
    doc.save(function(err){
      if(err) return done(err);
      model.find({test:"OK"}, function(err, doc){
        if(err) return done(err);
        if(!doc) return done(new Error("Can not get document"));
        return done();
      });
    });
  });
});