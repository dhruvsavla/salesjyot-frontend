import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './SignupPage.css';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [validated, setValidated] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // Include createdOn field in formData
    formData.createdOn = new Date().toISOString(); // Example of setting createdOn as current time

    try {
      const response = await axios.post('http://localhost:8080/api/user', formData);
      console.log('Signup successful:', response.data);
      // Redirect to login page upon successful signup
      navigate('/'); // Assuming '/login' is your login page route
    } catch (error) {
      console.error('There was an error signing up:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>Sign Up</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide your name.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide your phone number.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a password.</Form.Control.Feedback>
            </Form.Group>
            <div className='buttons'>
              <Button className='button' variant="primary" type="submit">
                Sign Up
              </Button>
              <Link to = "/">login</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
