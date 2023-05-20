"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Reviews",
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
        stars: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        review: {
          type: Sequelize.STRING(1000),
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

    options.tableName = "Reviews";
    await queryInterface.addIndex(options, {
      fields: ["userId", "spotId"],
      unique: true,
      name: "unique_user_spot_review",
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.removeIndex(options, "unique_user_spot_review");
    await queryInterface.dropTable(options);
  },
};
