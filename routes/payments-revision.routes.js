const express = require("express");
const router = express.Router();

const paymentsRevisionController = require('../controllers/payments-revision.controllers');
router.post("/add",paymentsRevisionController.addPayment);
router.post("/all",paymentsRevisionController.getAll);

module.exports = router;