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
          ownerId: 1,
          address: "1600 Pennsylvania Ave NW",
          city: "Washington",
          state: "DC",
          country: "United States",
          lat: 38.8977,
          lon: -77.0366,
          name: "The White House",
          description: "The official residence and workplace of the President of the United States",
          price: 10000,
        },
        {
          ownerId: 2,
          address: "Eiffel Tower",
          city: "Paris",
          state: "",
          country: "France",
          lat: 48.8584,
          lon: 2.2945,
          name: "Eiffel Tower",
          description: "An iconic wrought-iron lattice tower on the Champ de Mars in Paris",
          price: 20000,
        },
        {
          ownerId: 3,
          address: "Great Wall of China",
          city: "",
          state: "",
          country: "China",
          lat: 40.4319,
          lon: 116.5704,
          name: "Great Wall of China",
          description:
            "A series of fortifications built along the northern borders of China to protect against various nomadic groups",
          price: 30000,
        },
        {
          ownerId: 4,
          address: "Machu Picchu",
          city: "",
          state: "",
          country: "Peru",
          lat: -13.1631,
          lon: -72.545,
          name: "Machu Picchu",
          description: "A 15th-century Inca citadel located in the Andes Mountains of Peru",
          price: 40000,
        },
        {
          ownerId: 5,
          address: "Sydney Opera House",
          city: "Sydney",
          state: "NSW",
          country: "Australia",
          lat: -33.8568,
          lon: 151.2153,
          name: "Sydney Opera House",
          description: "A multi-venue performing arts center in Sydney, Australia",
          price: 50000,
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
            "The White House",
            "Eiffel Tower",
            "Great Wall of China",
            "Machu Picchu",
            "Sydney Opera House",
          ],
        },
      },
      {}
    );
  },
};
