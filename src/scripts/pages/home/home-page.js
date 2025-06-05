import HomeView from './home-view.js';
import HomePresenter from './home-presenter.js';
import HomeModel from './home-model.js';

class HomePage {
  constructor() {
    this.view = new HomeView();
    this.model = new HomeModel();
    this.presenter = new HomePresenter(this.view, this.model);
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    await this.presenter.afterRender();
  }
}

export default HomePage;