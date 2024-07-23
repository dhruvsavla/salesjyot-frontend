import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomerForm.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import { useSelector } from 'react-redux'; // Import useSelector from Redux

const CustomerForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [brokersList, setBrokersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [priceListList, setPriceListList] = useState([]);
  const [broker, setBroker] = useState("");
  const [category, setCategory] = useState("");
  const [priceList, setPriceList] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const user = useSelector((state) => state.user.user); // Get user from Redux

  const options = [
    { value: "customer", label: "Customer" },
    { value: "vendor", label: "Vendor" },
    { value: "broker", label: "Broker" },
    { value: "jobworker", label: "Job Worker" },
    { value: "other", label: "Other" }
  ];

  const initialFormData = {
    customerName: '',
    customerType: '',
    broker: '',
    brokerage: '',
    discount: '',
    creditLimitDays: '',
    creditLimitAmount: '',
    specialNote: '',
    priceList: '',
    category: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setIsEditMode(true);
      setBroker(initialData.broker || '');
      setCategory(initialData.category || '');
      setPriceList(initialData.priceList ? initialData.priceList.priceListName : '');
      setSelectedTypes(initialData.customerType.split(',').map(type => ({ value: type.trim(), label: type.trim() })));
    } else {
      setFormData(initialFormData);
      setIsEditMode(false);
    }
  }, [initialData]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/priceLists")
      .then(response => setPriceListList(response.data))
      .catch(error => console.error(error));

    axios.get("http://localhost:8080/api/customers")
      .then(response => {
        setBrokersList(response.data.map(customer => customer.broker).filter(broker => broker));
        setCategoriesList(response.data.map(customer => customer.category).filter(category => category));
      })
      .catch(error => console.error(error));
  }, []);

  const handleBrokerChange = (e) => {
    const selectedBroker = e.target.value;
    setBroker(selectedBroker);
    setFormData({ ...formData, broker: selectedBroker });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setFormData({ ...formData, category: selectedCategory });
  };

  const handlePriceListChange = (e) => {
    const selectedPriceListName = e.target.value;
    setPriceList(selectedPriceListName);
    const selectedPriceList = priceListList.find(pl => pl.priceListName === selectedPriceListName);
    setFormData({ ...formData, priceList: selectedPriceList });
  };

  const handleTypeChange = (selectedOptions) => {
    const selectedTypes = selectedOptions.map(option => option.value);
    setSelectedTypes(selectedOptions);
    setFormData({ ...formData, customerType: selectedTypes.join(', ') });
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

    // Get current date and time
    const currentDate = new Date().toISOString();

    console.log("user = " + JSON.stringify(user));

    // Include user and current date/time in formData
    const formDataWithMeta = {
      ...formData,
      createdBy: user, // Assuming user information is directly stored in Redux
      createdDate: currentDate,
    };

    try {
      if (isEditMode) {
        const response = await axios.put(`http://localhost:8080/api/customers/${formData.customerId}`, formDataWithMeta);
        console.log('Put successful with:', JSON.stringify(response.data));
        setIsEditMode(false);
      } else {
        const response = await axios.post('http://localhost:8080/api/customers', formDataWithMeta);
        console.log('Post successful with:', JSON.stringify(response.data));
      }
      setFormData(initialFormData);
      setBroker("");
      setCategory("");
      setPriceList("");
      setSelectedTypes([]);
      if (onUpdate) {
        onUpdate(); // Notify parent component of update
      }
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  const filteredBrokers = brokersList.filter(b => b.toLowerCase().includes(broker.toLowerCase()));
  const filteredCategories = categoriesList.filter(c => c.toLowerCase().includes(category.toLowerCase()));
  const filteredPriceLists = priceListList.filter(pl => pl.priceListName.toLowerCase().includes(priceList.toLowerCase()));

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Name">
              <Form.Control
                type="text"
                placeholder="Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a name.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
              <Select
                options={options}
                value={selectedTypes}
                onChange={handleTypeChange}
                isMulti={true}
                placeholder="Select Type"
                classNamePrefix="react-select"
                className="form-control"
              />
              <Form.Control.Feedback type="invalid">Please select at least one type.</Form.Control.Feedback>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Broker">
              <input
                className="form-control"
                list="brokersList"
                onChange={handleBrokerChange}
                placeholder="Broker"
                value={broker}
                required
              />
              <datalist id="brokersList">
                {filteredBrokers.map((b, index) => (
                  <option key={index} value={b}>{b}</option>
                ))}
              </datalist>
              <Form.Control.Feedback type="invalid">Please select a broker.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Brokerage">
              <Form.Control
                type="text"
                placeholder="Brokerage"
                name="brokerage"
                value={formData.brokerage}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a brokerage.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Discount">
              <Form.Control
                type="text"
                placeholder="Discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a discount.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Credit Limit Days">
              <Form.Control
                type="text"
                placeholder="Credit Limit Days"
                name="creditLimitDays"
                value={formData.creditLimitDays}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide credit limit days.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Credit Limit Amount">
              <Form.Control
                type="text"
                placeholder="Credit Limit Amount"
                name="creditLimitAmount"
                value={formData.creditLimitAmount}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide credit limit amount.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>

          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Special Note">
              <Form.Control
                type="text"
                placeholder="Special Note"
                name="specialNote"
                value={formData.specialNote}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a special note.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Price List">
              <input
                className="form-control"
                list="priceListList"
                onChange={handlePriceListChange}
                placeholder="Price List"
                value={priceList}
                required
              />
              <datalist id="priceListList">
                {filteredPriceLists.map((pl, index) => (
                  <option key={index} value={pl.priceListName}>{pl.priceListName}</option>
                ))}
              </datalist>
              <Form.Control.Feedback type="invalid">Please select a price list.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={{ span: 4, offset: -1 }}>
            <FloatingLabel controlId="floatingInputGrid" label="Category">
              <input
                className="form-control"
                list="categoriesList"
                onChange={handleCategoryChange}
                placeholder="Category"
                value={category}
                required
              />
              <datalist id="categoriesList">
                {filteredCategories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </datalist>
              <Form.Control.Feedback type="invalid">Please select a category.</Form.Control.Feedback>
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

export default CustomerForm;
