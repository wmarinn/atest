var chai  = require('chai')
var request = require('request')
var server = require('../server')


it('post with incorrect data', function(done) {
    request(server)
    .post('/')
    .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be('Incorrect data format')
        done()
    })
})