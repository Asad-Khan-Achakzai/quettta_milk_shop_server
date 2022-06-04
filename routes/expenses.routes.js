const express = require("express");
const router = express.Router();

const ExpenseController = require('../controllers/expenses.controllers');
//const checkAuth = require('../middleware/check-auth');
router.post("/all",ExpenseController.getAll);
router.post("/add",ExpenseController.addExpense);
router.delete("/:_id", ExpenseController.deleteExpense);
router.put("/:_id", ExpenseController.updateExpense);

module.exports = router;