import CONFIG from '../config';

const api = {
  async getStories(token, limit = 5) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories?page=1&size=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },

  async getStoryDetail(id, token) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },

  async addStory(formData, token) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return await response.json();
  },

  async deleteStory(id, token) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },

  async subscribePush(subscription, token) {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    return await response.json();
  },

  async unsubscribePush(endpoint, token) {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    });
    return await response.json();
  }
};

export default api;