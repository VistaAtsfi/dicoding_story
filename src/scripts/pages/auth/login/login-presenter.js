class LoginPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async afterRender() {
    this.view.initElements();
    this.view.bindFormSubmit(this.handleLogin.bind(this));
  }

  async handleLogin(email, password) {
    try {
      const data = await this.model.login(email, password);
      if (!data.error) {
        this.view.showNotification('Login berhasil!', 'success');
        this.view.navigateToHome();
      } else {
        this.view.showNotification(`Login gagal: ${data.message}`, 'error');
      }
    } catch (error) {
      this.view.showNotification(`Error: ${error.message}`, 'error');
    }
  }
}

export default LoginPresenter;