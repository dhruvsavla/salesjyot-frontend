import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SizeAliasForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeRanges, setSizeRanges] = useState([]);

  const [sizeSearch, setSizeSearch] = useState("");
  const [sizeRangeSearch, setSizeRangeSearch] = useState("");

  const initialFormData = {
    alias: '',
    addSize: {},
    addSizeRange: {},
  };

  const [formData, setFormData] = useState(initialFormData);
  const user = useSelector((state) => state.user.user); // Get user from Redux

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
        setFormData(initialData);
        setSizeRangeSearch(initialData.addSizeRange.sizeRange); // Update the companyName state
        setSizeSearch(initialData.addSize.size); // Update the companyName state
        setIsEditMode(true);
    } else {
      setFormData(initialFormData);
      setIsEditMode(false);
    }
  }, [initialData]);
  

  useEffect(() => {
    const fetchSizes = async () => {
      const response = await axios.get('http://localhost:8080/api/add-sizes');
      setSizes(response.data);
    };

    const fetchSizeRanges = async () => {
      const response = await axios.get('http://localhost:8080/api/add-sizeranges');
      setSizeRanges(response.data);
    };

    fetchSizes();
    fetchSizeRanges();
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
        if (isEditMode) {
          await axios.put(`http://localhost:8080/api/size-aliases/${formData.sizeAliasId}`, formData);
          if (onUpdate) onUpdate(formData);
        } else {
          const response = await axios.post('http://localhost:8080/api/size-aliases', formDataWithMeta);
          console.log('Post successful with:', JSON.stringify(response.data));
          setFormData(initialFormData);
          setSizeSearch("");
          setSizeRangeSearch("");
        }
      } catch (error) {
        console.error('There was an error posting the data!', error);
      }
    
    setValidated(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSizeChange = (e) => {
    setSizeSearch(e.target.value);
    const selectedSize = sizes.find(size => size.size === e.target.value);
    setFormData({ ...formData, addSize: selectedSize });
  };

  const handleSizeRangeChange = (e) => {
    setSizeRangeSearch(e.target.value);
    const selectedSizeRange = sizeRanges.find(sizeRange => sizeRange.sizeRange === e.target.value);
    setFormData({ ...formData, addSizeRange: selectedSizeRange });
  };

  const filteredSizes = sizes.filter(size => size.size.toLowerCase().includes(sizeSearch.toLowerCase()));
  const filteredSizeRanges = sizeRanges.filter(sizeRange => sizeRange.sizeRange.toLowerCase().includes(sizeRangeSearch.toLowerCase()));

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Alias">
              <Form.Control
                type="text"
                placeholder="Alias"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an alias.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Size">
              <input
                className="form-control"
                list="size-options"
                onChange={handleSizeChange}
                placeholder="Size"
                value={sizeSearch}
              />
              <datalist id="size-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filteredSizes.slice(0, 5).map((size) => (
                  <option key={size.sizeId} value={size.size}>
                    {size.size}
                  </option>
                ))}
              </datalist>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Size Range">
              <input
                className="form-control"
                list="sizeRange-options"
                onChange={handleSizeRangeChange}
                placeholder="Size Range"
                value={sizeRangeSearch}
              />
              <datalist id="sizeRange-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filteredSizeRanges.slice(0, 5).map((sizeRange) => (
                  <option key={sizeRange.sizeRangeId} value={sizeRange.sizeRange}>
                    {sizeRange.sizeRange}
                  </option>
                ))}
              </datalist>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <div className="submitButton">
          {isEditMode ? (
            <Button type="button" onClick={handleSubmit}>
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

export default SizeAliasForm;
