const stocksController = {};
const Stocks = require('../models/stocks.model');
stocksController.addStock = async (req, res) => {
    try {
      const body = req.body;
      const stock = new Stocks(body);
      const result = await stock.save();
  
      res.send({
        message: 'Stock added successfully'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This stock has already been registered',
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
  module.exports = stocksController;
