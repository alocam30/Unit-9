const express = require('express');
const Courses = require('../models/Courses');
const router = express.Router();
const user = require('../models').User;
const courses = require('../models').Courses;
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { authenticateUser } = require('./middleware/auth-user');


function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        next(error);
      }
    }
  };
  
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

//USER ROUTES
 //GET route that will return all properties and values for the currently authenticated User along with 200 status code

 router.get("/users",authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json(user);
 } ))

//POST route that will create a new user and retun a 201 HTTP status code
router.post("/users", asyncHandler(async (req, res, err) => {
  let user;
  try {
    user = await user.create(req.body);
    res.location("/");
    res.status(201).end();
    } catch(error) {
      console.log('ERROR: ', error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraint') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
  }
}));

  //COURSES ROUTES
  //GET route that will return all courses including the User associated with each course
  //and a 200 HTTP status code
  router.get("/courses", asyncHandler( async (req, res) => {
    const courses = await Courses.findAll({
      include: [
        {
          model: User,
          as: "user",
        }
      ]
    });
    res.status(200).json(courses);
  }))

  //GET route that will return courses including the User associated with each course and a 200 HTTP staatus code
  router.get("/courses/:id",asyncHandler(async (req, res) => {
    const user = await Courses.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
        }
      ]
    })
    res.status(200).json(course);
  })
  );

  //POST that will create a new course 
  router.post("/courses"),authenticateUser,asyncHandler(async (req, res) => {
    try {
      if (req.currentUser) {
        const course = await Courses.create(req.body);
        res.location("/courses/" + `${course.id}`);
        res.status(201).end();
      } else {
        res.status(401).json ( {message: "You don't have access to update this course"});
      }
    } catch (error) {
      console.log('ERROR: ', error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraint') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })


//PUT route that will update corressponding course and return a 204 HTTP status code 
  router.put("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
    try {
      let course = await Courses.findByPk(req.params.id);
      if (course) {
        if (req.currentUser.id === course.userId) {
          await course.update(req.body);
          res.status(204).end();
        } else {
          res.status(403).json({ message: 'You do not have access to update this course'});
        } }
        else {
        res.status(404).json({ message: 'Course not found'})
      }
    } catch (error) {
      console.log('ERROR: ', error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraint') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  } ))



//DELETE route
  router.delete("/courses/:id", authenticateUser , asyncHandler (async (req, res) => {
    let courseId = req.params.id
    try {
      let course = await Courses.findOne({ where: { id: courseId}})
      if (course) {
        await course.destroy();
        res.status(204).end();
      } else {
        res.status(401).json({ message: "You don't have access to delete this course" });
      }
    } catch (error) {
      console.log('ERROR: ', error.name);
    }
  }));

module.exports = router;