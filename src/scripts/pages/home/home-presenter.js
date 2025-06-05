import { showFormattedDate } from '../../utils/index';
import storyDB from '../../utils/story-db';

class HomePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.handleFetchStories = this.handleFetchStories.bind(this);
    this.handleDeleteStory = this.handleDeleteStory.bind(this);
    this.loadStories = this.loadStories.bind(this); 
    this.loadStories(); 
    this.handleFetchStories();
  }

  async afterRender() {
    this.view.initElements();
    const token = this.model.getToken();

    if (!token) {
      this.view.updateStories('<p>Silakan login untuk melihat cerita.</p>');
      this.view.updateAddStoryLink('');
      this.view.navigateToLogin();
      return;
    }

    this.view.updateAddStoryLink('<a href="#/add-story" class="btn btn-primary">Tambah Story</a>');
    this.view.bindFetchButton(this.handleFetchStories.bind(this));
    this.view.bindDeleteButtons(this.handleDeleteStory); // Ensure binding is correct
    await this.loadStories();
  }

  async loadStories() {
    try {
      const stories = await storyDB.getStories();
      console.log('Retrieved stories from IndexedDB:', stories);
      if (stories.length > 0) {
        const storiesHTML = stories.map(story => `
          <article class="story-card" data-id="${story.id}">
            <img src="${story.photoUrl || '/images/placeholder.png'}" alt="Foto oleh ${story.name}" class="story-image" loading="lazy" onerror="this.src='/images/placeholder.png';">
            <div class="story-content">
              <h2 class="story-title">${story.name}</h2>
              <p class="story-desc">${story.description}</p>
              <p class="story-date">${showFormattedDate(story.createdAt)}</p>
              <div class="story-actions">
                <a href="#/story-detail?id=${story.id}" class="btn btn-secondary">Lihat Detail</a>
                <button class="btn btn-danger delete-btn" data-id="${story.id}">Hapus</button>
              </div>
            </div>
          </article>
        `).join('');
        this.view.updateStories(storiesHTML);
        // Rebind delete buttons after updating stories
        this.view.bindDeleteButtons(this.handleDeleteStory);
      } else {
        this.view.updateStories('<p>Belum ada cerita. Klik "Ambil Data dari API" untuk memuat cerita.</p>');
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      this.view.updateStories(`<p>Error memuat cerita: ${error.message}</p>`);
    }
  }

  async handleFetchStories() {
    const token = this.model.getToken();
    console.log('Token:', token);
    try {
      const data = await this.model.getStories(token);
      console.log('API response:', data);
      if (data.message === 'Sesi telah kadaluarsa. Silakan login ulang.') {
        this.view.showNotification(data.message, 'error');
        this.view.navigateToLogin();
        return;
      }
      if (!data.error && data.listStory?.length > 0) {
        await storyDB.saveStories(data.listStory);
        console.log('Stories saved to IndexedDB');
        await this.loadStories();
        this.view.showNotification('Data berhasil diambil dan disimpan offline', 'success');
      } else {
        this.view.showNotification('Tidak ada cerita baru dari API', 'info');
      }
    } catch (error) {
      console.error('Fetch stories error:', error);
      this.view.showNotification(`Gagal mengambil data dari API: ${error.message}`, 'error');
    }
  }

  async handleDeleteStory(id) {
    console.log('Attempting to delete story with ID:', id); // Debug log
    if (!id) {
      console.error('No ID provided for deletion');
      this.view.showNotification('ID cerita tidak valid', 'error');
      return;
    }
    try {
      await this.model.deleteStory(id);
      console.log('Story deleted from server:', id);
      await storyDB.deleteStory(id);
      console.log('Story deleted from IndexedDB:', id);
      this.view.removeStoryCard(id);
      this.view.showNotification('Cerita berhasil dihapus dari penyimpanan offline', 'success');
    } catch (error) {
      console.error('Error deleting story:', error);
      this.view.showNotification(`Gagal menghapus cerita: ${error.message}`, 'error');
    }
  }
}

export default HomePresenter;