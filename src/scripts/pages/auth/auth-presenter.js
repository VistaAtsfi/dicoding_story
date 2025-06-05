class AuthPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

    async handleLogin(email, password) {
        try {
            await this.model.login({ email, password });
            this.view.showNotification('Login berhasil', 'success');
            this.view.navigateToHome();
        } catch (error) {
            this.view.showNotification(`Login gagal: ${error.message}`, 'error');
        }
    }

    async handleRegister(name, email, password) {
        try {
            await this.model.register({ name, email, password });
            this.view.showNotification('Registrasi berhasil, silakan login', 'success');
            this.view.navigateToLogin();
        } catch (error) {
            this.view.showNotification(`Registrasi gagal: ${error.message}`, 'error');
        }
    }
}

export default AuthPresenter;