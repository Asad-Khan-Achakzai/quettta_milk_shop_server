const express = require("express");
const router = express.Router();

const ManagerController = require('../controllers/managers-revision.constrollers');
//const checkAuth = require('../middleware/check-auth');
router.post("/all",ManagerController.getAll);

router.post("/add",ManagerController.addManager);

module.exports = router;