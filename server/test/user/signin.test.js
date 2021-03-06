const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const sinon = require('sinon');

describe('test /api/signin', function() {
  let clock;

  before(function(done) {
    clock = sinon.useFakeTimers();
    support.createUser().then(() => {
      done();
    });
  });

  after(function(done) {
    clock.restore();
    support.deleteUser().then(() => {
      done();
    });
  });

  // 登录方式不正确
  it('should return status 0 when the type is not valid', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'lala',
        mobile: '18800000000',
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_SIGNIN_PARMAS');
        res.body.message.should.equal('请输入正确的登录方式');
        done();
      });
  });

  // 手机号是否正确
  it('should return status 0 when the mobile is not valid', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: '12345678901',
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_SIGNIN_PARMAS');
        res.body.message.should.equal('请输入正确的手机号');
        done();
      });
  });

  // 账户是否存在
  it('should return status 0 when the mobile is not registered', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: '18800000001',
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_USER_IS_NOT_EXITS');
        res.body.message.should.equal('手机账户尚未注册');
        done();
      });
  });

  // 登录类型为账户密码 - 密码错误
  it('should return status 0 when the pass is not match', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: '18800000000',
        password: 'a123456789'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_PASS_IS_NOT_MATCH');
        res.body.message.should.equal('用户密码错误');
        done();
      });
  });

  // 登录类型为账户密码 - 正确
  it('should return status 1 when type equal acc', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: '18800000000',
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('_id');
        done();
      });
  });

  // 登录类型为短信验证码 - 收取验证码手机与登录手机不匹配
  it('should return status 0 when the msgcaptcha and mobile is not match', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000001'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        request
          .post('/api/signin')
          .send({
            type: 'mct',
            mobile: '18800000000',
            msgcaptcha: '123456'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_MSG_CAPTCHA');
            res.body.message.should.equal('收取验证码的手机与登录手机不匹配');
            done();
          });
      });
  });

  // 登录类型为短信验证码 - 短信验证码不对
  it('should return status 0 when the msgcaptcha is not valid', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000000'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        request
          .post('/api/signin')
          .send({
            type: 'mct',
            mobile: '18800000000',
            msgcaptcha: '123456'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_MSG_CAPTCHA');
            res.body.message.should.equal('短信验证码不正确');
            done();
          });
      });
  });

  // 登录类型为短信验证码 - 短信验证码失效
  it('should return status 0 when the msgcaptcha is expired', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000000'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        clock.tick(1000 * 60 * 11);
        request
          .post('/api/signin')
          .send({
            type: 'mct',
            mobile: '18800000000',
            msgcaptcha: res.body.code
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_MSG_CAPTCHA');
            res.body.message.should.equal('短信验证码已经失效了，请重新获取');
            done();
          });
      });
  });

  // 登录类型为短信验证码 - 登录成功
  it('should return status 1 when type equal mct', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000000'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        request
          .post('/api/signin')
          .send({
            type: 'mct',
            mobile: '18800000000',
            msgcaptcha: res.body.code
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            res.body.data.should.have.property('_id');
            done();
          });
      });
  });
});