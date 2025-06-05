import CONFIG from '../../config';
import storyDB from '../../utils/story-db';

class AddStoryModel {
  getToken() {
    return localStorage.getItem('token');
  }

  async saveStory(formData, token) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan story');

      // Buat cerita manual karena API tidak mengembalikan data lengkap
      const formDataObj = Object.fromEntries(formData);
      const newStory = {
        id: `story-${Date.now()}`,
        name: 'Pengguna',
        description: formDataObj.description,
        createdAt: new Date().toISOString(),
        lat: formDataObj.lat ? parseFloat(formDataObj.lat) : null,
        lon: formDataObj.lon ? parseFloat(formDataObj.lon) : null,
        photoBlob: formDataObj.photo, // Simpan file foto sebagai Blob
      };

      await storyDB.saveStories([newStory]);
      return { story: newStory };
    } catch (error) {
      const formDataObj = Object.fromEntries(formData);
      const offlineStory = {
        id: `offline-${Date.now()}`,
        name: 'Pengguna Offline',
        description: formDataObj.description,
        createdAt: new Date().toISOString(),
        lat: formDataObj.lat ? parseFloat(formDataObj.lat) : null,
        lon: formDataObj.lon ? parseFloat(formDataObj.lon) : null,
        photoBlob: formDataObj.photo,
      };
      await storyDB.saveStories([offlineStory]);
      return { story: offlineStory };
    }
  }
}

export default AddStoryModel;