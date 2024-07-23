import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';

const AddSizeRangeForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialFormData = {
    sizeRange: '',
    isPrimary: false,
  };

  const [formData, setFormData] = useState(initialFormData);

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
    try {
      const response = await axios.post('http://localhost:8080/api/add-sizeranges', formData);
      console.log('Post successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
    } catch (error) {
      console.error('There was an error posting the data!', error);
    }
  };

  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/add-sizeranges/${formData.addSizeRangeId}`, formData);
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
            <FloatingLabel controlId="floatingInputGrid" label="Size Range">
              <Form.Control
                type="text"
                placeholder="Size Range"
                name="sizeRange"
                value={formData.sizeRange}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Size Range.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
        <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Is Primary"
              name="isPrimary"
              checked={formData.isPrimary}
              onChange={handleChange}
            />
          </Form.Group>
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

export default AddSizeRangeForm;
