class LoginView {
  constructor() {
    this.form = null;
  }

  render() {
    return `
      <section class="container">
        <h1 class="page-title">Login</h1>
        <form id="login-form" class="form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required aria-required="true" autocomplete="email" placeholder="Masukkan email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required aria-required="true" autocomplete="current-password" placeholder="Masukkan password">
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p class="register-link">Belum punya akun? <a href="#/register">Register</a></p>
      </section>
    `;
  }

  initElements() {
    this.form = document.querySelector('#login-form');
  }

  bindFormSubmit(handler) {
    if (this.form) {
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = this.form.email.value.trim();
        const password = this.form.password.value.trim();
        await handler(email, password);
      });
    }
  }

  getFormData() {
    if (!this.form) return null;
    const email = this.form.email.value.trim();
    const password = this.form.password.value.trim();
    return { email, password };
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('fade-out');
      notification.addEventListener('animationend', () => {
        notification.remove();
      });
    }, 3000);
  }

  navigateToHome() {
    setTimeout(() => {
      window.location.hash = '#/';
      const app = document.querySelector('body').app;
      if (app) app.renderPage();
    }, 1000);
  }
}

export default LoginView;