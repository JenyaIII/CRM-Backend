const Sequelize = require("sequelize");
const database = require("../config/database");

const developer = database.define("developer", {
  devname: {
    type: Sequelize.STRING,
    required: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    },
    required: true,
    min: 6,
    max: 256,
    unique: true
  },
  skype: {
    type: Sequelize.STRING
  },
  telephone: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  },
  pic: {
    type: Sequelize.STRING
  },
  about: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    required: true,
    min: 6
  }
});

module.exports = developer;
