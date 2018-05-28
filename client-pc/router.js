const express = require('express');
const Home = require('./controllers/home');

const router = express.Router();

// 首页
router.get('/', Home.index);
// 新手入门
router.get('/get_start', Home.getStart);
// API说明
router.get('/api_introduction', Home.apiIntroduction);
// 关于
router.get('/about', Home.about);

module.exports = router;
