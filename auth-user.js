'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require("./models/User");

exports.authenticateUser = async (req, res, next) => {
    let message;
     const credentials = auth(req);
   
     if (credentials) {
       const user = await User.findOne({ where: { emailAdress: credentials.name} });
       if (user) {
         const authenticated = bcrypt
         .compareSync(credentials.pass, user.password);
        if (authenticated) {
         console.log(`Authentication successful for username: ${user.emailAdress}`)
         req.currentUser = user;
       } else {
         message =`Authentication failed for ${user.emailAdress}`
       }
     } else {
       message = `User not found for email: ${credentials.name}`
     } 
      } else {
       message = "Authorization header not found"
     }
 
     if (message) {
       console.warn(message);
       res.status(401).json({  message: 'Access Denied' })
     } else {
     next()
     };
   };