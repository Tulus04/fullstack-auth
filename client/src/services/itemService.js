import api from './api';

const itemService = {
    // Create item
    createItem: async (itemData) => {
        try {
            const response = await api.post('/items', itemData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal membuat item' };
        }
    },

    // Get all items
    getAllItems: async () => {
        try {
            const response = await api.get('/items');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil items' };
        }
    },

    // Get item by ID
    getItemById: async (id) => {
        try {
            const response = await api.get(`/items/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil item' };
        }
    },

    // Update item
    updateItem: async (id, itemData) => {
        try {
            const response = await api.put(`/items/${id}`, itemData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal memperbarui item' };
        }
    },

    // Delete item
    deleteItem: async (id) => {
        try {
            const response = await api.delete(`/items/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal menghapus item' };
        }
    }
};

export default itemService;
