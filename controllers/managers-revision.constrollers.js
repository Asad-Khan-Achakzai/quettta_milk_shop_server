const managersRevisionController = {};
const Managers = require('../models/managers-revision.model');
const moment = require('moment');  

managersRevisionController.addManager = async (req, res) => {
    try {
      const body = req.body;
      const manager = new Managers(body);
      manager.timeStamp = moment().format('LLL');
       await manager.save();
      res.send({
        message: 'manager revision added successfully'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This manager revision has already been registered',
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
  managersRevisionController.getAll = async (req, res) => {
    let obj = req.body;
    if(obj.name || obj.address || obj.contact || obj.password || obj.role)
    {
      let searhItem;
      try {
        let queryObject = Object.keys(obj)
        .filter((k) => obj[k] != null && obj[k] != undefined && obj[k] != '')
        .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});     
        
        searhItem = await Managers.find(queryObject);
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
        let merged = {};
        const start = 0;
        const length = 100;
    
        items = await Managers.paginate(
          merged,
          {
            offset: parseInt(start),
            limit: parseInt(length)
          }
        );
        res.status(200).send({
          code: 200,
          message: 'Successful',
          data: items.docs
        });
      } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
      }
    }

  };
  module.exports = managersRevisionController;
