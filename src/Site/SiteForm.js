import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Customer/CustomerForm.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import { useSelector } from 'react-redux';

const SiteForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [siteForTransactionNosList, setSiteForTransactionNosList] = useState([]);
  const [siteForStockKeepingList, setSiteForStockKeepingList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteForStockKeeping, setSiteForStockKeeping] = useState("");
  const [siteForTransactionNos, setSiteForTransactionNos] = useState("");
  const [createdBy, setCreatedBy] = useState(null); // State to hold user data
  const [formData, setFormData] = useState({
    siteName: '',
    siteCode: '',
    storesStock: false,
    hasTransactionNos: false,
    isPrimary: false,
    siteForStockKeeping: '',
    siteForTransactionNos: ''
  });

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setIsEditMode(true);
      setCreatedBy(initialData.createdBy || null); // Set createdBy user data if available
    } else {
      setFormData({
        siteName: '',
        siteCode: '',
        storesStock: false,
        hasTransactionNos: false,
        isPrimary: false,
        siteForStockKeeping: '',
        siteForTransactionNos: ''
      });
      setIsEditMode(false);
    }
  }, [initialData]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/sites")
      .then(response => {
        setSiteForStockKeepingList(response.data.map(site => site.siteName).filter(siteName => siteName));
        setSiteForTransactionNosList(response.data.map(site => site.siteName).filter(siteName => siteName));
      })
      .catch(error => console.error(error));
  }, []);

  const handleSiteForTransactionNosChange = (e) => {
    const selectedSiteForTransactionNos = e.target.value;
    setSiteForTransactionNos(selectedSiteForTransactionNos);
    setFormData({ ...formData, siteForTransactionNos: selectedSiteForTransactionNos });
  };

  const handleSiteForStockKeeping = (e) => {
    const selectedSiteForStockKeeping = e.target.value;
    setSiteForStockKeeping(selectedSiteForStockKeeping);
    setFormData({ ...formData, siteForStockKeeping: selectedSiteForStockKeeping });
  };

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
      createdBy: createdBy || user,
      createdDate: currentDate,
    };

    try {
      if (isEditMode) {
        const response = await axios.put(`http://localhost:8080/api/sites/${formData.siteId}`, formDataWithMeta);
        console.log('Put successful with:', response.data);
        setIsEditMode(false);
      } else {
        const response = await axios.post('http://localhost:8080/api/sites', formDataWithMeta);
        console.log('Post successful with:', response.data);
      }
      setFormData({
        siteName: '',
        siteCode: '',
        storesStock: false,
        hasTransactionNos: false,
        isPrimary: false,
        siteForStockKeeping: '',
        siteForTransactionNos: ''
      });
      setCreatedBy(null);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  const filteredSiteForStockKeeping = siteForStockKeepingList.filter(b => b.toLowerCase().includes(siteForStockKeeping.toLowerCase()));
  const filteredSiteForTransactionNosList = siteForTransactionNosList.filter(b => b.toLowerCase().includes(siteForTransactionNos.toLowerCase()));


  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Site Name">
              <Form.Control
                type="text"
                placeholder="Site Name"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">Please provide a site name.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Site Code">
              <Form.Control
                type="text"
                placeholder="Site Code"
                name="siteCode"
                value={formData.siteCode}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">Please provide a site code.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          
        </Row>
        <Row className="mb-3">
          
          
        <Col>
            <FloatingLabel controlId="floatingInputGrid" label="Site For Stock Keeping">
              <input
                className="form-control"
                list="siteForStockKeepingList"
                onChange={handleSiteForStockKeeping}
                placeholder="Site For Stock Keeping"
                value={siteForStockKeeping}
              />
              <datalist id="siteForStockKeeping">
                {filteredSiteForStockKeeping.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </datalist>
              <Form.Control.Feedback type="invalid">Please select a Site For Stock Keeping.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingInputGrid" label="Site For Transaction Nos">
              <input
                className="form-control"
                list="siteForTransactionNosList"
                onChange={handleSiteForTransactionNosChange}
                placeholder="Site For Transaction Nos"
                value={siteForTransactionNos}
              />
              <datalist id="siteForTransactionNosList">
                {filteredSiteForTransactionNosList.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </datalist>
              <Form.Control.Feedback type="invalid">Please select a Site For Transaction Nos.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Stores Stock">
              <Form.Check
                type="checkbox"
                name="storesStock"
                checked={formData.storesStock}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Is Primary">
              <Form.Check
                type="checkbox"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Has Transaction Numbers">
              <Form.Check
                type="checkbox"
                name="hasTransactionNos"
                checked={formData.hasTransactionNos}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
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

export default SiteForm;
