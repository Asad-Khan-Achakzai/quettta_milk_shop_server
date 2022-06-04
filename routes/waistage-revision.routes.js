const express = require("express");
const router = express.Router();

const WaistageController = require('../controllers/waistage-revision.controllers');

router.post("/add",WaistageController.addWaistage);
router.post("/all",WaistageController.getAll);


module.exports = router;
