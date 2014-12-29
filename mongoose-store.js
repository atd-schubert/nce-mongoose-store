"use strict";

var mongoose = require("mongoose");

var connectDB = function(path, logger) {
  logger = logger || console;
  if(mongoose.connection._readyState!==0) {
    logger.warn("There is already a connection...");
    //console.log(mongoose.connection);
    return mongoose;
  }
  mongoose.connect(path, function(err){
    if(err) {
      logger.error(err.message, err);
    }
  });
  mongoose.connection.once("open", function(){
    logger.info("Connection to db '"+path+"' established...");
  });
  return mongoose;
};

module.exports = function(nce){
  if(!nce) throw new Error("You have to specify the nce object");
  
//# Mandantory Setup:
  var ext = nce.createExtension({package: require("./package.json")});
  
  ext.on("install", function(event){ // set options, but don't run or make available in nce
    //# Seting extension-config:
    ext.config.href = ext.config.href || "mongodb://localhost/nce";
    ext.config.logger = ext.config.logger || {};

    //# Declarations and settings:
    ext.logger = nce.getExtension("winston").createLogger(ext.name, ext.config.logger);
  });
  
  ext.on("uninstall", function(event){ // undo installation
    //# Undeclare:
    nce.getExtension("winston").removeLogger(ext.name);
  });
  
  ext.on("activate", function(event){ // don't set options, just run, make available in nce or register.
	  store = connectDB(ext.config.href, ext.logger);
  });
  
  ext.on("deactivate", function(event){ // undo activation
	  mongoose.connection.close();
  });
  
//# Private declarations:
  var store;

//# Public declarations and exports:
  ext.createSchema = function(obj){
    if(!store) throw new Error("The store isn't activated");
    var schema = new store.Schema(obj);
    // TODO: this causes an error at the moment: schema.plugin(eventify);
    ext.emit("newSchema", schema);
    return schema;
  };
  ext.getModel = function(name){
    if(!store) throw new Error("The store isn't activated");
    return store.models[name];
  };
  ext.createModel = function(name, schema){
    if(!store) throw new Error("The store isn't activated");
    var model = store.model(name, schema);
    ext.emit("newModel", model);
    // register events...
    return model;
  };
  ext.removeModel = function(name){
    if(!store) throw new Error("The store isn't activated");
    if(!store.models[name]) return false;
    delete store.models[name];
    return true;
  };
  ext.getStore = function(){ return store; };
  
  return ext;
}