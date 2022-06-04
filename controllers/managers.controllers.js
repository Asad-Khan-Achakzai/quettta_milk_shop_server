const managersController = {};
const Managers = require('../models/managers.model');
const moment = require('moment');  
var querystring = require('querystring');
const http = require('http');

managersController.loginManager = async (req, res) => {
  try {
      const body = req.body;

      const name = body.name;

      // lets check if email exists
      const result = await Managers.findOne({ name: name });
      if (!result) {
          // this means result is null
          res.send({
            message: 'This user doesnot exists. Please Add first'
          });
      } else {
          // email did exist
          // so lets match password
          if (body.password == result.password) {
              // great, allow this user access

              res.send({ 
                message: 'Successfully Logged in', 
                id: result._id,
                name:result.name,
                role:result.role
              });
          }

          else {
              res.send({ message: 'Wrong User Name or Password' });
          }
      }
  } catch (ex) {
      console.log('ex', ex);
  }
};

managersController.addManager = async (req, res) => {
    try {
      const body = req.body;
      const manager = new Managers(body);
      manager.timeStamp = moment().format('L'); 
      const result = await manager.save();
  
      res.send({
        message: 'manager added successfully',
        data: result
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This manager has already been registered',
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
  managersController.deleteManager = async (req, res) => {
    if (!req.params._id) {
      Fu;
      res.status(500).send({
        message: 'ID missing'
      });
    }
    try {
      const _id = req.params._id;
  
      const result = await Managers.findOneAndDelete({
        _id: _id
      });
      if(result._id)
      {
        var id  = result._id.toString();
        var status = 2;
        var revision = result.revision + 1;
        var revise =  {
        revision : revision,
        status : status,
        groupId : id,
        // userId : result.userId,
        contact : result.contact,
        name : result.name,
        address : result.address,
        password:result.password,
        role:result.role,
        timeStamp : moment().format('L')
      }
        var value = await addRevision(revise).then((responce) =>{
          return responce;
        });
      }
      res.status(200).send({
        code: 200,
        message: 'Deleted Successfully'
      });
    } catch (error) {
      console.log('error', error);
      return res.status(500).send(error);
    }
  };
  async function addRevision(revision){
    var promise = new Promise(function(resolve, reject){
    var postData = revision;
    var postBody = querystring.stringify(postData);
    var options = {
        host: 'localhost',
        port: 3000,
        path: '/managersRevision/add',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postBody.length
      }
    };
    var body = [];
    
    var req =  http.request(options, function(res) {
      res.on('data', function(data) {
        body.push(data);
      });
      res.on("end", function () {
       if(body){
        body = JSON.parse(Buffer.concat(body).toString());
        resolve(body)
       }
      });
    });
    req.write(postBody);
    req.end();
    
    req.on('error', function(e) {
      console.error(e);
    });
      });
      return promise
    }
  managersController.updateManager = async (req, res) => {
    if (!req.params._id) {
      res.status(500).send({
        message: 'ID missing'
      });
    }
    try {
      const _id = req.params._id;
      let updates = req.body;
      runUpdate(_id, updates, res);
    } catch (error) {
      console.log('error', error);
      return res.status(500).send(error);
    }
  };
  async function runUpdate(_id, updates, res) {
    try {
      //save history first
      if(_id)
      {        
        const result = await Managers.findOne({ _id: _id });
        if(result._id)
        {
        var id  = result._id.toString();
        var status = 1;
        var revision = result.revision + 1;
        var revise =  {
        revision : revision,
        status : status,
        groupId : id,
        // userId : result.userId,
        contact : result.contact,
        name : result.name,
        address : result.address,
        password:result.password,
        role:result.role,
        timeStamp : moment().format('L')
      }
        var value = await addRevision(revise).then((responce) =>{
          return responce;
        });
      }
    }
      const result = await Managers.updateOne(
        {
          _id: _id
        },
        {
          $set: updates
        },
        {
          upsert: true,
          runValidators: true,
        }
      );
      {
        if (result.nModified == 1) {
          const updated = await Managers.findOne({ _id: _id });
          res.status(200).send({
            code: 200,
            message: 'Updated Successfully',
            data: updated
          });
        } else if (result.upserted) {
          res.status(200).send({
            code: 200,
            message: 'Created Successfully'
          });
        } else {
          res.status(422).send({
            code: 422,
            message: 'Unprocessible Entity'
          });
        }
      }
    } catch (error) {
      console.log('error', error);
      return res.status(500).send(error);
    }
  }
  managersController.getAll = async (req, res) => {
    var result = [];
    let obj = req.body?.item;
    let counts;
    const start = req.body?.pagination?.pageNo;
    const length = req.body?.pagination?.itemsPerPage;
    console.log('start',start);
    console.log('length',length);
    let history = req.body.history;
    if(obj.name || obj.address || obj.contact || obj.password || obj.role)
    {
      let searhItem;
      try {
        delete req.body.history;
        let queryObject = Object.keys(obj)
        .filter((k) => obj[k] != null && obj[k] != undefined && obj[k] != '')
        .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});     
        
        searhItem = await Managers.find(queryObject).populate('userId').skip(start*length).limit(length);
        counts = await Managers.countDocuments(queryObject); 
        console.log('searhItem:',searhItem)

        if(history == 'true')
        {
          result = await getRevision(req.body).then((value)=>{
          return value;
          });
        }
        console.log('revidion:',result)
        let combinedArray = [];
          let latestData = [];
          latestData = searhItem;
          let historyData = [];
          historyData = result.data || [];

          combinedArray = [...latestData];
          combinedArray.push(...historyData);
          combinedArray.sort(function(a, b) {
            var keyA = a._id;
              keyB = b._id;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
        res.status(200).send({
          code: 200,
          message: 'Successful',
          data: searhItem,
          count:counts
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
        counts = await Managers.countDocuments({}); 
        if(history == 'true')
        {
          delete req.body.history;
          result = await getRevision(req.body).then((value)=>{
          return value;
          });
        } 
        let combinedArray = [];
          let latestData = [];
          latestData = items.docs;
          let historyData = [];
          historyData = result.data || []

          combinedArray = [...latestData];
          combinedArray.push(...historyData);
          combinedArray.sort(function(a, b) {
            var keyA = a._id;
              keyB = b._id;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
        res.status(200).send({
          code: 200,
          message: 'Successful',
          data: items,
          count:counts
        });
      } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
      }
    }

  };
  async function getRevision(revision){
    var promise = new Promise(function(resolve, reject){
    var postData = revision;
    var postBody = querystring.stringify(postData);
    var options = {
        host: 'localhost',
        port: 3000,
        path: '/managersRevision/all',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postBody.length
      }
    };
    var body = [];
    
    var req =  http.request(options, function(res) {
      // console.log(res.statusCode);
      res.on('data', function(data) {
        body.push(data);
      });
      res.on("end", function () {
       if(body){
        body = JSON.parse(Buffer.concat(body).toString());
        resolve(body)
       }
      });
    });
    req.write(postBody);
    req.end();
    
    req.on('error', function(e) {
      console.error(e);
    });
      });
      return promise
    }
  module.exports = managersController;
