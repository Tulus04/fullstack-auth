import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Table, Alert, Card } from 'react-bootstrap';
import postService from '../services/postService';
import authservices from '../services/authServices';
import { AuthContext } from '../context/AuthContext';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', category: 'General', tags: '', status: 'draft', author: '' });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchPosts();
        fetchUsers();
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

    const fetchUsers = async () => {
        try {
            const usersList = await authservices.getAllUsers();
            setUsers(usersList);
        } catch (err) {
            console.error('Gagal mengambil daftar users:', err);
        }
    };

    const handleShowForm = (post = null) => {
        if (post) {
            setEditingId(post.id);
            setFormData({ 
                title: post.title, 
                content: post.content,
                category: post.category,
                tags: post.tags,
                status: post.status,
                author: post.author
            });
        } else {
            setEditingId(null);
            setFormData({ title: '', content: '', category: 'General', tags: '', status: 'draft', author: user?.username || '' });
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ title: '', content: '', category: 'General', tags: '', status: 'draft', author: user?.username || '' });
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
                await postService.updatePost(editingId, formData);
                setSuccess('Post berhasil diperbarui');
            } else {
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
                            <Form.Group className="mb-3">
                                <Form.Label>Kategori</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="General">General</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Tutorial">Tutorial</option>
                                    <option value="News">News</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tags</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="tags"
                                    placeholder="Masukkan tags (pisahkan dengan koma)"
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <div>
                                    <Form.Check
                                        type="radio"
                                        label="Draft"
                                        name="status"
                                        value="draft"
                                        checked={formData.status === 'draft'}
                                        onChange={handleChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Published"
                                        name="status"
                                        value="published"
                                        checked={formData.status === 'published'}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Penulis</Form.Label>
                                <Form.Select
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Pilih Penulis</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.username}>
                                            {u.username}
                                        </option>
                                    ))}
                                </Form.Select>
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

            {!showForm && (
                <Button variant="success" size="lg" className="mb-4 w-100" onClick={() => handleShowForm()}>
                    ➕ Buat Post Baru
                </Button>
            )}

            <h5 className="mb-3">📝 Daftar Posts ({posts.length})</h5>
            {loading && posts.length === 0 ? (
                <p>Loading...</p>
            ) : posts.length === 0 ? (
                <Alert variant="info">Tidak ada posts. Silakan buat post baru.</Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="shadow-sm" size="sm">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th style={{ width: '4%' }}>No</th>
                                <th style={{ width: '18%' }}>Judul</th>
                                <th style={{ width: '18%' }}>Isi</th>
                                <th style={{ width: '12%' }}>Kategori</th>
                                <th style={{ width: '12%' }}>Tags</th>
                                <th style={{ width: '10%' }}>Status</th>
                                <th style={{ width: '12%' }}>Penulis</th>
                                <th style={{ width: '14%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr key={post.id}>
                                    <td>{index + 1}</td>
                                    <td><strong>{post.title}</strong></td>
                                    <td>{post.content.substring(0, 30)}...</td>
                                    <td><span className="badge bg-info">{post.category}</span></td>
                                    <td>{post.tags || '-'}</td>
                                    <td><span className={`badge ${post.status === 'published' ? 'bg-success' : 'bg-warning text-dark'}`}>{post.status}</span></td>
                                    <td>{post.author}</td>
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
