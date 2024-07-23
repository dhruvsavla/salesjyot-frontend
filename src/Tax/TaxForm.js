import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TaxForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialFormData = {
    taxName: '',
    displayName: '',
    taxPercentage: '',
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
  const form = event.currentTarget;

  // Prevent default form submission
  event.preventDefault();

  // If you want to check specific fields or conditions, you can add your custom logic here
  // Example: Check if a specific field is empty or not
  // if (form.querySelector('#someField').value.trim() === '') {
  //   console.log('Some field is empty!');
  //   return;
  // }

  // You can also check other conditions based on your form requirements

  const currentDate = new Date().toISOString();

    // Filter out empty parentAccount field
    const formDataWithMeta = {
      ...formData,
      createdBy: user,
      createdDate: currentDate,
    };

  try {
    const response = await axios.post('http://localhost:8080/api/tax', formDataWithMeta);
    console.log('Post successful with:', JSON.stringify(response.data));
    setFormData(initialFormData);
  } catch (error) {
    console.error('There was an error posting the data!', error);
  }
};



  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/tax/${formData.taxId}`, formData);
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
            <FloatingLabel controlId="floatingInputGrid" label="Tax Name">
              <Form.Control
                type="text"
                placeholder="Tax Name"
                name="taxName"
                value={formData.taxName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Tax Name.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Display Name">
              <Form.Control
                type="text"
                placeholder="Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide an Display Name.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Tax Percentage">
              <Form.Control
                type="text"
                placeholder="Tax Percentage"
                name="taxPercentage"
                value={formData.taxPercentage}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide an Tax Percentage.
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

export default TaxForm;
