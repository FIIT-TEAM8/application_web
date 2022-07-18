const express = require('express')
const pdfReportdb = require("../../db/pdf_report_db")
const pdfPrinter = require("pdfmake")
const DOMPurify = require("isomorphic-dompurify")
const dataApiTools = require("../../utils/data_api_tools")
const htmlToPdfmake = require("html-to-pdfmake")

const htmlSanitizeOptions = {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "h1", "h2", "h3", "h4", "h5", "h6", "p", "span"],
    ALLOWED_ATTR: ["href"],
};

const router = express.Router()

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

router.get('/download', async function (req, res) {
    try {
        const data = await dataApiTools.apiFetch('report', req)

        if (data && 'results' in data) {
            const docDefinition = {
                pageSize: "A4",
                pageOrientation: "portrait",
                content: []
            }

            const articles = data.results
            for (let i = 0; i < articles.length; i++) {
                if ('html' in articles[i]) {
                    const sanitizedHTML = sanitize(articles[i].html, htmlSanitizeOptions)
                    docDefinition.content.push(htmlToPdfmake(sanitizedHTML))
                }
            }

            if (docDefinition.content.length !== 0) {
                res.status(500).json({ok: false, msg: "Unable to sanitize articles for PDF."})
            }
            
            // TODO: maybe change library: https://www.npmjs.com/package/html-pdf-node
            // TODO: https://github.com/marcbachmann/node-html-pdf/issues/49 (page breaks or merge)
            const pdfFile = pdfPrinter.createPdf(docDefinition)
            let foo = 3
            //res.status(200).json({ok: true, pdf_file: pdf_file})
        }

        return res.status(500).json({ok: false, msg: "Articles wasn't recieved from API server."})

    } catch (e) {
        console.log(e);
        console.log('Exception happend while handling: /pdf_report/download')
        return res.status(500).json({ok: false, msg: "Unable to download PDF report."})
    }
})

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

        return res.status(200).json({ok: true, reportId: report.id, articlesInReport: report.content, msg: "Report was successfully retrieved."})
    } catch (e) {
        console.log(e);
        console.log('Exception happened while handling: /pdf_report/:id')
        return res.status(500).json({ok: false, msg: "Unable to retrieve PDF report."})
    }
})

const sanitize = (dirty, options) => ({
    __html: DOMPurify.sanitize(dirty, { ...htmlSanitizeOptions, ...options }),
});

module.exports = router