const buyersRevisionController = {};
const Buyers = require('../models/buyers-revision.model');
const moment = require('moment');  

buyersRevisionController.addBuyer = async (req, res) => {
    try {
      const body = req.body;
      const buyer = new Buyers(body);
      buyer.timeStamp = moment().format('LLL');
      const result = await buyer.save();
      res.send({
        message: 'Buyer Revision added successfully'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This buyer Revision has already been registered',
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
buyersRevisionController.getAll = async (req, res) => {
  let obj = req.body;
  if(obj.name || obj.address || obj.mobileN || obj.phoneN || obj.type || obj.otherN || obj.milkPrice || obj.yougurtPrice)
  {
    let searhItem;
    try {
      let queryObject = Object.keys(obj)
      .filter((k) => obj[k] != null && obj[k] != undefined && obj[k] != '')
      .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});     
      searhItem = await Buyers.find(queryObject).populate('userId');
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
      items = await Buyers.find({}).populate('userId');

      // let merged = {};
      // const start = 0;
      // const length = 100;
      // items = await Buyers.paginate(
      //   merged,
      //   {
      //     offset: parseInt(start),
      //     limit: parseInt(length)
      //   }
      // );
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

  module.exports = buyersRevisionController;
