var express = require('express');
var router = express.Router();
const {validationResult} = require('express-validator'); 
const UserSchema = require('../schemas/UserSchema'); 
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create-account', function(req, res, next) {
  res.render('../views/create-acc.ejs'); 
}); 

/* POST users listing. */
router.post('/create-account', UserSchema, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

    if (!errors.isEmpty()) 
      return res.status(400).json({ 
        message: 'Creation failed', 
        errors: errors.array() 
      });
    
    const newUser = await User.create({
      name: req.body.name, 
      email: req.body.email, 
      password: req.body.password
    }); 

    return res.status(201).json({
      message: 'Creation successful', 
      user: newUser.toJSON()
    });

})); 

router.post('/sign-in', asyncHandler(async (req, res, next) => {
  const user = await User.findOne({where: {email: req.body.email}});

  if (!user) 
    return res.status(401).json({
      auth: false, 
      message: 'Invalid email'
  }); 

  const checkPassword = await bcrypt.compare(req.body.password, user.password); 

  if (!checkPassword)
    return res.status(401).json({
      auth: false, 
      message: 'invalid password'
    }); 

  const payload = {
    id: user.id, 
    email: user.email, 
    admin: user.admin
  }

  const token = jwt.sign(payload, process.env.SECRET, {expiresIn: 300}); 
  //req.token = token; 

  return res.status(200).json({
    auth: true, 
    message: 'You are logged in',
    payload
  }); 

})); 

module.exports = router;
