/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('photos', (table) => {
    table.increments('id').primary();
    table.integer('item_id').unsigned().notNullable();
    table.string('url', 500).notNullable();
    table.boolean('is_primary').defaultTo(false);
    table.integer('order').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('item_id').references('id').inTable('items').onDelete('CASCADE');
    table.index('item_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('photos');
};
