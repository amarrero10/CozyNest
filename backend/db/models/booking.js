"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
        otherKey: "id",
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
        otherKey: "id",
      });
    }
  }
  Booking.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfter: function (value) {
            if (this.startDate > value) {
              throw new Error("endDate must be after startDate");
            }
          },
          isNotSameAsStartDate: function (value) {
            if (this.startDate === value) {
              throw new Error("endDate cannot be the same as startDate");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
