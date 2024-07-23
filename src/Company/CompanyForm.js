import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import '../Customer/CustomerForm.css';
import { useSelector } from 'react-redux';

const CompanyForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialFormData = {
    companyName: '',
    companyDescription: '',
    address: '',
    landline: '',
    fax: '',
    email: '',
    contactPersons: '',
    mobileNumber: '',
    vatNo: '',
    cstNo: '',
    tinNo: '',
    lbtNo: '',
    exciseNo: '',
    exciseChapHeading: '',
    exciseRange: '',
    exciseDivision: '',
    exciseCommiissionerate: '',
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
    const currentDate = new Date().toISOString();

    // Filter out empty parentAccount field
    const formDataWithMeta = {
      ...formData,
      createdBy: user,
      createdDate: currentDate,
    };
    try {
      const response = await axios.post('http://localhost:8080/api/companies', formDataWithMeta);
      console.log('post successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
    } catch (error) {
      console.error('There was an error posting the data!', error);
    }
  };

  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/companies/${formData.companyId}`, formData);
      console.log('put successful with:', JSON.stringify(response.data));
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
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Company Name">
              <Form.Control
                type="text"
                placeholder="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a company name.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Company Description">
              <Form.Control
                type="text"
                placeholder="Company Description"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a company description.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Address">
              <Form.Control
                type="text"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Landline">
              <Form.Control
                type="text"
                placeholder="Landline"
                name="landline"
                value={formData.landline}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Fax">
              <Form.Control
                type="text"
                placeholder="Fax"
                name="fax"
                value={formData.fax}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Email">
              <Form.Control
                type="text"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Contact Persons">
              <Form.Control
                type="text"
                placeholder="Contact Persons"
                name="contactPersons"
                value={formData.contactPersons}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Mobile Number">
              <Form.Control
                type="text"
                placeholder="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="VAT No">
              <Form.Control
                type="text"
                placeholder="VAT No"
                name="vatNo"
                value={formData.vatNo}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="CST No">
              <Form.Control
                type="text"
                placeholder="CST No"
                name="cstNo"
                value={formData.cstNo}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="TIN No">
              <Form.Control
                type="text"
                placeholder="TIN No"
                name="tinNo"
                value={formData.tinNo}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="LBT No">
              <Form.Control
                type="text"
                placeholder="LBT No"
                name="lbtNo"
                value={formData.lbtNo}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Excise No">
              <Form.Control
                type="text"
                placeholder="Excise No"
                name="exciseNo"
                value={formData.exciseNo}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Excise Chapter Heading">
              <Form.Control
                type="text"
                placeholder="Excise Chapter Heading"
                name="exciseChapHeading"
                value={formData.exciseChapHeading}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Excise Range">
              <Form.Control
                type="text"
                placeholder="Excise Range"
                name="exciseRange"
                value={formData.exciseRange}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Excise Division">
              <Form.Control
                type="text"
                placeholder="Excise Division"
                name="exciseDivision"
                value={formData.exciseDivision}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={{ span: 3, offset: -1 }}>
            <FloatingLabel controlId="floatingInputGrid" label="Excise Commissionerate">
              <Form.Control
                type="text"
                placeholder="Excise Commissionerate"
                name="exciseCommiissionerate"
                value={formData.exciseCommiissionerate}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>

        <div className = "submitButton">
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

export default CompanyForm;
