import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/actions/userActions'; // Import the setUser action
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch hook
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

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
  
    try {
      // Fetch the user by email and password
      const userResponse = await axios.get('http://localhost:8080/api/user/findByEmailAndPassword', {
        params: {
          email: formData.email,
          password: formData.password
        }
      });
      const foundUser = userResponse.data;
  
      if (!foundUser) {
        setError('Invalid email or password.');
        return;
      }
  
      // Use foundUser data in the login request
      const loginResponse = await axios.post('http://localhost:8080/api/user/login', foundUser);
  
      // Check if login was successful based on the response from the backend
      if (loginResponse.status === 200) {
        console.log('Login successful:', loginResponse.data);
        setError('');
        dispatch(setUser(foundUser)); // Dispatch the setUser action with the foundUser data
        navigate('/home');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('There was an error logging in:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="centered-container">
      <div className="left-half"></div>
      <div className="right-half">
        <Container className="mt-6">
          <h2 className="title">Login</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="w-100">
            <Form.Group controlId="formEmail" className="mb-3 form-group">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3 form-group">
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

            {error && <div className="error-message">{error}</div>}

            <div className="buttons">
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Link to = "/signUpPage" style={{textDecoration: 'none', color: 'white', fontSize: 'large'}}>Sign Up</Link>
            </div>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default LoginPage;
