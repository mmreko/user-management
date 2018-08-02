const request = require('supertest')
const server = require('../server/server')
const should = require('should')

// unit tests for the user management service API 
// run with: mocha users.test.js
describe('Users API', () => {
	let app = null
	
	// stub database
	let testUsers = [{
		'_id': 1,
		'email': 'johnsnow@test,com',
		'password': 'pass123',
		'name': 'John Snow',
		'group': 'Nights Watch'
	}, {
		'_id': 2,
		'email': 'motherofdragons@test,com',
		'password': 'pass123',
		'name': 'Daenerys Targaryen',
		'group': 'Dragonstone'
	}, {
		'_id': 3,
		'email': 'tlannister@test,com',
		'password': 'pass123',
		'name': 'Tyrion Lannister',
		'group': 'Casterly Rock'
	}]
	
	// stub repository 
	let testRepo = {
		getAllResearchers() {
			return Promise.resolve(testUsers)
		},
		
		getResearcherById(id) {
			return Promise.resolve(testUsers.find(researcher => researcher._id == id))
		},
		
		getResearcher(email) {
			return Promise.resolve(testUsers.find(researcher => researcher.email == email))
		},
		
		insertResearcher(researcher) {
			const payload = {
				_id: researcher._id,
				email: researcher.email,
				password: researcher.password,
				name: researcher.name,
				group: researcher.group
			}
			testUsers.push(payload)
			return Promise.resolve(payload)
		},
		
		updateResearcher(researcher) {
			index = testUsers.findIndex((item => item._id == researcher._id));
			testUsers[index]._email = researcher.email
			testUsers[index].password = researcher.password
			testUsers[index].name = researcher.name
			testUsers[index].group = researcher.group
			return Promise.resolve(testUsers[index])
		},
		
		deleteResearcher(id) {
			return Promise.resolve(testUsers = testUsers.filter(item => item._id != id))
		}
	}
	
	beforeEach(() => {
		return server.start({
			port: 3000,
			repo: testRepo
		}).then(serv => {
			app = serv
		})
	})
	
	afterEach(() => {
		app.close()
		app = null
	})
	
	it('can insert researcher', (done) => {
		const testResearcher = {
			'_id': 4,
			'email': 'jlannister@test.com',
			'password': 'pass123',
			'name': 'Jaime Lannister',
			'group': 'Casterly Rock'
		}
		
		request(app)
			.post('/users/researchers/insert')
			.send({'researcher': testResearcher})
			.expect((res) => {
				res.body.should.containEql({
					'_id': 4,
					'email': 'jlannister@test.com',
					'password': 'pass123',
					'name': 'Jaime Lannister',
					'group': 'Casterly Rock'	
				})
				console.log(res.body)
			})
			.expect(200, done)
	})
	
	it('can return all researchers', (done) => {
		request(app)
			.get('/users/researchers')
			.expect((res) => {
				res.body.should.containEql({
					'_id': 3,
					'email': 'tlannister@test,com',
					'password': 'pass123',
					'name': 'Tyrion Lannister',
					'group': 'Casterly Rock'	
				})
				console.log(res.body)
			})
			.expect(200, done)
	})
	
	it('can return one researcher', (done) => {
		request(app)
			.get('/users/researchers/id/1')
			.expect((res) => {
				res.body.should.containEql({
					'_id': 1,
					'email': 'johnsnow@test,com',
					'password': 'pass123',
					'name': 'John Snow',
					'group': 'Nights Watch'
				})
				console.log(res.body)
			})
			.expect(200, done)
	})
	
	it('can find researcher by e-mail', (done) => {
		request(app)
			.get('/users/researchers/email')
			.send({'email': 'motherofdragons@test,com'})
			.expect((res) => {
				res.body.should.containEql({
					'_id': 2,
					'email': 'motherofdragons@test,com',
					'password': 'pass123',
					'name': 'Daenerys Targaryen',
					'group': 'Dragonstone'
				})
				console.log(res.body)
			})
			.expect(200, done)
	})
	
	it('can delete researcher', (done) => {
		request(app)
			.delete('/users/researchers/delete/2')
			.expect((res) => {
				res.body.should.not.containEql({
					'_id': 2,
					'email': 'motherofdragons@test,com',
					'password': 'pass123',
					'name': 'Daenerys Targaryen',
					'group': 'Dragonstone'
				})
				console.log(res.body)
			})
			.expect(200, done)
	})
	
	it('can update researcher', (done) => {
		const testResearcher = {
			'_id': 1,
			'email': 'johnsnow@test,com',
			'password': 'pass123',
			'name': 'John Snow',
			'group': 'Winterfell'
		}
		
		request(app)
			.put('/users/researchers/update')
			.send({'researcher': testResearcher})
			.expect((res) => {
				res.body.should.containEql({
					'_id': 1,
					'email': 'johnsnow@test,com',
					'password': 'pass123',
					'name': 'John Snow',
					'group': 'Winterfell'	
				})
				console.log(res.body)
			})
			.expect(200, done)
	})
	
})