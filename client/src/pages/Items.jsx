import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import itemService from '../services/itemService';
import { AuthContext } from '../context/AuthContext';

const Items = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', stock: '' });
    const { user } = useContext(AuthContext);

    // Fetch items on mount
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

    const handleShowModal = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setFormData({ name: item.name, stock: item.stock });
        } else {
            setEditingId(null);
            setFormData({ name: '', stock: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
                // Update item
                await itemService.updateItem(editingId, formData);
                setSuccess('Item berhasil diperbarui');
            } else {
                // Create item
                await itemService.createItem(formData);
                setSuccess('Item berhasil ditambahkan');
            }
            handleCloseModal();
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

            <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
                Tambah Item
            </Button>

            {loading && items.length === 0 ? (
                <p>Loading...</p>
            ) : items.length === 0 ? (
                <Alert variant="info">Tidak ada items. Silakan tambah item baru.</Alert>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Item</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.stock}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowModal(item)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Hapus
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Edit Item' : 'Tambah Item'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Item</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
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
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Items;
