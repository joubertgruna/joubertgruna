const adRepository = require('../repositories/adRepository');

class AdService {
  async getNextAd() {
    const ad = await adRepository.findNextAd();
    if (!ad) {
      return null;
    }

    // Register impression
    await adRepository.incrementImpressions(ad.id);

    return ad;
  }

  async registerClick(adId) {
    const ad = await adRepository.findById(adId);
    if (!ad) {
      const error = new Error('Anúncio não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    await adRepository.incrementClicks(adId);
    return true;
  }

  // Admin methods
  async createAd(data) {
    return adRepository.create(data);
  }

  async updateAd(id, data) {
    return adRepository.update(id, data);
  }

  async deleteAd(id) {
    return adRepository.delete(id);
  }

  async getAllAds() {
    return adRepository.findAll();
  }
}

module.exports = new AdService();
