const mongo = require('./mongo')
const config = require('./config')
const assert = require('assert');
const server = require('../server/server')
const repository = require('../repository/repository')
const {EventEmitter} = require('events')

// unit tests for mongoDB connection
describe('Mongo Connection', () => {
	
	it('can return researchers', (done) => {
		const mediator = new EventEmitter()
		const dbSettings = config.dbSettings

		mediator.on('db.ready', (mongoclient) => {
			var db = mongoclient.db("users");
			
			db.collection('researchers').find().toArray(function(err, items) {
				assert.equal(err, null);
				assert.notEqual(items.length, 0)
				console.log(items);    
				mongoclient.close();
				done();
			})	
		});
		
		mongo.connect(dbSettings, mediator)

		mediator.emit('boot.ready')
	})
})
