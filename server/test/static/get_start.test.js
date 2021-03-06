const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/static/get_start', function() {
  it('should return status 1', function(done) {
    request
      .get('/api/static/get_start')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.containEql('快速开始');
        done(err);
      });
  });
});
