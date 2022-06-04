const express = require("express");
const router = express.Router();

const SalesController = require('../controllers/sales.controllers');
// router.get("/",UserController.sampleUser);
router.post("/all",SalesController.getAll);
//router.post("/login",UserController.loginUser);
//router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
router.post("/add",SalesController.addSale);
router.put("/:_id", SalesController.updateSale);
router.delete("/:_id", SalesController.deleteSale);


module.exports = router;