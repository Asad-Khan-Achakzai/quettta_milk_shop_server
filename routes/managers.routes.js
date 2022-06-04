const express = require("express");
const router = express.Router();

const ManagerController = require('../controllers/managers.controllers');
//const checkAuth = require('../middleware/check-auth');

// router.get("/",UserController.sampleUser);
router.post("/all",ManagerController.getAll);
router.post("/login",ManagerController.loginManager);
//router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
router.post("/add",ManagerController.addManager);
router.put("/:_id", ManagerController.updateManager);
router.delete("/:_id", ManagerController.deleteManager);


module.exports = router;