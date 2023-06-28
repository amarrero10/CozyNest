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
          lng: -74.006,
          name: "Empire State Building",
          description: "A famous skyscraper in New York City",
          price: 2000,
          previewImage: "https://www.esbnyc.com/sites/default/files/2020-01/ESB%20Day.jpg",
          // createdAt: new Date(),
          // updatedAt: new Date(),
        },
        {
          ownerId: 6,
          address: "456 Elm St",
          city: "Los Angeles",
          state: "CA",
          country: "United States",
          lat: 34.0522,
          lng: -118.2437,
          name: "Griffith Observatory",
          description: "An iconic observatory in Los Angeles",
          price: 1500,
          previewImage:
            "https://www.travelinusa.us/wp-content/uploads/sites/3/2017/11/Griffith-Observatory-Cosa-Vedere.jpg",
          // createdAt: new Date(),
          // updatedAt: new Date(),
        },
        {
          ownerId: 7,
          address: "789 Oak St",
          city: "San Francisco",
          state: "CA",
          country: "United States",
          lat: 37.7749,
          lng: -122.4194,
          name: "Transamerica Pyramid",
          description: "A famous skyscraper in San Francisco",
          price: 1800,
          previewImage:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Transamerica_Pyramid_from_Coit_Tower.jpg/1024px-Transamerica_Pyramid_from_Coit_Tower.jpg",
          // createdAt: new Date(),
          // updatedAt: new Date(),
        },
        {
          ownerId: 8,
          address: "321 Maple St",
          city: "Chicago",
          state: "IL",
          country: "United States",
          lat: 41.8781,
          lng: -87.6298,
          name: "Willis Tower",
          description: "A famous skyscraper in Chicago",
          price: 2200,
          previewImage:
            "https://images.ctfassets.net/2utl2lkm42va/2pMBw7lwGAaXwrHch8Ga6c/0366c5f498ae18550e6360cd90d16f06/hero8.jpg",
          // createdAt: new Date(),
          // updatedAt: new Date(),
        },
        {
          ownerId: 9,
          address: "987 Pine St",
          city: "Miami",
          state: "FL",
          country: "United States",
          lat: 25.7617,
          lng: -80.1918,
          name: "Freedom Tower",
          description: "A historic tower in Miami",
          price: 1900,
          previewImage:
            "https://upload.wikimedia.org/wikipedia/commons/f/ff/Miami_Freedom_Tower_by_Tom_Schaefer.jpg",
          // createdAt: new Date(),
          // updatedAt: new Date(),
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
        name: {
          [Op.in]: [
            "Empire State Building",
            "Griffith Observatory",
            "Transamerica Pyramid",
            "Willis Tower",
            "Freedom Tower",
          ],
        },
      },
      {}
    );
  },
};
