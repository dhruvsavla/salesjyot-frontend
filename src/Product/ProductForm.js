import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row, Table, Container } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProductForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [availableSizes, setAvailableSizes] = useState([]);
  const [addSizeRanges, setAddSizeRanges] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productPriceLists, setProductPriceLists] = useState([]);

  const [sizeSearch, setSizeSearch] = useState("");
  const [sizeRangeSearch, setSizeRangeSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [priceListSearch, setPriceListSearch] = useState("");

  const initialFormData = {
    productName: '',
    color: '',
    category: '',
    type: '',
    description: '',
    addSizeRange: null,
    available_sizes: [],
    avgPrice: '',
    avgMrp: '',
    avgCost: '',
    supplier: null,
    supplierProductName: '',
    supplierProductColor: '',
    perBox: '',
    unit: '',
    taxesIncluded: false,
    productPriceLists: [],
   
  };

  const [formData, setFormData] = useState(initialFormData);
  const user = useSelector((state) => state.user.user); // Get user from Redux

  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchAvailableSizes = async () => {
      const response = await axios.get('http://localhost:8080/api/add-sizes');
      setAvailableSizes(response.data);
    };

    const fetchAddSizeRanges = async () => {
      const response = await axios.get('http://localhost:8080/api/add-sizeranges');
      setAddSizeRanges(response.data);
    };

    const fetchSuppliers = async () => {
      const response = await axios.get('http://localhost:8080/api/customers');
      setSuppliers(response.data);
    };

    const fetchProductPriceLists = async () => {
      const response = await axios.get('http://localhost:8080/api/priceLists');
      setProductPriceLists(response.data);
    };

    fetchAvailableSizes();
    fetchAddSizeRanges();
    fetchSuppliers();
    fetchProductPriceLists();
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
        const response = await axios.post('http://localhost:8080/api/products', formDataWithMeta);
        const product = response.data;
  
        // Prepare the product price list data from state
        const productPriceListPromises = gridData.map((data, index) => {
          return axios.post('http://localhost:8080/api/product-price-lists', {
            product,
            priceList: formData.productPriceLists[0],
            size: data.addSize,
            costPrice: data.costPrice,
            sellingPrice: data.sellingPrice,
            mrp: data.mrp
          });
        });
  
        await Promise.all(productPriceListPromises);
        console.log('Post successful with:', JSON.stringify(response.data));
        setFormData({
          ...initialFormData,
          available_sizes: [],
          productPriceLists: [],
        });
        resetSearchFields();
      } catch (error) {
        console.error('There was an error posting the data!', error);
      }
    
    setValidated(true);
  };
  
  
  const handleUpdate = async () => {
    try {
      const form = document.getElementById('product-form'); // Get the form element
      const response = await axios.put(`http://localhost:8080/api/products/${formData.productId}`, formData);
      const productId = formData.productId;
  
      const productPriceListPromises = gridData.map((data, index) => {
        return axios.put(`http://localhost:8080/api/product-price-lists/${data.id}`, {
          productId,
          sizeId: data.addSize,
          costPrice: form[`input1-${index}`].value,
          sellingPrice: form[`input2-${index}`].value,
          mrp: form[`input3-${index}`].value
        });
      });
  
      await Promise.all(productPriceListPromises);
      console.log('Put successful with:', JSON.stringify(response.data));
      setFormData({
        ...initialFormData,
        available_sizes: [],
        productPriceLists: [],
      });
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

  const handleGridDataChange = (index, field, value) => {
    const updatedGridData = [...gridData];
    updatedGridData[index] = { ...updatedGridData[index], [field]: value };
    setGridData(updatedGridData);
  };
  

  const handleSelectChange = (event) => {
    const { name, selectedOptions } = event.target;
    const values = Array.from(selectedOptions).map(option => ({ id: option.value }));
    setFormData({
      ...formData,
      [name]: values,
    });
  };

  const handleSizeChange = (e) => {
    setSizeSearch(e.target.value);
    const selectedSizes = availableSizes.filter(size => size.size.includes(e.target.value));
    setFormData({ ...formData, available_sizes: selectedSizes });
  };

  const handleSizeRangeChange = async (e) => {
    setSizeRangeSearch(e.target.value);
    const selectedSizeRanges = addSizeRanges.filter(sizeRange => sizeRange.sizeRange.includes(e.target.value));
    setFormData({ ...formData, addSizeRange: selectedSizeRanges[0] });
  
    console.log("selectedSizeRanges[0].addSizeRangeId: " + selectedSizeRanges[0].addSizeRangeId);
    
    try {
      const response = await axios.get(`http://localhost:8080/api/add-sizeranges/sizes?sizeRange=${selectedSizeRanges[0].addSizeRangeId}`);
      console.log("response data = " + JSON.stringify(response.data));
      setGridData(response.data);
    } catch (error) {
      console.error("Error fetching grid data:", error);
    }
  };

  const handleSupplierChange = (e) => {
    setSupplierSearch(e.target.value);
    const selectedSuppliers = suppliers.filter(supplier => supplier.customerName.includes(e.target.value));
    setFormData({ ...formData, supplier: selectedSuppliers[0] });
  };

  const handlePriceListChange = (e) => {
    setPriceListSearch(e.target.value);
    const selectedPriceLists = productPriceLists.filter(priceList => priceList.priceListName.includes(e.target.value));
    setFormData({ ...formData, productPriceLists: selectedPriceLists });
  };

  const resetSearchFields = () => {
    setSizeSearch("");
    setSizeRangeSearch("");
    setSupplierSearch("");
    setPriceListSearch("");
  };

  const fetchGridData = async (size) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/grid-data?size=${size}`);
      setGridData(response.data);
    } catch (error) {
      console.error('Error fetching grid data:', error);
    }
  };

  const filteredSizes = availableSizes.filter(size => size.size.toLowerCase().includes(sizeSearch.toLowerCase()));
  const filteredSizeRanges = addSizeRanges.filter(sizeRange => sizeRange.sizeRange.toLowerCase().includes(sizeRangeSearch.toLowerCase()));
  const filteredSuppliers = suppliers.filter(supplier => supplier.customerName.toLowerCase().includes(supplierSearch.toLowerCase()));
  const filteredPriceLists = productPriceLists.filter(priceList => priceList.priceListName.toLowerCase().includes(priceListSearch.toLowerCase()));

  return (
    <div className="customer-form">
    <Form validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Product Name">
            <Form.Control
              type="text"
              placeholder="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              
            />
            <Form.Control.Feedback type="invalid">
              Please provide a Product Name.
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Color">
            <Form.Control
              type="text"
              placeholder="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              
            />
            <Form.Control.Feedback type="invalid">
              Please provide a Color.
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Category">
            <Form.Control
              type="text"
              placeholder="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              
            />
            <Form.Control.Feedback type="invalid">
              Please provide a Category.
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Type">
            <Form.Control
              type="text"
              placeholder="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              
            />
            <Form.Control.Feedback type="invalid">
              Please provide a Type.
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Description">
            <Form.Control
              type="text"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              
            />
            <Form.Control.Feedback type="invalid">
              Please provide a Description.
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Average Price">
            <Form.Control
              type="number"
              placeholder="Average Price"
              name="avgPrice"
              value={formData.avgPrice}
              onChange={handleChange}
              
            />
            <Form.Control.Feedback type="invalid">
              Please provide an Average Price.
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Average MRP">
            <Form.Control
              type="number"
              placeholder="Average MRP"
              name="avgMrp"
              value={formData.avgMrp}
              onChange={handleChange}
              
            />
            <Form.Control.Feedback
      type="invalid">
      Please provide an Average MRP.
      </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      <Col md>
      <FloatingLabel controlId="floatingInputGrid" label="Average Cost">
      <Form.Control
      type="number"
      placeholder="Average Cost"
      name="avgCost"
      value={formData.avgCost}
      onChange={handleChange}
      
      />
      <Form.Control.Feedback type="invalid">
      Please provide an Average Cost.
      </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      <Col md>
      <FloatingLabel controlId="floatingInputGrid" label="Per Box">
      <Form.Control
      type="number"
      placeholder="Per Box"
      name="perBox"
      value={formData.perBox}
      onChange={handleChange}
      
      />
      <Form.Control.Feedback type="invalid">
      Please provide a Per Box value.
      </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      </Row>
      <Row className="mb-3">
      <Col md>
      <FloatingLabel controlId="floatingInputGrid" label="Unit">
      <Form.Control
      type="text"
      placeholder="Unit"
      name="unit"
      value={formData.unit}
      onChange={handleChange}
      
      />
      <Form.Control.Feedback type="invalid">
      Please provide a Unit.
      </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      <Col md>
      <FloatingLabel controlId="floatingInputGrid" label="Suppl Prod Name">
      <Form.Control
      type="text"
      placeholder="Supplier Product Name"
      name="supplierProductName"
      value={formData.supplierProductName}
      onChange={handleChange}
      
      />
      <Form.Control.Feedback type="invalid">
      Please provide a Supplier Product Name.
      </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      <Col md>
      <FloatingLabel controlId="floatingInputGrid" label="Suppl Prod Color">
      <Form.Control
      type="text"
      placeholder="Supplier Product Color"
      name="supplierProductColor"
      value={formData.supplierProductColor}
      onChange={handleChange}
      
      />
      <Form.Control.Feedback type="invalid">
      Please provide a Supplier Product Color.
      </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      </Row>
      <Row className="mb-3">
      <Col md>
      <FloatingLabel controlId="floatingInputGrid" label="Size Range">
      <input
          className="form-control"
          list="size-range-options"
          onChange={handleSizeRangeChange}
          placeholder="Size Range"
          value={sizeRangeSearch}
          
      />
      <datalist id="size-range-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {filteredSizeRanges.slice(0, 5).map((sizeRange) => (
          <option key={sizeRange.sizeRangeId} value={sizeRange.sizeRange}>
              {sizeRange.addSizeRangeId} - {sizeRange.sizeRange}
          </option>
          ))}
      </datalist>
      <Form.Control.Feedback type="invalid">
          Please select a Size Range.
      </Form.Control.Feedback>
      </FloatingLabel>

      </Col>
      <Col md>
      <FloatingLabel controlId="floatingInputGrid" label="Available Sizes">
          <input
          className="form-control"
          list="size-options"
          onChange={handleSizeChange}
          placeholder="Available Sizes"
          value={sizeSearch}
          
          />
          <datalist id="size-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {filteredSizes.slice(0, 5).map((size) => (
              <option key={size.sizeId} value={size.size}>
              {size.size}
              </option>
          ))}
          </datalist>
          <Form.Control.Feedback type="invalid">
          Please select Available Sizes.
          </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      <Col md>
      <FloatingLabel controlId="floatingInputGrid" label="Supplier">
          <input
          className="form-control"
          list="supplier-options"
          onChange={handleSupplierChange}
          placeholder="Supplier"
          value={supplierSearch}
          
          />
          <datalist id="supplier-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {filteredSuppliers.slice(0, 5).map((supplier) => (
              <option key={supplier.id} value={supplier.customerName}>
              {supplier.customerName}
              </option>
          ))}
          </datalist>
          <Form.Control.Feedback type="invalid">
          Please select a Supplier.
          </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      </Row>
      <Row className="mb-3">
      <Col md>
      <FloatingLabel controlId="floatingSelectGrid" label="Product Price Lists">
          <input
          className="form-control"
          list="price-list-options"
          onChange={handlePriceListChange}
          placeholder="Product Price Lists"
          value={priceListSearch}
          
          />
          <datalist id="price-list-options" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {filteredPriceLists.slice(0, 5).map((priceList) => (
              <option key={priceList.id} value={priceList.priceListName}>
              {priceList.priceListName}
              </option>
          ))}
          </datalist>
          <Form.Control.Feedback type="invalid">
          Please select Product Price Lists.
          </Form.Control.Feedback>
      </FloatingLabel>
      </Col>
      </Row>
      <Form.Group className="mb-3">
      <Form.Check
      type="checkbox"
      label="Taxes Included"
      name="taxesIncluded"
      checked={formData.taxesIncluded}
      onChange={handleChange}
      />
      </Form.Group>
      <Container className='clacContainer'>
      <Row className="mb-3">
        
<Col md>
  <FloatingLabel controlId="floatingInputGrid" label="Multiples of">
    <Form.Control
      type="text"
      placeholder="Multiples of"
      name="multiplesOfMRP"
      value={formData.multiplesOfMRP}
      onChange={handleChange}
    />
  </FloatingLabel>
</Col>
<Col md>
  <FloatingLabel controlId="floatingInputGrid" label="MRP Difference">
    <Form.Control
      type="text"
      placeholder="MRP Difference"
      name="mrpDifference"
      value={formData.mrpDifference}
      onChange={handleChange}
    />
  </FloatingLabel>
</Col>
<Col md>
  <FloatingLabel controlId="floatingInputGrid" label="SP Difference">
    <Form.Control
      type="text"
      placeholder="SP Difference"
      name="spDifference"
      value={formData.spDifference}
      onChange={handleChange}
    />
  </FloatingLabel>
</Col>
</Row>
<Row className="mb-3">
<Col md>
  <FloatingLabel controlId="floatingInputGrid" label="CP Difference">
    <Form.Control
      type="text"
      placeholder="CP Difference"
      name="cpDifference"
      value={formData.cpDifference}
      onChange={handleChange}
    />
  </FloatingLabel>
</Col>
<Col md>
  <Form.Check
    type="checkbox"
    id="constantSalesPrice"
    label="Constant Sales Price"
    checked={formData.constantSalesPrice}
    onChange={handleChange}
    name="constantSalesPrice"
  />
</Col>
<Col md>
  <Form.Check
    type="checkbox"
    id="constantCostPrice"
    label="Constant Cost Price"
    checked={formData.constantCostPrice}
    onChange={handleChange}
    name="constantCostPrice"
  />
</Col>
</Row>
<Row className="mb-3">
<Col md>
  <Form.Check
    type="checkbox"
    id="constantMRP"
    label="Constant MRP"
    checked={formData.constantMRP}
    onChange={handleChange}
    name="constantMRP"
  />
</Col>
<Col md>
  <Form.Check
    type="checkbox"
    id="cpSameAsSP"
    label="CP same as SP"
    checked={formData.cpSameAsSP}
    onChange={handleChange}
    name="cpSameAsSP"
  />
</Col>
<Col md>
  <Form.Check
    type="checkbox"
    id="spSameAsMRP"
    label="SP same as MRP"
    checked={formData.spSameAsMRP}
    onChange={handleChange}
    name="spSameAsMRP"
  />
</Col>
</Row>
</Container>

      <div className='submitButton'>
          <Button variant="primary" type="submit">
          {isEditMode ? 'Update' : 'Submit'}
          </Button>
          {isEditMode && (
          <Button variant="secondary" onClick={handleUpdate}>
          Update
          </Button>
          )}
      </div>
      </Form>
      <Container className='container'>
      {formData.addSizeRange && (
        <Table striped bordered hover className="grid-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Cost Price</th>
              <th>Sales Price</th>
              <th>MRP</th>
            </tr>
          </thead>
          <tbody>
            {gridData.map((data, index) => (
              <tr key={index}>
                <td>{data.addSize.size}</td>
                <td><input type="text" value={data.costPrice} onChange={(e) => handleGridDataChange(index, 'costPrice', e.target.value)} /></td>
                <td><input type="text" value={data.sellingPrice} onChange={(e) => handleGridDataChange(index, 'sellingPrice', e.target.value)} /></td>
                <td><input type="text" value={data.mrp} onChange={(e) => handleGridDataChange(index, 'mrp', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
    </Container>
    </div>
  );
};

export default ProductForm;
