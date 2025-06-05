import AboutView from './about-view.js';
import AboutModel from './about-model.js';
import AboutPresenter from './about-presenter.js';

class AboutPage {
  constructor() {
    this.view = new AboutView();
    this.model = new AboutModel();
    this.presenter = new AboutPresenter(this.view, this.model);
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    await this.presenter.afterRender();
  }
}

export default AboutPage;