import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import './Settings.css';
import { useSelector } from 'react-redux';

const SiteWiseSettingsForm = () => {
  const user = useSelector((state) => state.user.user); // Get user from Redux

  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    siteName: {},
    defaultTax: {},
    defaultStockSite: {},
    rackWiseStock: false,
  });
  const [siteOptions, setSiteOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);

  useEffect(() => {
    fetchSettingsData();
    fetchSiteOptions();
    fetchTaxOptions();
  }, []);

  const fetchSettingsData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/site-wise-settings');
      if (response.data && response.data.length > 0) {
        setFormData(response.data[0]); // Accessing the first object in the array
        setIsEditMode(true);
        console.log('Fetched settings:', response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchSiteOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/sites');
      setSiteOptions(response.data); // Assuming response.data is an array of site options
    } catch (error) {
      console.error('Error fetching site options:', error);
    }
  };

  const fetchTaxOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tax');
      setTaxOptions(response.data); // Assuming response.data is an array of tax options
    } catch (error) {
      console.error('Error fetching tax options:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDropdownChange = (event) => {
    const { name, value } = event.target;
    const selectedOption = name === 'siteName' ? siteOptions.find(c => c.siteId === parseInt(value)) :
                          name === 'defaultTax' ? taxOptions.find(s => s.taxId === parseInt(value)) :
                          siteOptions.find(f => f.siteId === parseInt(value));
    setFormData({
        ...formData,
        [name]: selectedOption,
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
      let response;
      if (isEditMode && formData.id) {
        // Update existing settings
        response = await axios.put(`http://localhost:8080/api/site-wise-settings/${formData.id}`, formData);
        console.log('Put successful with:', response.data);
      } else {
        // Create new settings
        response = await axios.post('http://localhost:8080/api/site-wise-settings', formDataWithMeta);
        console.log('Post successful with:', response.data);
      }
      setSuccessMessage('Settings saved successfully!');
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Clear message after 3 seconds

      // Refetch updated settings after save
      fetchSettingsData();
    } catch (error) {
      console.error('Error saving settings:', error);
      setSuccessMessage('Error saving the settings.');
    }
  };

  return (
    <div className="companySettingForm">
      <div className="companySettingHeader">
        <h1>Site Wise Settings</h1>
      </div>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Site Name">
              <Form.Select
                aria-label="Select Site"
                name="siteName"
                value={formData.siteName?.siteId || ''}
                onChange={handleDropdownChange}
              >
                <option value="">Select Site</option>
                {siteOptions.map(site => (
                  <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a site.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Default Tax">
              <Form.Select
                aria-label="Select Tax"
                name="defaultTax"
                value={formData.defaultTax?.taxId || ''}
                onChange={handleDropdownChange}
                
              >
                <option value="">Select Tax</option>
                {taxOptions.map(tax => (
                  <option key={tax.taxId} value={tax.taxId}>{tax.taxName}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a default tax.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Default Stock Site">
              <Form.Select
                aria-label="Select Stock Site"
                name="defaultStockSite"
                value={formData.defaultStockSite?.siteId || ''}
                onChange={handleDropdownChange}
              >
                <option value="">Select Stock Site</option>
                {siteOptions.map(site => (
                  <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a default stock site.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <Form.Check
              type="checkbox"
              label="Rack Wise Stock"
              name="rackWiseStock"
              checked={formData.rackWiseStock}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <div className="submitButton">
          <Button type="submit">
            {isEditMode ? 'Save' : 'Save'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SiteWiseSettingsForm;
