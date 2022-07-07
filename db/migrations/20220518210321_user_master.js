exports.up = async function (knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('user_master', (table) => {
    table.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('user_email_id');
    table.string('discord_member_id');
    table.string('wallet_address').notNullable();
    table.string('eth_network').notNullable();
    table.string('imx_token').notNullable();
    table.string('otp');
    table.integer('reward_point').defaultTo(0);
    table.string('referral_code');
    table.string('active_step').notNullable().defaultTo('connect');
    table.bool('is_confirmed').defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at');

    table.index('wallet_address');
    table.unique('wallet_address');
    table.unique('referral_code');
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable('user_master');
};
