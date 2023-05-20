"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        { userId: 1, spotId: 1, stars: 4, review: "Great experience, highly recommended!" },
        { userId: 2, spotId: 1, stars: 5, review: "Absolutely loved it, fantastic place!" },
        { userId: 3, spotId: 1, stars: 3, review: "Good spot, decent experience." },
        { userId: 4, spotId: 1, stars: 2, review: "Average place, nothing special." },
        { userId: 1, spotId: 2, stars: 5, review: "One of the best places I've been to!" },
        { userId: 2, spotId: 2, stars: 1, review: "Terrible experience, wouldn't recommend." },
        { userId: 3, spotId: 2, stars: 4, review: "Enjoyed my time, would visit again." },
        { userId: 4, spotId: 2, stars: 3, review: "Decent place, had some flaws." },
        { userId: 5, spotId: 2, stars: 2, review: "Not impressed, expected more." },
        { userId: 1, spotId: 3, stars: 3, review: "Average spot, nothing outstanding." },
        { userId: 2, spotId: 3, stars: 4, review: "Great location, had a good time." },
        { userId: 3, spotId: 3, stars: 2, review: "Disappointing experience, wouldn't go back." },
        { userId: 4, spotId: 3, stars: 5, review: "Unforgettable place, highly recommended!" },
        { userId: 5, spotId: 3, stars: 1, review: "Worst spot ever, complete waste of time." },
        { userId: 1, spotId: 4, stars: 4, review: "Awesome spot, exceeded expectations!" },
        { userId: 2, spotId: 4, stars: 5, review: "Incredible place, a must-visit!" },
        { userId: 3, spotId: 4, stars: 3, review: "Average experience, had some drawbacks." },
        { userId: 4, spotId: 4, stars: 2, review: "Below average spot, not worth the hype." },
        { userId: 5, spotId: 4, stars: 4, review: "Pleasant surprise, would recommend!" },
        { userId: 1, spotId: 5, stars: 5, review: "Magical place, unforgettable memories!" },
        { userId: 2, spotId: 5, stars: 3, review: "Decent spot, had its charms." },
        { userId: 3, spotId: 5, stars: 4, review: "Highly enjoyable, worth a visit!" },
        { userId: 4, spotId: 5, stars: 2, review: "Disappointing, didn't meet expectations." },
        { userId: 5, spotId: 5, stars: 5, review: "Paradise on Earth, a dream come true!" },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        [Op.or]: [
          { userId: 1, spotId: 1 },
          { userId: 2, spotId: 1 },
          { userId: 3, spotId: 1 },
          { userId: 4, spotId: 1 },
          { userId: 1, spotId: 2 },
          { userId: 2, spotId: 2 },
          { userId: 3, spotId: 2 },
          { userId: 4, spotId: 2 },
          { userId: 5, spotId: 2 },
          { userId: 1, spotId: 3 },
          { userId: 2, spotId: 3 },
          { userId: 3, spotId: 3 },
          { userId: 4, spotId: 3 },
          { userId: 5, spotId: 3 },
          { userId: 1, spotId: 4 },
          { userId: 2, spotId: 4 },
          { userId: 3, spotId: 4 },
          { userId: 4, spotId: 4 },
          { userId: 5, spotId: 4 },
          { userId: 1, spotId: 5 },
          { userId: 2, spotId: 5 },
          { userId: 3, spotId: 5 },
          { userId: 4, spotId: 5 },
          { userId: 5, spotId: 5 },
        ],
      },
      {}
    );
  },
};
