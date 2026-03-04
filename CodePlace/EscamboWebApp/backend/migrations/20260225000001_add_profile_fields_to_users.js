/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('bio', 500).nullable().after('avatar_url');
    table.string('city', 100).nullable().after('bio');
    table.string('state', 2).nullable().after('city');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('bio');
    table.dropColumn('city');
    table.dropColumn('state');
  });
};
