const { Post } = require('../models');

exports.createPost = async (req, res) => {
    try {
        const { title, content, category, tags, status, author } = req.body;
        const userId = req.user.id;

        if (!title || !content || !category) {
            return res.status(400).json({ message: 'Title, content, dan category harus diisi' });
        }

        const post = await Post.create({
            title,
            content,
            category,
            tags: tags || '',
            status: status || 'draft',
            author: author || req.user.username,
            UserId: userId
        });

        return res.status(201).json({
            message: 'Post berhasil dibuat',
            data: post
        });
    } catch (err) {
        console.error('Error createPost:', err);
        return res.status(500).json({ message: 'Gagal membuat post', error: err.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: ['User'],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            message: 'Posts berhasil diambil',
            data: posts
        });
    } catch (err) {
        console.error('Error getAllPosts:', err);
        return res.status(500).json({ message: 'Gagal mengambil posts', error: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findOne({
            where: { id },
            include: ['User']
        });

        if (!post) {
            return res.status(404).json({ message: 'Post tidak ditemukan' });
        }

        return res.status(200).json({
            message: 'Post berhasil diambil',
            data: post
        });
    } catch (err) {
        console.error('Error getPostById:', err);
        return res.status(500).json({ message: 'Gagal mengambil post', error: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, tags, status, author } = req.body;
        const userId = req.user.id;

        const post = await Post.findOne({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post tidak ditemukan' });
        }

        if (post.UserId !== userId) {
            return res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengubah post ini' });
        }

        if (title) post.title = title;
        if (content) post.content = content;
        if (category) post.category = category;
        if (tags) post.tags = tags;
        if (status) post.status = status;
        if (author) post.author = author;

        await post.save();

        return res.status(200).json({
            message: 'Post berhasil diperbarui',
            data: post
        });
    } catch (err) {
        console.error('Error updatePost:', err);
        return res.status(500).json({ message: 'Gagal memperbarui post', error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findOne({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post tidak ditemukan' });
        }

        if (post.UserId !== userId) {
            return res.status(403).json({ message: 'Anda tidak memiliki akses untuk menghapus post ini' });
        }

        await post.destroy();

        return res.status(200).json({
            message: 'Post berhasil dihapus'
        });
    } catch (err) {
        console.error('Error deletePost:', err);
        return res.status(500).json({ message: 'Gagal menghapus post', error: err.message });
    }
};
