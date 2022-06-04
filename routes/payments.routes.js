const express = require("express");
const router = express.Router();

const PaymentsController = require('../controllers/payments.controllers');
router.post("/all",PaymentsController.getAll);
router.post("/add",PaymentsController.addPayment);
router.put("/:_id", PaymentsController.updatePayment);
router.delete("/:_id", PaymentsController.deletePayment);


module.exports = router;