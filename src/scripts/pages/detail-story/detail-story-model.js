import CONFIG from '../../config';
import storyDB from '../../utils/story-db';

class DetailStoryModel {
    getToken() {
        return localStorage.getItem('token');
    }

    async getStoryDetail(id, token) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Gagal memuat detail cerita');
            const data = await response.json();
            return data.story;
        } catch (error) {
            const cachedStory = await storyDB.getStories();
            return cachedStory.find(story => story.id === id) || null;
        }
    }
}

export default DetailStoryModel;