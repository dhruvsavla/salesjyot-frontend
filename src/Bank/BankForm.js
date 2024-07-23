import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BankForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [companyNamesList, setCompanyNamesList] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const initialFormData = {
    bankName: '',
    accountNo: '',
    company: { companyName: '' },
  };

  const [formData, setFormData] = useState(initialFormData);
  const user = useSelector((state) => state.user.user); // Get user from Redux

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setCompanyName(initialData.company.companyName); // Update the companyName state
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [initialData]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/companies")
      .then(response => {
        setCompanyNamesList(response.data);
      })
      .catch(error => {
        console.log("Error fetching companies: " + error);
      });
  }, []);

  const handleCompanyChange = (e) => {
    const selectedCompanyName = e.target.value;
    setCompanyName(selectedCompanyName);
    const selectedCompany = companyNamesList.find(company => company.companyName === selectedCompanyName);
    setFormData({ ...formData, company: selectedCompany });
  };

  const filteredCompanyNames = companyNamesList.filter(company =>
    company.companyName.toLowerCase().includes(companyName.toLowerCase())
  );

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
      const response = await axios.post('http://localhost:8080/api/banks', formDataWithMeta);
      console.log('Post successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
      setCompanyName("");
    } catch (error) {
      console.error('There was an error posting the data!', error);
    }
  };

  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/banks/${formData.bankId}`, formData);
      console.log('Put successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
      setCompanyName("");
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
            <FloatingLabel controlId="floatingInputGrid" label="Company Name">
              <input
                className="form-control"
                list="item-options"
                onChange={handleCompanyChange}
                placeholder="Company Name"
                value={companyName} // Use the companyName state
              />
              <datalist id="item-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filteredCompanyNames.slice(0, 5).map((company) => (
                  <option key={company.companyId} value={company.companyName}>
                    {company.companyName}
                  </option>
                ))}
              </datalist>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Bank Name">
              <Form.Control
                type="text"
                placeholder="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a bank name.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Account No">
              <Form.Control
                type="text"
                placeholder="Account No"
                name="accountNo"
                value={formData.accountNo}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide an account number.
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

export default BankForm;
