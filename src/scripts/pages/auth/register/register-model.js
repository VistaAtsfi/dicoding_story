import CONFIG from '../../../config';

// class RegisterModel {
//     async register(name, email, password) {
//         const response = await fetch(`${CONFIG.BASE_URL}/register`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, email, password }),
//         });
//         return await response.json();
//     }
// }

// export default RegisterModel;

class RegisterModel {
    async register(name, email, password) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registrasi gagal');
            }
            return data;
        } catch (error) {
            throw new Error(error.message || 'Terjadi kesalahan saat registrasi');
        }
    }
}

export default RegisterModel;