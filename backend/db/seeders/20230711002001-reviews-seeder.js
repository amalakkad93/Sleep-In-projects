'use strict';
const { Review,  Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
        {
          spotId: 1,
          userId: 1,
          review: "This was an awesome spot!",
          stars: 5
        },
        {
          spotId: 2,
          userId: 2,
          review: "This was worst spot!",
          stars: 2
        },
        {
          spotId: 3,
          userId: 3,
          review: "It is over rated spot!",
          stars: 3
        }
      ], { validate: true })
    },


  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};