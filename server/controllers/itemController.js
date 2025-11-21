const { Item } = require('../models');

// Create Item
exports.createItem = async (req, res) => {
    try {
        const { name, stock } = req.body;
        const userId = req.user.id;

        if (!name || stock === undefined) {
            return res.status(400).json({ message: 'Name dan stock harus diisi' });
        }

        const item = await Item.create({
            name,
            stock,
            UserId: userId
        });

        return res.status(201).json({
            message: 'Item berhasil dibuat',
            data: item
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal membuat item' });
    }
};

// Get All Items for User
exports.getAllItems = async (req, res) => {
    try {
        const userId = req.user.id;

        const items = await Item.findAll({
            where: { UserId: userId }
        });

        return res.status(200).json({
            message: 'Items berhasil diambil',
            data: items
        });
    } catch (err) {
        console.error('Error getAllItems:', err);
        return res.status(500).json({ message: 'Gagal mengambil items', error: err.message });
    }
};

// Get Item by ID
exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const item = await Item.findOne({
            where: { id, UserId: userId }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }

        return res.status(200).json({
            message: 'Item berhasil diambil',
            data: item
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal mengambil item' });
    }
};

// Update Item
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, stock } = req.body;
        const userId = req.user.id;

        const item = await Item.findOne({
            where: { id, UserId: userId }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }

        if (name) item.name = name;
        if (stock !== undefined) item.stock = stock;

        await item.save();

        return res.status(200).json({
            message: 'Item berhasil diperbarui',
            data: item
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal memperbarui item' });
    }
};

// Delete Item
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const item = await Item.findOne({
            where: { id, UserId: userId }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }

        await item.destroy();

        return res.status(200).json({
            message: 'Item berhasil dihapus'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal menghapus item' });
    }
};
