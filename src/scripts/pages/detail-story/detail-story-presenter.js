import { showFormattedDate } from '../../utils/index';

class DetailStoryPresenter {
  constructor(model, view, storyId) {
    this.model = model;
    this.view = view;
    this.storyId = storyId;
  }

  async loadStoryDetail() {
    try {
      const token = this.model.getToken();
      if (!token) {
        this.view.renderError('Silakan login terlebih dahulu');
        this.view.navigateToLogin();
        return;
      }

      const story = await this.model.getStoryDetail(this.storyId, token);
      if (story) {
        const formattedStory = {
          photoUrl: story.photoUrl || '/images/placeholder.png',
          name: story.name,
          description: story.description,
          formattedDate: showFormattedDate(story.createdAt),
          lat: story.lat,
          lon: story.lon,
        };
        this.view.renderStoryDetail(formattedStory);
        if (story.lat && story.lon) {
          this.view.initMap(story.lat, story.lon, story.name, story.description);
        }
      } else {
        this.view.renderError('Cerita tidak ditemukan');
      }
    } catch (error) {
      this.view.renderError(`Error: ${error.message}`);
    }
  }
}

export default DetailStoryPresenter;