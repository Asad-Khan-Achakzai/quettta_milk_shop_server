const express = require("express");
const router = express.Router();

const ReportController = require('../controllers/report.controllers');
// router.get("/",UserController.sampleUser);
router.post("/itemReport",ReportController.getItemReport);
router.post("/saleReport",ReportController.getISaleReport);
router.post("/saleReportRange",ReportController.getISaleReportRange);
router.post("/itemsReport",ReportController.getItemsReportRange);


module.exports = router;