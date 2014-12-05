"use strict";

var mongoose = require("mongoose");

var connectDB = function(path, logger) {
  logger = logger || console;
  if(mongoose.connection._readyState!==0) {
    logger.warn("There is already a connection...");
    //console.log(mongoose.connection);
    return mongoose;
  }
  mongoose.connect(path);
  mongoose.connection.once("open", function(){
    logger.info("Connection to db '"+path+"' established...");
  });
  return mongoose;
};

module.exports = function(cms){
  if(!cms) throw new Error("You have to specify the cms object");
  
//# Mandantory Setup:
  var ext = cms.createExtension({package: require("./package.json")});
  
  ext.on("install", function(event){ // set options, but don't run or make available in cms
    //# Seting extension-config:
    ext.config.href = ext.config.href || "mongodb://localhost/nce-cms";
    ext.config.logger = ext.config.logger || {};

    //# Declarations and settings:
    ext.logger = cms.getExtension("winston").createLogger(ext.name, ext.config.logger);
  });
  
  ext.on("uninstall", function(event){ // undo installation
    //# Undeclare:
    
  });
  
  ext.on("activate", function(event){ // don't set options, just run, make available in cms or register.
	  store = connectDB(ext.config.href, ext.logger);
  });
  
  ext.on("deactivate", function(event){ // undo activation
	  
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
  ext.getStore = function(){ return store; };
  
  return ext;
}