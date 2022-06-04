const express = require("express");
const router = express.Router();

const itemsController = require('../controllers/items.controllers');
//const checkAuth = require('../middleware/check-auth');

// router.get("/",UserController.sampleUser);
router.post("/all",itemsController.getAll);
//router.post("/login",UserController.loginUser);
//router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
router.post("/add",itemsController.addItem);
router.put("/:_id", itemsController.updateItem);
router.delete("/:_id", itemsController.deleteItem);


module.exports = router;