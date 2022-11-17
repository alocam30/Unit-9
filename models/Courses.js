'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Courses extends Sequelize.Model {}
  Courses.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    estimatedTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  }, { sequelize });

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