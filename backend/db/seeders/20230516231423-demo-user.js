"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "Demo",
          lastName: "Lition",
        },
        {
          email: "user1@user.io",
          username: "Negativenancy",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "Negative",
          lastName: "Nancy",
        },
        {
          email: "user2@user.io",
          username: "Hankthedog",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Hank",
          lastName: "Thedog",
        },
        {
          email: "user3@user.io",
          username: "JohnDoe",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "John",
          lastName: "Doe",
        },
        {
          email: "user4@user.io",
          username: "JaneSmith",
          hashedPassword: bcrypt.hashSync("password4"),
          firstName: "Jane",
          lastName: "Smith",
        },
        {
          email: "user5@user.io",
          username: "MichaelJohnson",
          hashedPassword: bcrypt.hashSync("password5"),
          firstName: "Michael",
          lastName: "Johnson",
        },
        {
          email: "user6@user.io",
          username: "EmilyDavis",
          hashedPassword: bcrypt.hashSync("password6"),
          firstName: "Emily",
          lastName: "Davis",
        },
        {
          email: "user7@user.io",
          username: "DanielWilson",
          hashedPassword: bcrypt.hashSync("password7"),
          firstName: "Daniel",
          lastName: "Wilson",
        },
        {
          email: "user8@user.io",
          username: "OliviaBrown",
          hashedPassword: bcrypt.hashSync("password8"),
          firstName: "Olivia",
          lastName: "Brown",
        },
        {
          email: "user9@user.io",
          username: "AlexanderTaylor",
          hashedPassword: bcrypt.hashSync("password9"),
          firstName: "Alexander",
          lastName: "Taylor",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};
