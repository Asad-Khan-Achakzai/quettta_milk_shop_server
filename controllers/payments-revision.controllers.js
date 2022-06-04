const PaymentsRevisionController = {};
const Sales = require('../models/payments-revision.model');
const moment = require('moment');  

PaymentsRevisionController.addPayment = async (req, res) => {
    try {
      const body = req.body;
      const sale = new Sales(body);
      sale.timeStamp = moment().format('LLL');
      const result = await sale.save();
      res.send({
        message: 'payments Revision added successfully'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This payments Revision has already been registered',
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
PaymentsRevisionController.getAll = async (req, res) => {
  let obj = req.body;
  if(obj.buyer || obj.amount || obj.unpaid || obj.type || obj.sale)
  {
    let searhItem;
    try {
      let queryObject = Object.keys(obj)
      .filter((k) => obj[k] != null && obj[k] != undefined && obj[k] != '')
      .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});     
      searhItem = await Sales.find(queryObject).populate('userId')
      .populate('buyer');
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
      items = await Sales.find({}).populate('userId')
      .populate('buyer')
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

  module.exports = PaymentsRevisionController;
