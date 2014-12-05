#NC Extension mongoose-store
## Description
Document-store for NC cms

## How to install
Install with npm: `npm install --save nce-mongoose-store`

Integrate in NC:

```
var NC = require("nc");
var nc = new NC(/*{"mongoose-store": {href:"mongodb://localhost/dbName"}}*/);
var store = require("nce-mongoose-store");
var ext = store(nc);
ext.install();
ext.activate();
```

Or use nce-extension-manager...

## How to use
### Basic funcitons
* `.createSchema(schema)`: works like `mongoose.Schema(schema)`
* `.createModel(name, schema)`: works like `mongoose.model(name, schema)`
* `.getModel(name)`: get a model by name.
* `.getStore()`: get the original mongoose object.

### Events
* `newModel`: emitted when creating a model with the model as argument.
* `newSchema`: emitted when creating a schema with the schema as argument.

For everything else you can use nce-mongoose-store like mongoose itself, please look at the [mongoose documentation](http://mongoosejs.com/docs/guide.html).
