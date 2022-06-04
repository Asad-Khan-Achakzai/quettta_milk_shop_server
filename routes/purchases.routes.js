
const express = require("express");
const router = express.Router();

const PurchasesController = require('../controllers/purchases.controllers');
// router.get("/",UserController.sampleUser);
router.post("/all",PurchasesController.getAll);
//router.post("/login",UserController.loginUser);
//router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
router.post("/add",PurchasesController.addPurchase);
router.put("/:_id", PurchasesController.updatePurchase);
router.delete("/:_id", PurchasesController.deletePurchase);


module.exports = router;