const SellersRevisionController = {};
const Sellers = require('../models/sellers-revision.model');
const moment = require('moment');  

SellersRevisionController.addSeller = async (req, res) => {
    try {
      const body = req.body;
      const seller = new Sellers(body);
      seller.timeStamp = moment().format('LLL');
      const result = await seller.save();
      res.send({
        message: 'Seller Revision added successfully'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This Seller Revision has already been registered',
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
SellersRevisionController.getAll = async (req, res) => {
  let obj = req.body;
  if(obj.name || obj.address || obj.mobileN || obj.phoneN || obj.otherN || obj.milkPrice || obj.yougurtPrice)
  {
    let searhItem;
    try {
      let queryObject = Object.keys(obj)
      .filter((k) => obj[k] != null && obj[k] != undefined && obj[k] != '')
      .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});     
      searhItem = await Sellers.find(queryObject).populate('userId');
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
      items = await Sellers.find({}).populate('userId');
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

  module.exports = SellersRevisionController;
