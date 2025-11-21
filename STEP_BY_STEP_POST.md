# Panduan Step-by-Step: Membuat Fitur POST (Artikel)

## 📋 Daftar Isi
1. [Persiapan & Planning](#persiapan)
2. [Backend - Database & Model](#backend)
3. [Backend - Controller & Routes](#backend-controller)
4. [Frontend - Service & Context](#frontend-service)
5. [Frontend - UI Component](#frontend-ui)
6. [Testing dengan Thunder Client](#testing)

---

## Persiapan & Planning

### Apa yang akan kita buat?
Fitur POST memungkinkan user untuk:
- ✅ Membuat artikel/post baru
- ✅ Membaca semua post mereka
- ✅ Mengedit post
- ✅ Menghapus post
- ✅ Menampilkan list post dalam tabel

### Database Schema yang akan dibuat:

```sql
CREATE TABLE Posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  UserId INT NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (UserId) REFERENCES Users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

### File yang akan dibuat:
```
Backend:
- server/models/post.js
- server/controllers/postController.js
- server/routes/postRoute.js
- server/migrations/XXXXX-create-post.js

Frontend:
- client/src/services/postService.js
- client/src/pages/Posts.jsx
```

---

## Backend - Database & Model

### STEP 1: Buat Migration untuk Posts Table

Jalankan command ini di terminal server:

```bash
cd server
npx sequelize-cli model:generate --name Post --attributes title:string,content:text,UserId:integer
```

Perintah ini akan otomatis membuat:
1. File model di `server/models/post.js`
2. File migration di `server/migrations/XXXXX-create-post.js`

### STEP 2: Edit File Migration

Buka file migration yang baru dibuat (lihat tanggal di nama file):
`server/migrations/XXXXX-create-post.js`

Edit isinya menjadi:

```javascript
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};
```

### STEP 3: Edit Model Post

Buka `server/models/post.js`:

```javascript
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
```

### STEP 4: Update Model User

Buka `server/models/user.js` dan edit bagian `associate`:

```javascript
static associate(models) {
  User.hasMany(models.Item, { foreignKey: 'UserId' });
  User.hasMany(models.Post, { foreignKey: 'UserId' });
}
```

### STEP 5: Jalankan Migration

Di terminal server, jalankan:

```bash
npx sequelize-cli db:migrate
```

✅ Tabel Posts sudah dibuat di database!

---

## Backend - Controller & Routes

### STEP 6: Buat Post Controller

Buat file baru: `server/controllers/postController.js`

```javascript
const { Post } = require('../models');

// Create Post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title dan content harus diisi' });
        }

        const post = await Post.create({
            title,
            content,
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

// Get All Posts for User
exports.getAllPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        const posts = await Post.findAll({
            where: { UserId: userId },
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

// Get Post by ID
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findOne({
            where: { id, UserId: userId }
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

// Update Post
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;

        const post = await Post.findOne({
            where: { id, UserId: userId }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post tidak ditemukan' });
        }

        if (title) post.title = title;
        if (content) post.content = content;

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

// Delete Post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findOne({
            where: { id, UserId: userId }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post tidak ditemukan' });
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
```

### STEP 7: Buat Post Routes

Buat file baru: `server/routes/postRoute.js`

```javascript
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");

// Semua route post memerlukan authentication
router.post("/", auth, postController.createPost);
router.get("/", auth, postController.getAllPosts);
router.get("/:id", auth, postController.getPostById);
router.put("/:id", auth, postController.updatePost);
router.delete("/:id", auth, postController.deletePost);

module.exports = router;
```

### STEP 8: Register Routes di Server

Buka `server/server.js` dan tambahkan:

```javascript
const postRoute = require("./routes/postRoute");

// Tambahkan di bagian routes
app.use("/posts", postRoute);
```

Sekarang bagian server.js akan terlihat seperti:

```javascript
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const authRoute = require("./routes/authRoute");
const itemRoute = require("./routes/itemRoute");
const postRoute = require("./routes/postRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/items", itemRoute);
app.use("/posts", postRoute);

// ... rest of code
```

---

## Frontend - Service & Context

### STEP 9: Buat Post Service

Buat file baru: `client/src/services/postService.js`

```javascript
import api from './api';

const postService = {
    // Create post
    createPost: async (postData) => {
        try {
            const response = await api.post('/posts', postData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal membuat post' };
        }
    },

    // Get all posts
    getAllPosts: async () => {
        try {
            const response = await api.get('/posts');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil posts' };
        }
    },

    // Get post by ID
    getPostById: async (id) => {
        try {
            const response = await api.get(`/posts/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil post' };
        }
    },

    // Update post
    updatePost: async (id, postData) => {
        try {
            const response = await api.put(`/posts/${id}`, postData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal memperbarui post' };
        }
    },

    // Delete post
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
```

---

## Frontend - UI Component

### STEP 10: Buat Posts Page

Buat file baru: `client/src/pages/Posts.jsx`

```javascript
import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Table, Alert, Card } from 'react-bootstrap';
import postService from '../services/postService';
import { AuthContext } from '../context/AuthContext';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const { user } = useContext(AuthContext);

    // Fetch posts on mount
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await postService.getAllPosts();
            setPosts(response.data);
            setError('');
        } catch (err) {
            setError(err.message || 'Gagal mengambil posts');
        } finally {
            setLoading(false);
        }
    };

    const handleShowForm = (post = null) => {
        if (post) {
            setEditingId(post.id);
            setFormData({ title: post.title, content: post.content });
        } else {
            setEditingId(null);
            setFormData({ title: '', content: '' });
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ title: '', content: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingId) {
                // Update post
                await postService.updatePost(editingId, formData);
                setSuccess('Post berhasil diperbarui');
            } else {
                // Create post
                await postService.createPost(formData);
                setSuccess('Post berhasil dibuat');
            }
            handleCloseForm();
            fetchPosts();
        } catch (err) {
            setError(err.message || 'Gagal menyimpan post');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus post ini?')) {
            try {
                setLoading(true);
                await postService.deletePost(id);
                setSuccess('Post berhasil dihapus');
                fetchPosts();
            } catch (err) {
                setError(err.message || 'Gagal menghapus post');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="mb-4">Manajemen Posts</h1>

            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

            {/* FORM SECTION - HIDDEN BY DEFAULT */}
            {showForm && (
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">{editingId ? 'Edit Post' : 'Buat Post Baru'}</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Judul Post</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Masukkan judul post"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Isi Post</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="content"
                                    rows={5}
                                    placeholder="Masukkan isi post"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <div className="d-flex gap-2">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Buat'}
                                </Button>
                                <Button variant="secondary" onClick={handleCloseForm}>
                                    Batal
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            )}

            {/* BUTTON BUAT POST - SHOW WHEN FORM IS HIDDEN */}
            {!showForm && (
                <Button variant="success" size="lg" className="mb-4 w-100" onClick={() => handleShowForm()}>
                    ➕ Buat Post Baru
                </Button>
            )}

            {/* TABLE SECTION */}
            <h5 className="mb-3">📝 Daftar Posts ({posts.length})</h5>
            {loading && posts.length === 0 ? (
                <p>Loading...</p>
            ) : posts.length === 0 ? (
                <Alert variant="info">Tidak ada posts. Silakan buat post baru.</Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="shadow-sm">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th style={{ width: '5%' }}>No</th>
                                <th style={{ width: '35%' }}>Judul</th>
                                <th style={{ width: '35%' }}>Isi</th>
                                <th style={{ width: '25%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr key={post.id}>
                                    <td>{index + 1}</td>
                                    <td><strong>{post.title}</strong></td>
                                    <td>{post.content.substring(0, 50)}...</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowForm(post)}
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            🗑️ Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default Posts;
```

### STEP 11: Update App.jsx

Buka `client/src/App.jsx` dan tambahkan:

```javascript
import Posts from "./pages/Posts";

// Di bagian Routes, tambahkan:
<Route path="/posts" element={
    <PrivateRoute>
        <Posts />
    </PrivateRoute>
} />
```

### STEP 12: Update Navbar

Buka `client/src/components/Navbar.jsx` dan tambahkan link ke Posts:

```javascript
<Nav.Link as={Link} to="/posts" className="fw-500">
    Posts
</Nav.Link>
```

Tambahkan sebelum tombol logout, setelah Items.

---

## Testing dengan Thunder Client

### STEP 13: Test Endpoints

**1. Login dulu:**
```
POST http://localhost:3000/auth/login
Body: {
  "email": "admin@example.com",
  "password": "password123"
}
```

**2. Copy token** dari response

**3. Set Authorization:** Bearer Token dengan token yang Anda copy

**4. CREATE Post:**
```
POST http://localhost:3000/posts
Authorization: Bearer <token>
Body:
{
  "title": "Post Pertama Saya",
  "content": "Ini adalah konten post pertama yang saya buat di aplikasi ini"
}
```

**5. GET All Posts:**
```
GET http://localhost:3000/posts
Authorization: Bearer <token>
```

**6. UPDATE Post:**
```
PUT http://localhost:3000/posts/1
Authorization: Bearer <token>
Body:
{
  "title": "Post Pertama - Updated",
  "content": "Konten yang sudah diupdate"
}
```

**7. DELETE Post:**
```
DELETE http://localhost:3000/posts/1
Authorization: Bearer <token>
```

---

## Checklist Penyelesaian

✅ Backend:
- [ ] Model Post dibuat
- [ ] Migration dijalankan
- [ ] Controller Post dibuat
- [ ] Routes Post dibuat
- [ ] Routes diregister di server.js

✅ Frontend:
- [ ] Service Post dibuat
- [ ] Component Posts.jsx dibuat
- [ ] Route /posts ditambahkan di App.jsx
- [ ] Link Posts ditambahkan di Navbar.jsx

✅ Testing:
- [ ] Bisa membuat post
- [ ] Bisa melihat semua posts
- [ ] Bisa edit post
- [ ] Bisa hapus post

---

## Kesimpulan

Sekarang aplikasi Anda memiliki:
1. **Users Management** - Register & Login
2. **Items Management** - CRUD Items
3. **Posts Management** - CRUD Posts (baru!)

Setiap fitur memiliki:
- Backend: Model, Controller, Routes
- Frontend: Service, Component, Navbar Link
- Database: Table dengan foreign key ke Users

Struktur semua fitur sama, jadi Anda bisa menambah fitur baru dengan pattern yang sama!
