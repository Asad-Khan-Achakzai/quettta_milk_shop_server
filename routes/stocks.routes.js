const express = require("express");
const router = express.Router();

const StockController = require('../controllers/stocks.controllers');
//const checkAuth = require('../middleware/check-auth');

// router.get("/",UserController.sampleUser);
//router.get("/all",UserController.getAll);
//router.post("/login",UserController.loginUser);
//router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
router.post("/add",StockController.addStock);
//router.put("/:_id", UserController.updateUser);
//router.delete("/:_id", UserController.deleteUser);


module.exports = router;