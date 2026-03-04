/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('matches', (table) => {
    table.increments('id').primary();
    table.integer('user_1_id').unsigned().notNullable();
    table.integer('user_2_id').unsigned().notNullable();
    table.integer('item_1_id').unsigned().nullable();
    table.integer('item_2_id').unsigned().nullable();
    table.enum('status', ['active', 'closed']).defaultTo('active');
    table.boolean('ad_shown').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('user_1_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('user_2_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('item_1_id').references('id').inTable('items').onDelete('SET NULL');
    table.foreign('item_2_id').references('id').inTable('items').onDelete('SET NULL');
    table.index('user_1_id');
    table.index('user_2_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('matches');
};
