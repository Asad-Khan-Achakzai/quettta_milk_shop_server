const express = require("express");
const router = express.Router();

const WaistageController = require('../controllers/waistages.controllers');
// router.get("/",UserController.sampleUser);
router.post("/all",WaistageController.getAll);
//router.post("/login",UserController.loginUser);
//router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
router.post("/add",WaistageController.addWaistage);
router.put("/:_id", WaistageController.updateWaistage);
router.delete("/:_id", WaistageController.deleteWaistage);


module.exports = router;