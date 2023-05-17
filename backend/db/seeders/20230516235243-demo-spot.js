"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 5,
          address: "123 Main St",
          city: "New York",
          state: "NY",
          country: "United States",
          lat: 40.7128,
          lon: -74.006,
          name: "Empire State Building",
          description: "A famous skyscraper in New York City",
          price: 2000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 6,
          address: "456 Elm St",
          city: "Los Angeles",
          state: "CA",
          country: "United States",
          lat: 34.0522,
          lon: -118.2437,
          name: "Griffith Observatory",
          description: "An iconic observatory in Los Angeles",
          price: 1500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 7,
          address: "789 Oak St",
          city: "San Francisco",
          state: "CA",
          country: "United States",
          lat: 37.7749,
          lon: -122.4194,
          name: "Transamerica Pyramid",
          description: "A famous skyscraper in San Francisco",
          price: 1800,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 8,
          address: "321 Maple St",
          city: "Chicago",
          state: "IL",
          country: "United States",
          lat: 41.8781,
          lon: -87.6298,
          name: "Willis Tower",
          description: "A famous skyscraper in Chicago",
          price: 2200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 9,
          address: "987 Pine St",
          city: "Miami",
          state: "FL",
          country: "United States",
          lat: 25.7617,
          lon: -80.1918,
          name: "Freedom Tower",
          description: "A historic tower in Miami",
          price: 1900,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
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
