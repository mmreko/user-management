let MongoClient = require('mongodb').MongoClient

// URL connection string
const getMongoURL = (options) => {
  //return 'mongodb://' + options.user + ':' + options.pass + '@' + options.server + '/' + options.db + '?authSource=admin';
  return 'mongodb://' + options.server + '/' + options.db;
}

// connects to the database based on URL and athentication data 
// options -> has all parameters that a connection needs
// mediator -> emitts the db object once the connection is completed 
const connect = (options, mediator) => {
	mediator.once('boot.ready', () => {
		MongoClient.connect(getMongoURL(options), {useNewUrlParser: true}, (err, mongoclient) => {
			if (err) {
				mediator.emit('db.error', err)
			}
			mediator.emit('db.ready', mongoclient)
		})
	})
}

module.exports = Object.assign({}, {connect})