const express = require("express")
const pdfReportdb = require("../../db/pdf_report_db")
const DOMPurify = require("isomorphic-dompurify")
const dataApiTools = require("../../utils/data_api_tools")
const htmlToPdf = require("html-pdf-node")

const htmlSanitizeOptions = {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "h1", "h2", "h3", "h4", "h5", "h6", "p", "span"],
    ALLOWED_ATTR: ["href"],
};

const pdfOptions = { 
    format: 'A4',
    margin: {
        top: '45px',
        bottom: '45px',
        left: '65px',
        right: '65px'
    },
    printBackground: true
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

router.post('/download', async function (req, res) {
    try {
        if (!('body' in req && 'articlesIds' in req.body && 'articlesSearchTerms' in req.body)) {
            return res.status(400).json({ok: false, msg: "Wrong request, missing articles ids or search terms."})
        }

        const articlesIds = req.body.articlesIds
        const articlesSearchTerms = req.body.articlesSearchTerms
        const data = await dataApiTools.fetchArticles('report', req, articlesIds)

        if (!data || !('results' in data)) {
            return res.status(500).json({ok: false, msg: "Articles wasn't recieved from API server."})
        }

        let reportHtml = ''
        const articles = data.results
        
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i]

            if ('html' in article) {
                let sanitizedHTML = sanitize(articles[i].html, htmlSanitizeOptions).__html
                htmlLower = sanitizedHTML.toLowerCase()

                const searchTerm = articlesSearchTerms[i]
                reportHtml += `<h4>Article was found by term: <span style="background-color:yellow;">${searchTerm}</span></h4>`

                // get all starting indexes, where search term was found in article's sanitized html
                const startIndexes = [...htmlLower.matchAll(searchTerm)].map(result => result.index)

                const searchTermLength = searchTerm.length
                const totalSpanLength = '<span style="background-color:yellow;"></span>'.length
                let endOfLastSearchTerm = 0

                for (let j = 0; j < startIndexes.length; j++) {
                    // shift of startIndex is required, because some searchTerms in sanitizedHtml could be already surrounded by span with background style
                    const startIndex = startIndexes[j] + j * totalSpanLength
                    const endIndex = startIndex + searchTermLength

                    const startHtml = sanitizedHTML.slice(0, startIndex)
                    const searchTermHtml = sanitizedHTML.slice(startIndex, endIndex)
                    const endHtml = sanitizedHTML.slice(endIndex)

                    sanitizedHTML = startHtml + '<span style="background-color:yellow;">' + searchTermHtml + '</span>' + endHtml
                }

                reportHtml += sanitizedHTML
                reportHtml += '<br><div style="page-break-after:always;"></div>' // page break, https://github.com/marcbachmann/node-html-pdf/issues/49 (page breaks or merge)
            }
        }

        let file = { content: reportHtml };
        const pdfBuffer = await htmlToPdf.generatePdf(file, pdfOptions).then(pdfBuffer => { return pdfBuffer })
        
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/pdf')
        res.end(new Buffer.from(pdfBuffer, 'base64'))
    } catch (e) {
        console.log(e);
        console.log('Exception happend while handling: /pdf_report/download')
        return res.status(500).json({ok: false, msg: "Unable to generate PDF report."})
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