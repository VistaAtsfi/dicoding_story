import AddStoryView from './add-story-view.js';
import AddStoryPresenter from './add-story-presenter.js';
import AddStoryModel from './add-story-model.js';

class AddStoryPage {
  constructor() {
    this.view = new AddStoryView();
    this.model = new AddStoryModel();
    this.presenter = new AddStoryPresenter(this.view, this.model);
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    await this.presenter.afterRender();
  }
}

export default AddStoryPage;