const server = require('./server')
const should = require('should')

// unit tests for the server 
describe('Server', () => {
  it('should require a port to start', () => {
    return server.start({
      repo: {}
    }).should.be.rejectedWith(/port/)
  })

  it('should require a repository to start', () => {
    return server.start({
      port: {}
    }).should.be.rejectedWith(/repository/)
  })
})