'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Courses extends Sequelize.Model {}
  Courses.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
        msg: "Please provide a value for Title"
         },
         notEmpty: {
         msg: "Please provide a title"
         },
       },
},
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
      notNull: {
        msg: "Please provide a value for Description"
        },
    notEmpty: {
        msg: "Please provide a description"
        },
      }
  },
    estimatedTime: {
        type: Sequelize.STRING,
        
    },
    materialsNeeded: {
        type: Sequelize.STRING,
        
    } },
    { sequelize });

  Courses.associate = (models) => {
    Courses.belongsTo(models.User, {
      as: "user",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      }
    });
  };

  return Courses;
}