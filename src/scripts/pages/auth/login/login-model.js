import CONFIG from '../../../config';

class LoginModel {
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email dan password wajib diisi');
      }

      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal login');
      }
      localStorage.setItem('token', data.loginResult.token);
      return data;
    } catch (error) {
      throw new Error(error.message || 'Terjadi kesalahan saat login');
    }
  }
}

export default LoginModel;