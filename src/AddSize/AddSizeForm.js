import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddSizeForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sizeList, setSizeList] = useState([]);
  const [addSizeRange, setAddSizeRange] = useState("");
  const [size, setSize] = useState("");
  const initialFormData = {
    size: '',
    position: '',
  };

  const user = useSelector((state) => state.user.user); // Get user from Redux


  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    axios.get("http://localhost:8080/api/add-sizes")
        .then(response => {
            setSizeList(response.data);
        })
        .catch(error => {
            console.log(error);
        })
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
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const currentDate = new Date().toISOString();

    // Filter out empty parentAccount field
    const formDataWithMeta = {
      ...formData,
      parentAccount: formData.parentAccount || null,
      createdBy: user,
      createdDate: currentDate,
    };

    try {

      console.log("form data = " + JSON.stringify(formData));
      const response = await axios.post('http://localhost:8080/api/add-sizes', formDataWithMeta);
      console.log('Post successful with:', JSON.stringify(response.data));
      setFormData(initialFormData);
    } catch (error) {
      console.error('There was an error posting the data!', error);
    }
  };

  const handleRowSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/add-sizes/${formData.addSizeId}`, formData);
      console.log('Put successful with:', JSON.stringify(response.data));
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
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  

  const handleSizeChange = (e) => {
    const selectedSizeName = e.target.value;
    setSize(selectedSizeName);
    setFormData({ ...formData, size: selectedSizeName });
  };

  const filteredSizeList = sizeList.filter(company =>
    company.size.toLowerCase().includes(size.toLowerCase())
  );

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Size">
              <input
                className="form-control"
                list="sizeList"
                onChange={handleSizeChange}
                placeholder="Size"
                value={size} // Use the size state
              />
              <datalist id="item-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filteredSizeList.slice(0, 5).map((company) => (
                  <option key={company.addSizeId} value={company.size}>
                    {company.size}
                  </option>
                ))}
              </datalist>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Position">
              <Form.Control
                type="text"
                placeholder="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Position.
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

export default AddSizeForm;
