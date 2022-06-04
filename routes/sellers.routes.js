const express = require("express");
const router = express.Router();

const SellerController = require('../controllers/sellers.controllers');
//const checkAuth = require('../middleware/check-auth');

// router.get("/",UserController.sampleUser);
router.post("/all",SellerController.getAll);
//router.post("/login",UserController.loginUser);
//router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
router.post("/add",SellerController.addSeller);
router.put("/:_id", SellerController.updateSeller);
router.delete("/:_id", SellerController.deleteSeller);


module.exports = router;