const db = require("./postgres")

async function getReport(user_id, status) {
    const query = {
        text: `SELECT * FROM public.pdf_report WHERE user_id = $1 AND status = $2`, 
        values: [user_id, status]
    }
    const result = await db.query(query)
    if (result.rows && result.rows[0]) {
        return result.rows[0]
    } else {
        return null
    }
}

async function insertReport(user_id, reportContent) {
    const query = {
        text: `INSERT INTO public.pdf_report (content, user_id) VALUES ($1, $2) RETURNING id`,
        values: [reportContent, user_id]
    }
    const result = await db.query(query)
    if (result.rows && result.rows[0]) {
        return result.rows[0].id
    } else {
        return null
    }
}

async function updateReport(reportId, report) {
    const query = {
        text: `UPDATE public.pdf_report SET content = $1 WHERE id = $2`,
        values: [report, reportId]
    }
    const result = await db.query(query)
    
    // rowCount informs about number of updated records
    if (result.rowCount !== 0) {
        return result.rowCount
    } else {
        return null
    }
}

module.exports = {
    getReport,
    insertReport,
    updateReport,
}