class RegisterView {
  constructor() {
    this.form = null;
  }

  getTemplate() {
    return `
      <section class="container">
        <h1 class="page-title">Register</h1>
        <form id="register-form" class="form">
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required aria-required="true" autocomplete="name">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required aria-required="true" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8" aria-required="true" autocomplete="new-password">
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
      </section>
    `;
  }

  initElements() {
    this.form = document.querySelector('#register-form');
  }

  bindRegisterHandler(handler) {
    if (this.form) {
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { name, email, password } = this.form;
        handler(name.value, email.value, password.value);
      });
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.className += ' fade-out';
      notification.addEventListener('animationend', () => {
        notification.remove();
      });
    }, 3000);
  }

  navigateToLogin() {
    window.location.hash = '#/login';
    const app = document.querySelector('body').app;
    if (app) app.renderPage();
  }
}

export default RegisterView;