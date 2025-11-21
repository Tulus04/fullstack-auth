import React, { useContext } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return(
        <BSNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <BSNavbar.Brand as={Link} to="/" className="fw-bold fs-5">React Auth</BSNavbar.Brand>
                <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BSNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-3 align-items-center">
                        {user? (
                            <>
                                <Nav.Link as={Link} to="/dashboard" className="fw-500">
                                    Dashboard
                                </Nav.Link>
                                <Nav.Link as={Link} to="/items" className="fw-500">
                                    Items
                                </Nav.Link>
                                <Nav.Link as={Link} to="/posts" className="fw-500">
                                    Posts
                                </Nav.Link>
                                <span className="text-light border-start ps-3">
                                    Halo, <strong>{user.username}</strong>
                                </span>
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className="fw-500"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
};

export default Navbar;