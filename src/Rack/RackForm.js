import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Customer/CustomerForm.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RackForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [siteList, setSiteList] = useState([]); // Initialize as an empty array
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [createdBy, setCreatedBy] = useState(null); // State to hold user data
  const [formData, setFormData] = useState({
    site: '',
    rackName: '',
  });

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setIsEditMode(true);
      setSiteName(initialData.site ? initialData.site.siteName : '');
      setCreatedBy(initialData.createdBy || null); // Set createdBy user data if available
    } else {
      setFormData({
        site: '',
        rackName: '',
      });
      setIsEditMode(false);
    }
  }, [initialData]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/sites")
      .then(response => {
        setSiteList(response.data); // Ensure response is an array
      })
      .catch(error => console.error(error));
  }, []);

  const handleSiteNameChange = (e) => {
    const selectedSiteName = e.target.value;
    setSiteName(selectedSiteName);
    const selectedSite = siteList.find(site => site.siteName === selectedSiteName);
    setFormData({ ...formData, site: selectedSite || '' }); // Ensure selectedSite is defined
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
        const response = await axios.put(`http://localhost:8080/api/racks/${formData.addRackId}`, formDataWithMeta);
        console.log('Put successful with:', response.data);
        setIsEditMode(false);
      } else {
        const response = await axios.post('http://localhost:8080/api/racks', formDataWithMeta);
        console.log('Post successful with:', response.data);
      }
      setFormData({
        site: '',
        rackName: '',
      });
      setCreatedBy(null);
      setSiteName('');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  const filteredSiteNames = siteList.filter(pl => pl.siteName.toLowerCase().includes(siteName.toLowerCase()));

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Rack Name">
              <Form.Control
                type="text"
                placeholder="Rack Name"
                name="rackName"
                value={formData.rackName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a rack name.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>

          <Col>
            <FloatingLabel controlId="floatingInputGrid" label="Site Name">
              <input
                className="form-control"
                list="siteList"
                onChange={handleSiteNameChange}
                placeholder="Site Name"
                value={siteName}
                required
              />
              <datalist id="siteList">
                {filteredSiteNames.map((site, index) => (
                  <option key={index} value={site.siteName}>{site.siteName}</option>
                ))}
              </datalist>
              <Form.Control.Feedback type="invalid">Please select a site name.</Form.Control.Feedback>
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

export default RackForm;
