const express = require('express');
const router = express.Router();
const user = require('../models').User;
const courses = require('../models').Courses;
const { authenticateUser } = require("../middleware/auth-user");

const { users } = require('./seed/data.json');
const { course } = require('./seed/data.json');

function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        next(error);
      }
    }
  };
  

//USER ROUTES
 //GET route that will return all properties and values for the currently authenticated User along with 200 status code

 router.get("/api/user", authenticateUser,asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json(user);
 } ))

//POST route that will create a new user and retun a 201 HTTP status code
router.post("/api/user", authenticateUser, asyncHandler(async (req, res, err) => {
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

  //
  router.get("/courses/:id", (req, res) => {
    const courses = course.find(course.id == req.params.id)
    res.json(courses);
    res.status(200).json(courses);
  });

  //POST route
  // router.post("/courses")


  // router.put("/courses/:id")


  // router.delete("/courses/:id", asyncHandler (async (req, res) => {
  //   let courseId = req.params.id
  //   try {
  //     let course = await Courses.findOne({ where: { id: courseId}})
  //     if (course) {
  //       await course.destroy();
  //     } else {
  //       next(createError(404, "Could not find any courses with this id"))
  //     }
  //   } catch (error) {
  //     if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraint') {
  //       const errors = error.errors.map(err => err.message);
  //       res.status(400).json({ errors });
  //     } else {
  //       throw error;
  //     }
  //   }
  // }));

