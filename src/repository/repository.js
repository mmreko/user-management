'use strict'
//const passwordHash = require('password-hash');
const ObjectID = require('mongodb').ObjectID;

// holds an open connection to the db
// exposes some functions for accessing the data using mongoDB syntax
const repository = (mongoclient) => {
	
	const db = mongoclient.db('users')
	
	// fetches all researchers 
	const getAllResearchers = () => {
		return new Promise((resolve, reject) => {
			const researchers = []
			const cursor = db.collection('researchers').find();
			
			const addResearcher = (researcher) => {
				researchers.push(researcher)
			}
			
			const sendResearchers = (err) => {
				if (err) {
					reject(new Error('An error occured fetching all researchers, err:' + err))
				}
				resolve(researchers)
			}
			
			cursor.forEach(addResearcher, sendResearchers)
		})
	}
	
	// fetches one researcher by id 
	const getResearcherById = (id) => {
		return new Promise((resolve, reject) => {
			const sendResearcher = (err, researcher) => {
				if (err) {
					reject(new Error(`An error occured fetching a researcher with id: ${id}, err: ${err}`))
				}
				resolve(researcher)
			}
			
			db.collection('researchers').findOne({_id: ObjectID(id)}, sendResearcher)
		})
	}
	
	// fetches one researcher by email 
	const getResearcher = (email) => {
		return new Promise((resolve, reject) => {
			const sendResearcher = (err, researcher) => {
				if (err) {
					reject(new Error(`An error occured fetching a researcher with email: ${email}, err: ${err}`))
				}
				resolve(researcher)
			}
			
			db.collection('researchers').findOne({email: email}, sendResearcher)
		})
	}
	
	// inserts new researcher
	const insertResearcher = (researcher) => {
		return new Promise((resolve, reject) => {
			const payload = {
				email: researcher.email,
				password: researcher.password,
				name: researcher.name,
				group: researcher.group
			}
			
			const sendResearcher = (err, result) => {
				if (err) {
					reject(new Error(`An error occured inserting a researcher, err: ${err}`))
				}
				resolve(result)
			}
			
			db.collection('researchers').findOne( {email: researcher.email}, function (err, result) {
				if (err) { 
					reject(new Error(`An error occured checking if the researcher exists, err: ${err}`))
				}
				if (!result) {
					db.collection('researchers').insertOne(payload, sendResearcher);
				}
				else {
					reject(new Error(`Account with this e-mail already exists`))
				}
			})
		})
	}
	
	// updates existing researcher
	const updateResearcher = (researcher) => {
		return new Promise((resolve, reject) => {
			const payload = {
				email: researcher.email,
				name: researcher.name,
				group: researcher.group
			}
			
			const sendResearcher = (err, result) => {
				if (err) {
					reject(new Error(`An error occured updating a researcher, err: ${err}`))
				}
				resolve(result)
			}
			
			db.collection('researchers').updateOne({_id: ObjectID(researcher._id)}, {$set: payload}, sendResearcher);
		})
	}
	
	// deletes researcher
	const deleteResearcher = (id) => {
		return new Promise((resolve, reject) => {
			const sendResearcher = (err, result) => {
				if (err) {
					reject(new Error(`An error occured deleting a researcher, err: ${err}`))
				}
				resolve(result)
			}
			
			db.collection('researchers').deleteOne({_id: ObjectID(id)}, sendResearcher);
		})
	}
	
	// disconnects from the db
	const disconnect = () => {
		mongoclient.close();
	}
	
	// exports the repository 
	return Object.create({
		getAllResearchers,
		getResearcherById,
		getResearcher,
		insertResearcher,
		updateResearcher,
		deleteResearcher,
		disconnect
	})
			
}

// connects to the db 
const connect = (connection) => {
	return new Promise((resolve, reject) => {
		if (!connection) {
			reject(new Error('Connection to db not supplied!'))
		}
		resolve(repository(connection))
	})
}

module.exports = Object.assign({}, {connect})