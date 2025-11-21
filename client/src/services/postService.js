import api from './api';

const postService = {
    createPost: async (postData) => {
        try {
            const response = await api.post('/posts', postData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal membuat post' };
        }
    },

    getAllPosts: async () => {
        try {
            const response = await api.get('/posts');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil posts' };
        }
    },

    getPostById: async (id) => {
        try {
            const response = await api.get(`/posts/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil post' };
        }
    },

    updatePost: async (id, postData) => {
        try {
            const response = await api.put(`/posts/${id}`, postData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal memperbarui post' };
        }
    },

    deletePost: async (id) => {
        try {
            const response = await api.delete(`/posts/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal menghapus post' };
        }
    }
};

export default postService;
