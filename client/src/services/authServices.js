import api from './api';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const login = async (Credentials) => {
    const response = await api.post('/auth/login', Credentials);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const getAllUsers = async () => {
    try {
        const response = await api.get('/auth/users');
        return response.data.data;
    } catch (error) {
        throw error.response?.data || { message: 'Gagal mengambil daftar users' };
    }
};

const authservices = {
    register,
    login,
    logout,
    getCurrentUser,
    getAllUsers,
};

export default authservices;