import CONFIG from '../../config';
import storyDB from '../../utils/story-db';

class HomeModel {
  getToken() {
    return localStorage.getItem('token');
  }

  async getStories(token, limit = 5) {
    try {
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login ulang.');
      }
      const response = await fetch(`${CONFIG.BASE_URL}/stories?page=1&size=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        localStorage.removeItem('token'); // Hapus token yang tidak valid
        throw new Error('Sesi telah kadaluarsa. Silakan login ulang.');
      }
      if (!response.ok) throw new Error(`Gagal memuat cerita: ${response.statusText}`);
      const data = await response.json();
      await storyDB.saveStories(data.listStory); // Simpan ke IndexedDB
      return data;
    } catch (error) {
      const cachedStories = await storyDB.getStories();
      return { error: false, listStory: cachedStories.slice(0, limit), message: error.message };
    }
  }

  async deleteStory(id) {
    try {
      await storyDB.deleteStory(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default HomeModel;