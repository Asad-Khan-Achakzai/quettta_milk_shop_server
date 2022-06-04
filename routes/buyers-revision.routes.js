const express = require("express");
const router = express.Router();

const buyersRevisionController = require('../controllers/buyers-revision.controllers');
//const checkAuth = require('../middleware/check-auth');
router.post("/add",buyersRevisionController.addBuyer);
router.post("/all",buyersRevisionController.getAll);

module.exports = router;