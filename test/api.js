var chai  = require('chai')
var server = require('../server')


it('post with incorrect data', function(done) {
    chai.request(server)
    .post('/')
    .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be('Incorrect data format')
        done()
    })
})