"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Bookings",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        spotId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );

    options.tableName = "Bookings";
    await queryInterface.addIndex(options, {
      fields: ["spotId", "startDate", "endDate"],
      unique: true,
      name: "unique_spot_booking_dates",
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";

    await queryInterface.dropTable(options);
    await queryInterface.removeIndex(options, "unique_spot_booking_dates");
  },
};
