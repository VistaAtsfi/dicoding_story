import AuthModel from '../auth-model.js';
import AuthPresenter from '../auth-presenter.js';

class LoginPage {
  constructor() {
    this.model = new AuthModel();
    this.view = {
      render: () => `
        <section class="container">
          <h1 class="page-title">Login</h1>
          <form id="login-form" class="form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required aria-required="true" placeholder="Masukkan email">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required aria-required="true" placeholder="Masukkan password">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
          <p>Belum punya akun? <a href="#/register">Register</a></p>
        </section>
      `,
      initElements: function () {
        this.form = document.getElementById('login-form');
      },
      bindFormSubmit: function (handler) {
        this.form.addEventListener('submit', e => {
          e.preventDefault();
          const email = this.form.email.value.trim();
          const password = this.form.password.value.trim();
          handler(email, password);
        });
      },
      showNotification: function (message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      },
      navigateToHome: function () {
        setTimeout(() => (window.location.hash = '#/'), 1000);
      }
    };
    this.presenter = new AuthPresenter(this.view, this.model);
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.view.initElements();
    this.view.bindFormSubmit(this.presenter.handleLogin.bind(this.presenter));
  }
}

export default LoginPage;