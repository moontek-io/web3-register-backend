const knexfile = require('../knexfile');

const environment = process.env.ENVIRONMENT || 'development';
const config = knexfile[environment];
const knex = require('knex')(config);

module.exports = knex;
