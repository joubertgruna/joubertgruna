const itemRepository = require('../repositories/itemRepository');
const photoRepository = require('../repositories/photoRepository');

class ItemService {
  async create(userId, itemData, files = []) {
    // Create item
    const item = await itemRepository.create({
      user_id: userId,
      title: itemData.title,
      description: itemData.description || null,
      category: itemData.category,
      condition: itemData.condition,
      trade_for: itemData.trade_for || null,
    });

    // Create photos if uploaded
    if (files.length > 0) {
      const photos = files.map((file, index) => ({
        item_id: item.id,
        url: `/uploads/${file.filename}`,
        is_primary: index === 0,
        order: index,
      }));
      await photoRepository.createMany(photos);
    }

    return itemRepository.findByIdWithPhotos(item.id);
  }

  async findById(id) {
    const item = await itemRepository.findByIdWithPhotos(id);
    if (!item) {
      const error = new Error('Item não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async findByUser(userId) {
    return itemRepository.findByUser(userId);
  }

  async findForFeed(userId, pagination) {
    return itemRepository.findForFeed(userId, pagination);
  }

  async update(userId, itemId, data) {
    const isOwner = await itemRepository.isOwner(itemId, userId);
    if (!isOwner) {
      const error = new Error('Sem permissão para editar este item.');
      error.statusCode = 403;
      throw error;
    }

    return itemRepository.update(itemId, data);
  }

  async delete(userId, itemId) {
    const isOwner = await itemRepository.isOwner(itemId, userId);
    if (!isOwner) {
      const error = new Error('Sem permissão para remover este item.');
      error.statusCode = 403;
      throw error;
    }

    // Delete photos first
    await photoRepository.deleteByItem(itemId);
    return itemRepository.delete(itemId);
  }

  async addPhotos(userId, itemId, files) {
    const isOwner = await itemRepository.isOwner(itemId, userId);
    if (!isOwner) {
      const error = new Error('Sem permissão para adicionar fotos.');
      error.statusCode = 403;
      throw error;
    }

    const existingPhotos = await photoRepository.findByItem(itemId);
    const startOrder = existingPhotos.length;

    const photos = files.map((file, index) => ({
      item_id: itemId,
      url: `/uploads/${file.filename}`,
      is_primary: existingPhotos.length === 0 && index === 0,
      order: startOrder + index,
    }));

    return photoRepository.createMany(photos);
  }

  async deletePhoto(userId, itemId, photoId) {
    const isOwner = await itemRepository.isOwner(itemId, userId);
    if (!isOwner) {
      const error = new Error('Sem permissão para remover esta foto.');
      error.statusCode = 403;
      throw error;
    }

    const photos = await photoRepository.findByItem(itemId);
    const photo = photos.find((p) => p.id === parseInt(photoId, 10));
    if (!photo) {
      const error = new Error('Foto não encontrada.');
      error.statusCode = 404;
      throw error;
    }

    await photoRepository.delete(photoId);

    // If deleted photo was primary, set first remaining as primary
    if (photo.is_primary) {
      const remaining = await photoRepository.findByItem(itemId);
      if (remaining.length > 0) {
        await photoRepository.setPrimary(remaining[0].id, itemId);
      }
    }

    return { message: 'Foto removida com sucesso.' };
  }
}

module.exports = new ItemService();
