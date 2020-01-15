var chai  = require('chai')
var server = require('../server')
var chaiHttp = require('chai-http')

chai.use(chaiHttp)

it('post with incorrect data', done => {
    chai.request(server)
    .post('')
    .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be('Incorrect data format')
        done()
    })
})