"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-01-05"),
      },
      {
        userId: 2,
        spotId: 2,
        startDate: new Date("2023-02-01"),
        endDate: new Date("2023-02-05"),
      },
      {
        userId: 3,
        spotId: 3,
        startDate: new Date("2023-01-10"),
        endDate: new Date("2023-01-12"),
      },
      {
        userId: 4,
        spotId: 4,
        startDate: new Date("2023-02-09"),
        endDate: new Date("2023-02-13"),
      },
      {
        userId: 5,
        spotId: 5,
        startDate: new Date("2023-04-20"),
        endDate: new Date("2023-04-25"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      [Op.or]: [
        { userId: 1, spotId: 1 },
        { userId: 2, spotId: 2 },
        { userId: 3, spotId: 3 },
        { userId: 4, spotId: 4 },
        { userId: 5, spotId: 1 },
      ],
    });
  },
};
