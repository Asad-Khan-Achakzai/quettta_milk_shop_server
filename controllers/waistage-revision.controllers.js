const waistageRevisionController = {};
const Waistages = require('../models/waistage-revision.model');
const moment = require('moment');  
waistageRevisionController.addWaistage = async (req, res) => {
    try {
      const body = req.body;
      const waistage = new Waistages(body);
      waistage.timeStamp = moment().format('LLL');
      const result = await waistage.save();
      res.send({
        message: 'waistage Revision added successfully'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This waistage Revision has already been registered',
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
waistageRevisionController.getAll = async (req, res) => {
  let obj = req.body;
  if(obj.buyer || obj.item || obj.quantity || obj.reason)
  {
    let searhItem;
    try {
      let queryObject = Object.keys(obj)
      .filter((k) => obj[k] != null && obj[k] != undefined && obj[k] != '')
      .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});     
      searhItem = await Waistages.find(queryObject).populate('userId')
      .populate('buyer')
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
      items = await Waistages.find({}).populate('userId')
      .populate('buyer')
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

module.exports = waistageRevisionController;
