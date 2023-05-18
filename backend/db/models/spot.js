"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "Owner",
      });
      // one-to-many with UserSpot model
      Spot.hasMany(models.UserSpot, { foreignKey: "spotId" });
      // one-to-many with Booking model
      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
      // one-to-many with Review model
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
      // one-to-many with Image model
      Spot.hasMany(models.Image, { foreignKey: "imageableId" });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: DataTypes.FLOAT,
      lon: DataTypes.FLOAT,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      avgRating: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      previewImage: {
        type: DataTypes.STRING,
        defaultValue: "No Images uploaded.",
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
