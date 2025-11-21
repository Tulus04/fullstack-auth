import React, {useState, useContext} from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal login');      
        }
    };

    return (
        <Container className="mt-5">
            <div className="justify-content-center row">
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required/>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required/>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">Login</Button>
                        </Form>
                        <div className="text-center mt-3">
                            Tidak punya akun? <Link to="/register">Register disini</Link>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default Login;