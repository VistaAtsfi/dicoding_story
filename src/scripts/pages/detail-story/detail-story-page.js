import DetailStoryView from './detail-story-view.js';
import DetailStoryModel from './detail-story-model.js';
import DetailStoryPresenter from './detail-story-presenter.js';
import { parseActivePathname } from '../../routes/url-parser.js';

class DetailStoryPage {
  constructor() {
    this.view = new DetailStoryView();
    this.model = new DetailStoryModel();
    this.presenter = null;
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    const { id } = parseActivePathname();
    this.presenter = new DetailStoryPresenter(this.model, this.view, id);
    await this.view.afterRender();
    await this.presenter.loadStoryDetail();
  }
}

export default DetailStoryPage;