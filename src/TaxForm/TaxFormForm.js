import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TaxFormForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hsns, setHsns] = useState([]);
  const [taxMasters, setTaxMasters] = useState([]);

  const [hsnSearch, setHsnSearch] = useState("");
  const [taxMasterSearch, setTaxMasterSearch] = useState("");

  const initialFormData = {
    taxFormName: '',
    fromDate: '',
    toDate: '',
    minSales: '',
    maxSales: '',
    taxPct: '',
    taxMasters: [],
    hsns: [],
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

  useEffect(() => {
    const fetchHsns = async () => {
      const response = await axios.get('http://localhost:8080/api/hsn');
      setHsns(response.data);
    };

    const fetchTaxMasters = async () => {
      const response = await axios.get('http://localhost:8080/api/tax');
      setTaxMasters(response.data);
    };

    fetchHsns();
    fetchTaxMasters();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } 
    const currentDate = new Date().toISOString();

    // Filter out empty parentAccount field
    const formDataWithMeta = {
      ...formData,
      createdBy: user,
      createdDate: currentDate,
    };
      try {
        const response = await axios.post('http://localhost:8080/api/taxForms', formDataWithMeta);
        console.log('Post successful with:', JSON.stringify(response.data));
        setFormData(initialFormData);
        setHsnSearch("");
        setTaxMasterSearch("");
      } catch (error) {
        console.error('There was an error posting the data!', error);
      }
    
    setValidated(true);
  };

  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/taxForms/${formData.taxFormId}`, formData);
      console.log('Put successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
      setIsEditMode(false);
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

  const handleSelectChange = (event) => {
    const { name, selectedOptions } = event.target;
    const values = Array.from(selectedOptions).map(option => ({ id: option.value }));
    setFormData({
      ...formData,
      [name]: values,
    });
  };

  const handleHsnChange = (e) => {
    setHsnSearch(e.target.value);
    const selectedHsns = hsns.filter(hsn => hsn.hsnCode.includes(e.target.value));
    setFormData({ ...formData, hsns: selectedHsns });
  };

  const handleTaxMasterChange = (e) => {
    setTaxMasterSearch(e.target.value);
    const selectedTaxMasters = taxMasters.filter(taxMaster => taxMaster.taxName.includes(e.target.value));
    setFormData({ ...formData, taxMasters: selectedTaxMasters });
  };

  const filteredHsns = hsns.filter(hsn => hsn.hsnCode.toLowerCase().includes(hsnSearch.toLowerCase()));
  const filteredTaxMasters = taxMasters.filter(taxMaster => taxMaster.taxName.toLowerCase().includes(taxMasterSearch.toLowerCase()));

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Tax Form Name">
              <Form.Control
                type="text"
                placeholder="Tax Form Name"
                name="taxFormName"
                value={formData.taxFormName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Tax Form Name.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="From Date">
              <Form.Control
                type="date"
                placeholder="From Date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                
              />
              <Form.Control.Feedback type="invalid">
                Please provide a From Date.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="To Date">
              <Form.Control
                type="date"
                placeholder="To Date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                
              />
              <Form.Control.Feedback type="invalid">
                Please provide a To Date.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Min Sales">
              <Form.Control
                type="number"
                placeholder="Min Sales"
                name="minSales"
                value={formData.minSales}
                onChange={handleChange}
                
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Min Sales value.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Max Sales">
              <Form.Control
                type="number"
                placeholder="Max Sales"
                name="maxSales"
                value={formData.maxSales}
                onChange={handleChange}
                
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Max Sales value.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Tax Percentage">
              <Form.Control
                type="number"
                placeholder="Tax Percentage"
                name="taxPct"
                value={formData.taxPct}
                onChange={handleChange}
                
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Tax Percentage.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="HSNs">
              <input
                className="form-control"
                list="hsn-options"
                onChange={handleHsnChange}
                placeholder="HSNs"
                value={hsnSearch}
              />
              <datalist id="hsn-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filteredHsns.slice(0, 5).map((hsn) => (
                  <option key={hsn.hsnId} value={hsn.hsnCode}>
                    {hsn.hsnCode} - {hsn.hsnDescription}
                  </option>
                ))}
              </datalist>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Tax Masters">
              <input
                className="form-control"
                list="taxMaster-options"
                onChange={handleTaxMasterChange}
                placeholder="Tax Masters"
                value={taxMasterSearch}
              />
              <datalist id="taxMaster-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filteredTaxMasters.slice(0, 5).map((taxMaster) => (
                  <option key={taxMaster.taxMasterId} value={taxMaster.taxName}>
                    {taxMaster.taxName} - {taxMaster.displayName}
                  </option>
                ))}
              </datalist>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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

export default TaxFormForm;
