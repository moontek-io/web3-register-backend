/* eslint-disable no-console */
const app_settings = require('../resources/app_settings');

exports.seed = async (knex) => {
  try {
    console.log('Planting seeds for app setting');

    const seeds = await app_settings();
    await knex('app_setting_master').insert(seeds);

    console.log('✓');
  } catch (err) {
    console.warn('Error! Cannot insert app setting');
    return console.error(err);
  }
};
