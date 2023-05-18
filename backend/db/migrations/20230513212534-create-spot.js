"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Spots",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        ownerId: {
          type: Sequelize.INTEGER,
        },
        address: {
          type: Sequelize.STRING,
        },
        city: {
          type: Sequelize.STRING,
        },
        state: {
          type: Sequelize.STRING,
        },
        country: {
          type: Sequelize.STRING,
        },
        lat: {
          type: Sequelize.FLOAT,
        },
        lon: {
          type: Sequelize.FLOAT,
        },
        name: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
        price: {
          type: Sequelize.INTEGER,
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
        avgRating: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
        previewImage: {
          type: Sequelize.STRING,
          defaultValue: "No Images uploaded.",
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.dropTable(options);
  },
};
