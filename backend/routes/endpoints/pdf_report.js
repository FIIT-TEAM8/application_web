const express = require('express')
const pdfReportdb = require("../../db/pdf_report_db")

const router = express.Router()

// node_host /ams/api/pdf_report/:id?status=In Progres
// get pdf report based on user_id and report status
router.get('/:user_id', async function (req, res) {
    try {
        const userId = req.params.user_id
        const reportStatus = ('status' in req.query) ? req.query.status : 'In Progress'
        
        // database will return only first user's report with wanted status
        const report = await pdfReportdb.getReport(userId, reportStatus)
        if (!report) {
            return res.status(400).json({ok: false, msg: "Unable to retrieve PDF report."})
        }

        return res.status(200).json({ok: true, articlesInReport: report.content, msg: "Report was successfully retrieved."})
    } catch (e) {
        console.log(e);
        console.log('Exception happened while handling: /pdf_report/:id')
        return res.status(500).json({ok: false, msg: "Unable to retrieve PDF report."})
    }
})

// node_host /ams/api/pdf_report/create/:user_id
router.post('/create', async function (req, res) { 
    try {
        const userId = req.body.userId
        const reportContent = JSON.stringify(req.body.articlesInReport) // convert array to json for db

        const id = await pdfReportdb.insertReport(userId, reportContent)
        if (!id) {
            return res.status(400).json({ok: false, msg: "Creation of PDF report failed."})
        }

        return res.status(200).json({ok: true, reportId: id, msg: "Creation of PDF report was succesfull."})
    } catch (e) {
        console.log(e);
        console.log('Exception happened while handling: /pdf_report/add')
        return res.status(500).json({ok: false, msg: "Unable to create PDF report."})
    }
})

// node_host /ams/api/pdf_report/update/:id
router.post('/update/:id', async function (req, res) {
    try {
        const reportId = req.params.id
        const reportContent = JSON.stringify(req.body.articlesInReport) // convert array to json for db

        const result = await pdfReportdb.updateReport(reportId, reportContent)
        if (!result) {
            return res.status(400).json({ok: false, msg: "Something failed during updating PDF report."})
        }

        return res.status(200).json({ok: true, msg: "PDF report was succesfully updated."})
    } catch (e) {
        console.log(e)
        console.log('Exception happened while handling: /pdf_report/update/:id')
        return res.status(500).json({ok: false, msg: "Unable to update PDF report."})
    }
})

module.exports = router