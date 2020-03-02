const Sequelize = require("sequelize");
const database = require("../config/database");

const project = database.define("project", {
  projectname: {
    type: Sequelize.STRING
  },
  rate: {
    type: Sequelize.STRING
  },
  hoursperweek: {
    type: Sequelize.STRING
  },
  projectinfo: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  },
  developers: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
});

module.exports = project;
