import React, { useContext } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return(
        <Container className="mt-5">
            <h1 className="mb-4">Dashboard</h1>
            <Card>
                <Card.Body>
                    <h3>Selamat Datang, {user?.username}!</h3>
                    <p><strong>Email:</strong> {user?.email}</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Dashboard;