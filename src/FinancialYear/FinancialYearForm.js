import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import '../Customer/CustomerForm.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Import DatePicker
import { useSelector } from 'react-redux';

const FinancialYearForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const user = useSelector((state) => state.user.user);

  const initialFormData = {
    financialYear: '',
    startDate: '',
    endDate: '',
    isDefault: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setStartDate(new Date(initialData.startDate)); // Convert to Date object
      setEndDate(new Date(initialData.endDate)); // Convert to Date object
      setIsEditMode(true);
    } else {
      setFormData(initialFormData);
      setStartDate(null);
      setEndDate(null);
      setIsEditMode(false);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const currentDate = new Date().toISOString();

    const formDataWithMeta = {
      ...formData,
      startDate: startDate ? startDate.toISOString() : '',
      endDate: endDate ? endDate.toISOString() : '',
      createdBy: user,
      createdDate: currentDate,
    };

    try {
      if (isEditMode) {
        const response = await axios.put(`http://localhost:8080/api/financial-years/${formData.financialYearId}`, formDataWithMeta);
        console.log('Put successful with:', JSON.stringify(response.data));
        setIsEditMode(false);
      } else {
        const response = await axios.post('http://localhost:8080/api/financial-years', formDataWithMeta);
        console.log('Post successful with:', JSON.stringify(response.data));
      }
      setFormData(initialFormData);
      setStartDate(null);
      setEndDate(null);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Financial Year">
              <Form.Control
                type="text"
                placeholder="Financial Year"
                name="financialYear"
                value={formData.financialYear}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a Financial Year.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="">
                
              <div className="custom-date-picker">
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Start Date"
                  className="form-control"
                  required
                />
              </div>
              <Form.Control.Feedback type="invalid">Please select a Start Date.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="">
              <div className="custom-date-picker">
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                  className="form-control"
                  required
                />
              </div>
              <Form.Control.Feedback type="invalid">Please select an End Date.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Closed"
              name="closed"
              checked={formData.closed}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <div className="submitButton">
          <Button type="submit">
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FinancialYearForm;
