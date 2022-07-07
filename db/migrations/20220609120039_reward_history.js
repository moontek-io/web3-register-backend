
exports.up = async function (knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await knex.schema.createTable('reward_history', (table) => {
        table.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('user_id').notNullable();
        table.string('reward_type').notNullable();
        table.enu('transaction_type', ['debit', 'credit']).notNullable();
        table.integer('reward_point').notNullable();
        table.float('opening_balance').notNullable();
        table.float('closing_balance').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at');
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTable('reward_history');
};
