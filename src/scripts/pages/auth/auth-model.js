import CONFIG from '../../config';

class AuthModel {
    async login({ email, password }) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login gagal');
            localStorage.setItem('token', data.loginResult.token);
            return data.loginResult;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async register({ name, email, password }) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registrasi gagal');
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    logout() {
        localStorage.removeItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }
}

export default AuthModel;