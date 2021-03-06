const express = require('express');
const Auth = require('./middleware/auth');
const Static = require('./controller/static');
const Captcha = require('./controller/captcha');
const User = require('./controller/user');
const Notice = require('./controller/notice');
const Topic = require('./controller/topic');
const Reply = require('./controller/reply');

const router = express.Router();

// 测试
router.get('/', (req, res) => res.send({ status: 1, data: '欢迎使用 Mints - 薄荷糖社区 API接口' }));

// 静态
router.get('/static/get_start', Static.getStart); // 获取快速开始文档
router.get('/static/api_introduction', Static.getApiIntroduction); // 获取API说明文档
router.get('/static/about', Static.getAbout); // 获取关于文档

// 验证码
router.get('/captcha/pic', Captcha.getPicCaptcha); // 获取图形验证码
router.get('/captcha/msg', Captcha.getMsgCaptcha); // 获取短信验证码

// 用户
router.post('/signup', User.signup); // 注册
router.post('/signin', User.signin); // 登录
router.delete('/signout', User.signout); // 登出
router.patch('/forget_pass', User.forgetPass); // 忘记密码
router.get('/info', Auth.userRequired, User.getUserInfo); // 获取当前登录用户信息
router.put('/setting', Auth.userRequired, User.updateUserInfo); // 更新个人信息
router.patch('/update_pass', Auth.userRequired, User.updatePass); // 修改密码
router.get('/users/star', User.getStarList); // 获取星标用户列表
router.get('/users/top100', User.getTop100); // 获取积分榜前100用户列表
router.get('/user/:uid', User.getInfoById); // 根据ID获取用户信息
router.patch('/user/:uid/follow_or_un', Auth.userRequired, User.followOrUnfollowUser); // 关注或者取消关注某个用户
router.get('/user/:uid/likes', User.getUserLikes); // 获取用户喜欢列表
router.get('/user/:uid/collections', User.getUserCollections); // 获取用户收藏列表
router.get('/user/:uid/replies', User.getUserReplies); // 用户回复的列表
router.get('/user/:uid/follower', User.getUserFollower); // 获取用户粉丝列表
router.get('/user/:uid/following', User.getUserFollowing); // 获取用户关注的人列表

// 话题
router.post('/create', Auth.userRequired, Topic.createTopic); // 创建话题
router.delete('/topic/:tid/delete', Auth.userRequired, Topic.deleteTopic); // 删除话题
router.put('/topic/:tid/edit', Auth.userRequired, Topic.editTopic); // 编辑话题
router.get('/topics/list', Topic.getTopicList); // 获取话题列表
router.get('/topics/search', Topic.searchTopic); // 搜索话题列表
router.get('/topic/:tid', Topic.getTopicById); // 根据ID获取话题详情
router.patch('/topic/:tid/like_or_un', Auth.userRequired, Topic.likeOrUnlikeTopic); // 喜欢或者取消喜欢话题
router.patch('/topic/:tid/collect_or_un', Auth.userRequired, Topic.collectOrUncollectTopic); // 收藏或者取消收藏话题

// 回复
router.post('/topics/:tid/reply', Auth.userRequired, Reply.createReply); // 创建回复
router.delete('/reply/:rid/delete', Auth.userRequired, Reply.deleteReply); // 删除回复
router.put('/reply/:rid/edit', Auth.userRequired, Reply.editReply); // 编辑回复
router.patch('/reply/:rid/up', Auth.userRequired, Reply.upReply); // 回复点赞

// 消息
router.get('/notice/user', Auth.userRequired, Notice.getUserNotice); // 获取用户消息
router.get('/notice/system', Auth.userRequired, Notice.getSystemNotice); // 获取系统消息

module.exports = router;
