const pool = require('../config/db');
const {parsePagination,sendError,validate,findMissingFields,isValidDate,isValidDateRange} = require('../middleware/validate');

// POST /events  (admin only — enforced by route middleware)
async function createEvent(req, res) {
    const { title, description, category, venue, startTime, endTime, organizer } = req.body;

    const missing = findMissingFields(req.body, ['title', 'startTime', 'endTime']);
    if (missing.length > 0) {
        return sendError(res, 400, 'Missing required fields', { missing });
    }

    if (!isValidDate(startTime)) {
        return sendError(res, 400, 'startTime is not a valid date', { field: 'startTime', value: startTime });
    }
    if (!isValidDate(endTime)) {
        return sendError(res, 400, 'endTime is not a valid date', { field: 'endTime', value: endTime });
    }
    if (!isValidDateRange(startTime, endTime)) {
        return sendError(res, 400, 'startTime must be before endTime', { startTime, endTime });
    }

    try {
        const result = await pool.query(
            `INSERT INTO events (title, description, category, venue, start_time, end_time, organizer)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, title, description, category, venue,
                       start_time AS "startTime", end_time AS "endTime",
                       organizer, created_at AS "createdAt"`,
            [title, description || null, category || 'general', venue || null, startTime, endTime, organizer || null]
        );

        return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        if (err.code === '23514') {
            return sendError(res, 400, 'startTime must be before endTime');
        }
        console.error('createEvent error:', err);
        return sendError(res, 500, 'Something went wrong while creating the event');
    }
}

async function listEvents(req, res) {
    const { category, keyword, from, to } = req.query;
    const { limit, offset } = parsePagination(req.query);

    const conditions = [];
    const values = [];

    if (category) {
        values.push(category);
        conditions.push(`category = $${values.length}`);
    }

    if (keyword) {
        values.push(`%${keyword}%`);
        conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }

    if (from) {
        if (!isValidDate(from)) {
            return sendError(res, 400, "'from' is not a valid date", { field: 'from', value: from });
        }
        values.push(from);
        conditions.push(`start_time >= $${values.length}`);
    }

    if (to) {
        if (!isValidDate(to)) {
            return sendError(res, 400, "'to' is not a valid date", { field: 'to', value: to });
        }
        values.push(to);
        conditions.push(`start_time <= $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    try {
        const dataQuery = `
            SELECT id, title, description, category, venue,
                   start_time AS "startTime", end_time AS "endTime",
                   organizer, created_at AS "createdAt"
            FROM events
            ${whereClause}
            ORDER BY start_time ASC
            LIMIT $${values.length + 1} OFFSET $${values.length + 2}
        `;
        const countQuery = `SELECT COUNT(*) FROM events ${whereClause}`;

        const [rows, count] = await Promise.all([
            pool.query(dataQuery, [...values, limit, offset]),
            pool.query(countQuery, values),
        ]);

        return res.status(200).json({
            success: true,
            count: rows.rows.length,
            total: parseInt(count.rows[0].count, 10),
            limit,
            offset,
            data: rows.rows,
        });
    } catch (err) {
        console.error('listEvents error:', err);
        return sendError(res, 500, 'Something went wrong while fetching events');
    }
}

async function getEventById(req,res){

    const {id} = req.params;

    try{

        if(!id)  return sendError(res,400,'Event ID is required');

        const result = await pool.query(
            `SELECT id, title, description, category, venue,
                   start_time AS "startTime", end_time AS "endTime",
                   organizer, created_at AS "createdAt"
             FROM events
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return sendError(res, 404, 'Event not found');
        }

        return res.status(200).json({ success: true, data: result.rows[0] });

    } catch (err) {
        console.error('getEventById error:', err);
        return sendError(res, 500, 'Something went wrong while fetching the event');
    }

}

module.exports = { createEvent, listEvents,getEventById };