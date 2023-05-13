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
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@gmail.com",
          username: "johndoe",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "janedoe@gmail.com",
          username: "janedoe",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Bob",
          lastName: "Smith",
          email: "bobsmith@gmail.com",
          username: "bobsmith",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarahjohnson@gmail.com",
          username: "sarahjohnson",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          firstName: "Mike",
          lastName: "Davis",
          email: "mikedavis@gmail.com",
          username: "mikedavis",
          hashedPassword: bcrypt.hashSync("password5"),
        },
        {
          firstName: "Julia",
          lastName: "Lee",
          email: "juliale@gmail.com",
          username: "juliale",
          hashedPassword: bcrypt.hashSync("password6"),
        },
        {
          firstName: "Tom",
          lastName: "Wang",
          email: "tomwang@gmail.com",
          username: "tomwang",
          hashedPassword: bcrypt.hashSync("password7"),
        },
        {
          firstName: "Amanda",
          lastName: "Nguyen",
          email: "amandanguyen@gmail.com",
          username: "amandanguyen",
          hashedPassword: bcrypt.hashSync("password8"),
        },
        {
          firstName: "David",
          lastName: "Kim",
          email: "davidkim@gmail.com",
          username: "davidkim",
          hashedPassword: bcrypt.hashSync("password9"),
        },
        {
          firstName: "Emily",
          lastName: "Park",
          email: "emilypark@gmail.com",
          username: "emilypark",
          hashedPassword: bcrypt.hashSync("password10"),
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
        username: {
          [Op.in]: [
            "johndoe",
            "janedoe",
            "bobsmith",
            "sarahjohnson",
            "mikedavis",
            "juliale",
            "tomwang",
            "amandanguyen",
            "davidkim",
            "emilypark",
          ],
        },
      },
      {}
    );
  },
};
