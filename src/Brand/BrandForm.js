import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BrandForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialFormData = {
    brandName: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const user = useSelector((state) => state.user.user); // Get user from Redux

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    const currentDate = new Date().toISOString();

    // Filter out empty parentAccount field
    const formDataWithMeta = {
      ...formData,
      createdBy: user,
      createdDate: currentDate,
    };
    try {
      const response = await axios.post('http://localhost:8080/api/brands', formDataWithMeta);
      console.log('Post successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
    } catch (error) {
      console.error('There was an error posting the data!', error);
    }
  };

  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/brands/${formData.brandId}`, formData);
      console.log('Put successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
      setIsEditMode(false);

      // Invoke the callback to update the parent component's state
      if (onUpdate) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error('There was an error updating the data!', error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Brand Name">
              <Form.Control
                type="text"
                placeholder="Brand Name"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a brand name.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <div className="submitButton">
          {isEditMode ? (
            <Button type="button" onClick={handleRowSubmit}>
              Update
            </Button>
          ) : (
            <Button type="submit">
              Submit
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default BrandForm;
