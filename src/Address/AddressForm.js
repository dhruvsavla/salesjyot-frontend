import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddressForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [defaultTaxList, setDefaultTaxList] = useState([]);
  const [defaultTransportList, setDefaultTransportList] = useState([]);
  const [defaultTax, setDefaultTax] = useState("");
  const [defaultTransport, setDefaultTransport] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const user = useSelector((state) => state.user.user); // Get user from Redux

  const initialFormData = {
    addressName: '',
    primary: false,
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    area: '',
    landline: '',
    fax: '',
    email: '',
    defaultTax: {},
    vatNo: '',
    cstNo: '',
    tinNo: '',
    lbtNo: '',
    defaultTransport: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setDefaultTax(initialData.defaultTax.taxName);
      setDefaultTransport(initialData.defaultTransport);
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [initialData]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/tax")
      .then(response => {
        setDefaultTaxList(response.data);
      })
      .catch(error => {
        console.log("Error fetching taxes: " + error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/addresses")
      .then(response => {
        setDefaultTransportList(response.data.map(address => address.defaultTransport));
      })
      .catch(error => {
        console.log("Error fetching addresses: " + error);
      });
  }, []);


  const handleDefaultTaxChange = (e) => {
    const selectedDefaultTaxName = e.target.value;
    setDefaultTax(selectedDefaultTaxName);
    const selectedDefaultTax = defaultTaxList.find(tax => tax.taxName === selectedDefaultTaxName);
    setFormData({ ...formData, defaultTax: selectedDefaultTax });
  };

  const handleDefaultTransportChange = (e) => {
    const selectedDefaultTransport = e.target.value;
    setDefaultTransport(selectedDefaultTransport);
    setFormData({ ...formData, defaultTransport: selectedDefaultTransport });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({
      ...formData,
      [name]: checked
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

    // Filter out empty parentAccount field
    const formDataWithMeta = {
      ...formData,
      createdBy: user,
      createdDate: currentDate,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/addresses', formDataWithMeta);
      console.log('Post successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
      setDefaultTax("");
    } catch (error) {
      console.error('There was an error posting the data!', error);
    }
  };

  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/addresses/${formData.addressId}`, formData);
      console.log('Put successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
      setIsEditMode(false);
    setDefaultTax("");
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
            <FloatingLabel controlId="floatingInputGrid" label="Address Name">
              <Form.Control
                type="text"
                placeholder="Address Name"
                name="addressName"
                value={formData.addressName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide an address name.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Line 1">
              <Form.Control
                type="text"
                placeholder="Line 1"
                name="line1"
                value={formData.line1}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Line 2">
              <Form.Control
                type="text"
                placeholder="Line 2"
                name="line2"
                value={formData.line2}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="City">
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="State">
              <Form.Control
                type="text"
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Country">
              <Form.Control
                type="text"
                placeholder="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Pincode">
              <Form.Control
                type="text"
                placeholder="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Area">
              <Form.Control
                type="text"
                placeholder="Area"
                name="area"
                value={formData.area}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
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
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email address.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Default Tax">
              <Form.Select
                aria-label="Default Tax"
                onChange={handleDefaultTaxChange}
                value={defaultTax}
              >
                <option value="">Select Default Tax</option>
                {defaultTaxList.map(tax => (
                  <option key={tax.taxId} value={tax.taxName}>
                    {tax.taxName}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
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
        </Row>
        <Row className="mb-3">
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
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Default Transport">
              <Form.Select
                aria-label="Default Transport"
                onChange={handleDefaultTransportChange}
                value={defaultTransport}
              >
                <option value="">Select Default Transport</option>
                {defaultTransportList.map((transport, index) => (
                  <option key={index} value={transport}>
                    {transport}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <Form.Check
              type="checkbox"
              id="primary-checkbox"
              label="Primary"
              name="primary"
              checked={formData.primary}
              onChange={handleCheckboxChange}
            />
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          {isEditMode ? "Update Address" : "Submit Address"}
        </Button>
      </Form>
    </div>
  );
};

export default AddressForm;
