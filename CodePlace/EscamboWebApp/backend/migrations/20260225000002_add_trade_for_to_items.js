/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('items', (table) => {
    table.string('trade_for', 255).nullable().after('condition');
  });

  // Update condition enum to include 'desgastado'
  await knex.raw("ALTER TABLE items MODIFY COLUMN `condition` ENUM('novo','seminovo','usado','desgastado','antigo') NOT NULL");
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.raw("ALTER TABLE items MODIFY COLUMN `condition` ENUM('novo','seminovo','usado','antigo') NOT NULL");

  await knex.schema.alterTable('items', (table) => {
    table.dropColumn('trade_for');
  });
};
