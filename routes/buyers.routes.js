const express = require("express");
const router = express.Router();

const BuyerController = require('../controllers/buyers.controllers');
//const checkAuth = require('../middleware/check-auth');

// router.get("/",BuyerController.sampleUser);
router.post("/all",BuyerController.getAll);
//router.post("/login",UserController.loginUser);
//router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
router.post("/add",BuyerController.addBuyer);
router.put("/:_id",BuyerController.updateBuyer);
router.delete("/:_id", BuyerController.deleteBuyer);


module.exports = router;