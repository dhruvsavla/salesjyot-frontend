import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ContactForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [customer, setCustomer] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [address, setAddress] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const initialFormData = {
    customer: {},
    name: '',
    isPrimary: false,
    designation: '',
    addresses: [],
    landline: '',
    mobile: '',
    fax: '',
    email: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const user = useSelector((state) => state.user.user); // Get user from Redux

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setCustomer(initialData.customer.customerName); // Update the companyName state
      setAddress(initialData.addresses[0]?.addressName || '');
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [initialData]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/customers")
      .then(response => {
        setCustomerList(response.data);
      })
      .catch(error => {
        console.log("Error fetching companies: " + error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/addresses")
      .then(response => {
        setAddressList(response.data);
      })
      .catch(error => {
        console.log("Error fetching addresses: " + error);
      });
  }, []);

  const handleCustomerChange = (e) => {
    const selectedCustomerName = e.target.value;
    setCustomer(selectedCustomerName);
    const selectedCustomer = customerList.find(company => company.customerName === selectedCustomerName);
    setFormData({ ...formData, customer: selectedCustomer });
  };

  const handleAddressChange = (e) => {
    const selectedAddressName = e.target.value;
    setAddress(selectedAddressName);
    const selectedAddress = addressList.find(address => address.addressName === selectedAddressName);
    setFormData({ ...formData, addresses: selectedAddress ? [selectedAddress] : [] });
  };

  const filteredCustomers = customerList.filter(company =>
    company.customerName.toLowerCase().includes(customer.toLowerCase())
  );

  const filteredAddresses = addressList.filter(a =>
    a.addressName.toLowerCase().includes(address.toLowerCase())
  );

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
      const response = await axios.post('http://localhost:8080/api/contacts', formDataWithMeta);
      console.log('Post successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
      setCustomer("");
    } catch (error) {
      console.error('There was an error posting the data!', error);
    }
  };

  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/contacts/${formData.id}`, formData);
      console.log('Put successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
      setCustomer("");
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
            <FloatingLabel controlId="floatingInputGrid" label="Customer">
              <input
                className="form-control"
                list="customer-options"
                onChange={handleCustomerChange}
                placeholder="Customer"
                value={customer} // Use the companyName state
              />
              <datalist id="customer-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filteredCustomers.slice(0, 5).map((company) => (
                  <option key={company.customerId} value={company.customerName}>
                    {company.customerName}
                  </option>
                ))}
              </datalist>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Contact Name">
              <Form.Control
                type="text"
                placeholder="Contact Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a contact name.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Designation">
              <Form.Control
                type="text"
                placeholder="Designation"
                name="designation"
                value={formData.designation}
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
            <FloatingLabel controlId="floatingInputGrid" label="Mobile">
              <Form.Control
                type="text"
                placeholder="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Address">
              <input
                className="form-control"
                list="address-options"
                onChange={handleAddressChange}
                placeholder="Address"
                value={address} // Use the address state
              />
              <datalist id="address-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filteredAddresses.slice(0, 5).map((address) => (
                  <option key={address.addressId} value={address.addressName}>
                    {address.addressName}
                  </option>
                ))}
              </datalist>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <Form.Check
              type="checkbox"
              label="Is Primary"
              name="isPrimary"
              checked={formData.isPrimary}
              onChange={handleCheckboxChange}
            />
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

export default ContactForm;
