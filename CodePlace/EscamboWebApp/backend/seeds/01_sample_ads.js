/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  // Clean tables
  await knex('messages').del();
  await knex('matches').del();
  await knex('likes').del();
  await knex('photos').del();
  await knex('items').del();
  await knex('ads').del();
  await knex('users').del();

  // Insert sample ads
  await knex('ads').insert([
    {
      title: 'Anúncio Exemplo 1',
      image_url: 'https://via.placeholder.com/600x300?text=Anuncio+1',
      redirect_url: 'https://example.com/ad1',
      duration_seconds: 30,
      is_active: true,
    },
    {
      title: 'Anúncio Exemplo 2',
      image_url: 'https://via.placeholder.com/600x300?text=Anuncio+2',
      redirect_url: 'https://example.com/ad2',
      duration_seconds: 45,
      is_active: true,
    },
  ]);
};
