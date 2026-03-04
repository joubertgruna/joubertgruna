/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('ads', (table) => {
    table.increments('id').primary();
    table.string('title', 200).notNullable();
    table.string('image_url', 500).notNullable();
    table.string('redirect_url', 500).nullable();
    table.integer('duration_seconds').defaultTo(30);
    table.boolean('is_active').defaultTo(true);
    table.integer('impressions').defaultTo(0);
    table.integer('clicks').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('ads');
};
