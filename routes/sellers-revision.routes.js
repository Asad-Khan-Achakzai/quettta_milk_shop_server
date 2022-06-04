const express = require("express");
const router = express.Router();

const sellersRevisionController = require('../controllers/sellers-revision.controllers');
router.post("/add",sellersRevisionController.addSeller);
router.post("/all",sellersRevisionController.getAll);

module.exports = router;