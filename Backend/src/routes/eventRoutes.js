const express = require('express');
const eventsRouter = express.Router();
const { createEvent, listEvents,getEventById } = require('../controllers/eventController');
const { registerForEvent, listEventRegistrations } = require('../controllers/registrationController');
const { writeLimiter } = require('../middleware/rateLimiter');
const adminMiddleware = require('../middleware/adminMiddleware');

// Admin only — create an event
eventsRouter.post('/createEvent', writeLimiter, adminMiddleware, createEvent);
eventsRouter.get('/listEvents', listEvents);
eventsRouter.get('/:id', getEventById);

module.exports = eventsRouter;