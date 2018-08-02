'use strict'

const express = require('express') // web app framework
const morgan = require('morgan') // for logging
const helmet = require('helmet') // for security 
const bodyParser = require('body-parser')
const userAPI = require('../api/users')

const start = (options) => {
	return new Promise((resolve, reject) => {
		// check if repository and port are provided
		if (!options.repo) {
			reject(new Error('The server must be started with a connected repository'))
		}
		if (!options.port) {
			reject(new Error('The server must be started with an available port'))
		}
		
		// initialize express app 
		const app = express()
		app.use(morgan('dev'))
		app.use(helmet())
		app.use(bodyParser.json())
		app.use(bodyParser.urlencoded({ extended: false }))
		app.use((err, req, res, next) => {
			reject(new Error('Something went wrong!, err:' + err))
			res.status(500).send('Something went wrong!')
		})
		
		// add API to the express app 
		userAPI(app, options)
		
		// start the server and return it 
		const server = app.listen(options.port, () => resolve(server))
	})
}

module.exports = Object.assign({}, {start})