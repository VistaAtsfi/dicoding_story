class RegisterPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

    async init() {
        this.view.initElements();
        this.view.bindRegisterHandler(this.handleRegister.bind(this));
    }

    async handleRegister(name, email, password) {
        try {
            const data = await this.model.register(name, email, password);
            if (!data.error) {
                this.view.showNotification('Registrasi berhasil! Silakan login.', 'success');
                this.view.navigateToLogin();
            } else {
                this.view.showNotification(`Registrasi gagal: ${data.message}`, 'error');
            }
        } catch (error) {
            this.view.showNotification(`Error: ${error.message}`, 'error');
        }
    }
}

export default RegisterPresenter;