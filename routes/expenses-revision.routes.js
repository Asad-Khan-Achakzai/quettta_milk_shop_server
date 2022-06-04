const express = require("express");
const router = express.Router();

const expRevisionController = require('../controllers/expenses-revision.controllers');
router.post("/all",expRevisionController.getAll);
router.post("/add",expRevisionController.addExpense);

module.exports = router;