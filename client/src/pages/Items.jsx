import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Table, Alert, Card } from 'react-bootstrap';
import itemService from '../services/itemService';
import { AuthContext } from '../context/AuthContext';

const Items = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', stock: '' });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await itemService.getAllItems();
            setItems(response.data);
            setError('');
        } catch (err) {
            setError(err.message || 'Gagal mengambil items');
        } finally {
            setLoading(false);
        }
    };

    const handleShowForm = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setFormData({ name: item.name, stock: item.stock });
        } else {
            setEditingId(null);
            setFormData({ name: '', stock: '' });
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', stock: '' });
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
                await itemService.updateItem(editingId, formData);
                setSuccess('Item berhasil diperbarui');
            } else {
                await itemService.createItem(formData);
                setSuccess('Item berhasil ditambahkan');
            }
            handleCloseForm();
            fetchItems();
        } catch (err) {
            setError(err.message || 'Gagal menyimpan item');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
            try {
                setLoading(true);
                await itemService.deleteItem(id);
                setSuccess('Item berhasil dihapus');
                fetchItems();
            } catch (err) {
                setError(err.message || 'Gagal menghapus item');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="mb-4">Manajemen Items</h1>

            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

            {showForm && (
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">{editingId ? 'Edit Item' : 'Tambah Item Baru'}</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nama Item</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Masukkan nama item"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="stock"
                                    placeholder="Masukkan jumlah stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <div className="d-flex gap-2">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Tambah'}
                                </Button>
                                <Button variant="secondary" onClick={handleCloseForm}>
                                    Batal
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            )}

\            {!showForm && (
                <Button variant="success" size="lg" className="mb-4 w-100" onClick={() => handleShowForm()}>
                    ➕ Tambah Item Baru
                </Button>
            )}

\            <h5 className="mb-3">📋 Daftar Items ({items.length})</h5>
            {loading && items.length === 0 ? (
                <p>Loading...</p>
            ) : items.length === 0 ? (
                <Alert variant="info">Tidak ada items. Silakan tambah item baru.</Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="shadow-sm">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th style={{ width: '5%' }}>No</th>
                                <th style={{ width: '45%' }}>Nama Item</th>
                                <th style={{ width: '20%' }}>Stock</th>
                                <th style={{ width: '30%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <span className="badge bg-info">{item.stock}</span>
                                    </td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowForm(item)}
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(item.id)}
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

export default Items;
