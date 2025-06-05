import AuthModel from '../auth-model.js';
import AuthPresenter from '../auth-presenter.js';

class RegisterPage {
  constructor() {
    this.model = new AuthModel();
    this.view = {
      render: () => `
        <section class="container">
          <h1 class="page-title">Register</h1>
          <form id="register-form" class="form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" required aria-required="true" placeholder="Masukkan nama">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required aria-required="true" placeholder="Masukkan email">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required minlength="8" aria-required="true" placeholder="Masukkan password">
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
          </form>
          <p>Sudah punya akun? <a href="#/login">Login</a></p>
        </section>
      `,
      initElements: function () {
        this.form = document.getElementById('register-form');
      },
      bindFormSubmit: function (handler) {
        this.form.addEventListener('submit', e => {
          e.preventDefault();
          const name = this.form.name.value.trim();
          const email = this.form.email.value.trim();
          const password = this.form.password.value.trim();
          handler(name, email, password);
        });
      },
      showNotification: function (message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      },
      navigateToLogin: function () {
        setTimeout(() => (window.location.hash = '#/login'), 1000);
      }
    };
    this.presenter = new AuthPresenter(this.view, this.model);
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.view.initElements();
    this.view.bindFormSubmit(this.presenter.handleRegister.bind(this.presenter));
  }
}

export default RegisterPage;