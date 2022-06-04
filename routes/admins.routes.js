const express = require("express");
const router = express.Router();

const AdminController = require('../controllers/admins.controllers');
const checkAuth = require('../middleware/check-auth');

router.post("/login",AdminController.loginAdmin);
router.post("/register",AdminController.registerAdmin);

module.exports = router;