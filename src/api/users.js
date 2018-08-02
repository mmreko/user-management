'use strict'
const status = require('http-status')

// defines the API of the service
// calls appropriate repository functions 
module.exports = (app, options) => {
	const {repo} = options
	
	// GET /users/researchers
	app.get('/users/researchers', (req, res, next) => {
		repo.getAllResearchers().then(researchers => {
			res.status(status.OK).json(researchers)
		}).catch(next)
	})
	
	// GET /users/researchers/id/:id
	app.get('/users/researchers/id/:id', (req, res, next) => {
		repo.getResearcherById(req.params.id).then(researcher => {
			res.status(status.OK).json(researcher)
		}).catch(next)
	})
	
	// POST /users/researchers/email
	app.post('/users/researchers/email', (req, res, next) => {
		repo.getResearcher(req.body.email).then(researcher => {
			res.status(status.OK).json(researcher)
		}).catch(next)
	})
	
	// POST /users/researchers/insert
	app.post('/users/researchers/insert', (req, res, next) => {
		let researcher = req.body
		repo.insertResearcher(researcher).then(inserted => {
			res.status(status.OK).json(inserted)
		}).catch(next)
	})
	
	// PUT /users/researchers/update
	app.put('/users/researchers/update', (req, res, next) => {
		let researcher = req.body
		repo.updateResearcher(researcher).then(updated => {
			res.status(status.OK).json(updated)
		}).catch(next)
	})
	
	// DELETE /users/researchers/delete/:id
	app.delete('/users/researchers/delete/:id', (req, res, next) => {
		repo.deleteResearcher(req.params.id).then(researcher => {
			res.status(status.OK).json(researcher)
		}).catch(next)
	})

}