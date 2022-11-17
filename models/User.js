'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required'
        },
        // notEmpty: {
        //   msg: 'Please proivde a first name'
        // }
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        // notEmpty: {
        //   msg: 'Please proivde a last name'
        // }
      }
    },
    emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'An email is required'
          },
          isEmail: {
            msg: 'Please provide a valid email address'
          }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          notEmpty: {
            msg: 'Please provide a valid password'
          }
        }
    },
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Courses);
  };

  return User;
}