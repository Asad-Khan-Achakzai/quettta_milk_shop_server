const purchasesRevisionController = {};
const Purchases = require('../models/purchases-revision.model');
const moment = require('moment');  
purchasesRevisionController.addPurchase = async (req, res) => {
    try {
      const body = req.body;
      const purchase = new Purchases(body);
      purchase.timeStamp = moment().format('LLL');
      const result = await purchase.save();
      res.send({
        message: 'purchase Revision added successfully'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This purchase Revision has already been registered',
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
purchasesRevisionController.getAll = async (req, res) => {
  let obj = req.body;
  if(obj.seller || obj.item || obj.quantity || obj.payment)
  {
    let searhItem;
    try {
      let queryObject = Object.keys(obj)
      .filter((k) => obj[k] != null && obj[k] != undefined && obj[k] != '')
      .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});     
      searhItem = await Purchases.find(queryObject).populate('userId')
      .populate('seller')
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
      items = await Purchases.find({}).populate('userId')
      .populate('seller')
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

module.exports = purchasesRevisionController;
