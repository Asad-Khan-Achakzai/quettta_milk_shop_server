const expRevisionController = {};
const Expenses = require('../models/expenses-revision.model');
const moment = require('moment');  

expRevisionController.addExpense = async (req, res) => {
    try {
      const body = req.body;
      const expense = new Expenses(body);
      expense.timeStamp = moment().format('LLL');
      const result = await expense.save();
  
      res.send({
        message: 'expense revision added successfully'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This expense revision has already been registered',
        })
        .status(500);
      }
      else {
      res
        .send({
          message: 'Error',
          detail: ex
        })
        .status(500);
    }
  }
  };
  expRevisionController.getAll = async (req, res) => {
    let obj = req.body;
    if(obj.price || obj.item || obj.quantity || obj.details)
    {
      let searhItem;
      try {
        let queryObject = Object.keys(obj)
        .filter((k) => obj[k] != null && obj[k] != undefined && obj[k] != '')
        .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});     
        searhItem = await Expenses.find(queryObject).populate('userId')
        .populate('item');
        res.status(200).send({
          code: 200,
          message: 'Successful',
          data: searhItem
        });
      } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
      }    }
    else
    {
      let items;
      try {
        items = await Expenses.find({}).populate('userId')
        .populate('item');
        res.status(200).send({
          code: 200,
          message: 'Successful',
          data: items
        });
      } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
      }
    }
  
  };
  module.exports = expRevisionController;