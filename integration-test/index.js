const supertest = require('supertest')

describe('user-service', () => {

  const api = supertest('http://192.168.99.102:3000')

  it('returns a 200 for all researchers', (done) => {

    api.get('/users/researchers/')
      .expect(200, done)
  })
})