const express = require("express");
const router = express.Router();

const saleRevisionController = require('../controllers/sales-revision.controllers');
router.post("/add",saleRevisionController.addSale);
router.post("/all",saleRevisionController.getAll);

module.exports = router;