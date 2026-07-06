const pool = require('../config/db');
const {parsePagination,sendError,findMissingFields,isValidDate} = require('../middleware/validate');
 
// POST /notices  (admin only — enforced by route middleware)
async function createNotice(req, res) {
    const { title, content, category } = req.body;
    const postedBy = req.user.id; // taken from the authenticated admin's JWT, not the body

    const missing = findMissingFields(req.body, ['title', 'content']);
    if (missing.length > 0) {
        return sendError(res, 400, 'Missing required fields', { missing });
    }

    try {
        const result = await pool.query(
            `INSERT INTO notices (title, content, category, posted_by)
             VALUES ($1, $2, $3, $4)
             RETURNING id, title, content, category, posted_by AS "postedBy", created_at AS "createdAt"`,
            [title, content, category || 'general', postedBy]
        );

        return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('createNotice error:', err);
        return sendError(res, 500, 'Something went wrong while creating the notice');
    }
}

async function listNotices(req, res) {
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
        conditions.push(`(title ILIKE $${values.length} OR content ILIKE $${values.length})`);
    }

    if (from) {
        if (!isValidDate(from)) {
            return sendError(res, 400, "'from' is not a valid date", { field: 'from', value: from });
        }
        values.push(from);
        conditions.push(`created_at >= $${values.length}`);
    }

    if (to) {
        if (!isValidDate(to)) {
            return sendError(res, 400, "'to' is not a valid date", { field: 'to', value: to });
        }
        values.push(to);
        conditions.push(`created_at <= $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    try {
        const dataQuery = `
            SELECT id, title, category, posted_by AS "postedBy", created_at AS "createdAt"
            FROM notices
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${values.length + 1} OFFSET $${values.length + 2}
        `;
        const countQuery = `SELECT COUNT(*) FROM notices ${whereClause}`;

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
        console.error('listNotices error:', err);
        return sendError(res, 500, 'Something went wrong while fetching notices');
    }
}

async function getNoticeById(req,res){

    const { id } = req.params;

    try{

        if(!id)  return sendError(res,400,'Notice ID is required');

        const result = await pool.query(
            `SELECT id, title, content, category, posted_by AS "postedBy", created_at AS "createdAt"
             FROM notices
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return sendError(res, 404, 'Notice not found');
        }

        return res.status(200).json({ success: true, data: result.rows[0] });

    } catch (err) {
        console.error('getNoticeById error:', err);
        return sendError(res, 500, 'Something went wrong while fetching the notice');
    }

}

module.exports = { createNotice, listNotices, getNoticeById };