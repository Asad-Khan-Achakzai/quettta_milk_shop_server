const adminsController = {};
const Admins = require('../models/admins.model');
const path = require('path');
const bcrypt = require('bcryptjs');
const jsonwebtoken =  require('jsonwebtoken');

adminsController.registerAdmin = async (req, res) => {
  try {
    const body = req.body;

    // there must be a password in body

    // we follow these 2 steps

    const password = body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    body.password = hash;
    const admin = new Admins(body);

    const result = await admin.save();

    res.send({
      message: 'Signup successful'
    });
  } catch (ex) {
    console.log('ex', ex);
    if(ex.code===11000){
      res
      .send({
        message: 'This email has been registered already',
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

adminsController.loginAdmin = async (req, res) => {
    try {
        const body = req.body;
    
        const email = body.email;
    
        // lets check if email exists
    
        const result = await Admins.findOne({ email: email });
        if (!result) {
          // this means result is null
          res.status(401).send({
            Error: 'This user doesnot exists. Please signup first'
          });
        } else {
          // email did exist
          // so lets match password
    
          if ( bcrypt.compareSync(body.password, result.password)) {
            // great, allow this user access
                
            result.password = undefined;
    
            const token = jsonwebtoken.sign({
               data: result,
               role: 'Admin'
            }, 'supersecretToken', { expiresIn: '7d' });
            
            res.send({ message: 'Successfully Logged in', token: token });
          } 
          
          else {
            console.log('password doesnot match');
    
            res.status(401).send({ message: 'Wrong email or Password' });
          }
        }
      } catch (ex) {
        console.log('ex', ex);
      }
};

module.exports = adminsController;