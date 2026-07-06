const express = require('express');
const noticeRouter = express.Router();
const { createNotice, listNotices, getNoticeById } = require('../controllers/noticeController');
const { writeLimiter } = require('../middleware/rateLimiter');
const adminMiddleware = require('../middleware/adminMiddleware');

// Admin only — must be logged in AND have role 'admin'
noticeRouter.post('/createNotice', writeLimiter, adminMiddleware, createNotice);

noticeRouter.get('/listNotices', listNotices);
noticeRouter.get('/:id', getNoticeById);

module.exports = noticeRouter;