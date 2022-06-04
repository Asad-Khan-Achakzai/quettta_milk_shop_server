const express = require("express");
const router = express.Router();

const PurchasesController = require('../controllers/purchases-revision.controllers');

router.post("/add",PurchasesController.addPurchase);
router.post("/all",PurchasesController.getAll);


module.exports = router;
