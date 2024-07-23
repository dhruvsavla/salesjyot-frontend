import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import './Settings.css';
import { useSelector } from 'react-redux';

const ConfigForm = () => {
  const user = useSelector((state) => state.user.user); // Get user from Redux

    const [validated, setValidated] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
      enableSizeWiseStock: false,
      godownSiteWiseStock: false,
      smsVia: '',
      defaultMargin: '',
      roundTotalForTransactionScreens: false,
      multiplePriceList: false,
      stockAlertInOrderForm: false,
      stopOrderIfNoStock: false,
      stockAlertInSalesForm: false,
      stopSalesIfNoStock: false,
      monthWiseTransactionNo: false,
      creditnoteNoSameAsSalesreturnNo: false,
      invoiceNoSameAsChallanNo: false,
      continuousInvoiceNo: false,
      continuousCNNo: false,
      taxesIncludedInRate: false,
      barcodeRows: '',
      barcodeCols: '',
      godownSiteWiseTransactionNo: false,
    });
  
    // Fetch data from server on component mount
    useEffect(() => {
        fetchSettingsData();
      }, []);
    
      const fetchSettingsData = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/company-settings');
          if (response.data && response.data.length > 0) {
            setFormData(response.data[0]); // Accessing the first object in the array
            setIsEditMode(true);
            console.log('Fetched settings:', response.data[0]);
          }
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
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

        // Filter out empty parentAccount field
        const formDataWithMeta = {
          ...formData,
          createdBy: user,
          createdDate: currentDate,
        };
        try {
          let response;
          if (isEditMode && formData.companySettingId) {
            // Update existing settings
            response = await axios.put(`http://localhost:8080/api/company-settings/${formData.companySettingId}`, formData);
            console.log('Put successful with:', response.data);
          } else {
            // Create new settings
            response = await axios.post('http://localhost:8080/api/company-settings', formDataWithMeta);
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
            <h1>Company Settings</h1>
          </div>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Enable Size wise Stock"
                  name="enableSizeWiseStock"
                  checked={formData.enableSizeWiseStock}
                  onChange={handleChange}
                />
              </Col>
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Godown / Site wise Stock"
                  name="godownSiteWiseStock"
                  checked={formData.godownSiteWiseStock}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <FloatingLabel controlId="floatingInputGrid" label="SMS Via">
                  <Form.Control
                    type="text"
                    placeholder="SMS Via"
                    name="smsVia"
                    value={formData.smsVia}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md>
                <FloatingLabel controlId="floatingInputGrid" label="Default Margin">
                  <Form.Control
                    type="text"
                    placeholder="Default Margin"
                    name="defaultMargin"
                    value={formData.defaultMargin}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a default margin.
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Round Total for Transaction Screens"
                  name="roundTotalForTransactionScreens" // Corrected name
                  checked={formData.roundTotalForTransactionScreens}
                  onChange={handleChange}
                />
              </Col>
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Multiple Price List"
                  name="multiplePriceList"
                  checked={formData.multiplePriceList}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Stock Alert in Order Form"
                  name="stockAlertInOrderForm" // Corrected name
                  checked={formData.stockAlertInOrderForm}
                  onChange={handleChange}
                />
              </Col>
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Stop Order if no Stock"
                  name="stopOrderIfNoStock"
                  checked={formData.stopOrderIfNoStock}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Stock Alert in Sales Form"
                  name="stockAlertInSalesForm" // Corrected name
                  checked={formData.stockAlertInSalesForm}
                  onChange={handleChange}
                />
              </Col>
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Stop Sales if no Stock"
                  name="stopSalesIfNoStock"
                  checked={formData.stopSalesIfNoStock}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Month wise Transaction No"
                  name="monthWiseTransactionNo"
                  checked={formData.monthWiseTransactionNo}
                  onChange={handleChange}
                />
              </Col>
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Creditnote Number same as Salesreturn Number"
                  name="creditnoteNoSameAsSalesreturnNo" // Corrected name
                  checked={formData.creditnoteNoSameAsSalesreturnNo}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Invoice Number same as Challan Number"
                  name="invoiceNoSameAsChallanNo" // Corrected name
                  checked={formData.invoiceNoSameAsChallanNo}
                  onChange={handleChange}
                />
              </Col>
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Continuous Invoice No"
                  name="continuousInvoiceNo"
                  checked={formData.continuousInvoiceNo}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Continuous CN No"
                  name="continuousCNNo"
                  checked={formData.continuousCNNo}
                  onChange={handleChange}
                />
              </Col>
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Taxes Included in Rate"
                  name="taxesIncludedInRate"
                  checked={formData.taxesIncludedInRate}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <FloatingLabel controlId="floatingInputGrid" label="Barcode Rows">
                  <Form.Control
                    type="text"
                    placeholder="Barcode Rows"
                    name="barcodeRows"
                    value={formData.barcodeRows}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md>
                <FloatingLabel controlId="floatingInputGrid" label="Barcode Cols">
                  <Form.Control
                    type="text"
                    placeholder="Barcode Cols"
                    name="barcodeCols"
                    value={formData.barcodeCols}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md>
                <Form.Check
                  type="checkbox"
                  label="Godown / Site wise Transaction Number"
                  name="godownSiteWiseTransactionNo"
                  checked={formData.godownSiteWiseTransactionNo}
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

export default ConfigForm;
