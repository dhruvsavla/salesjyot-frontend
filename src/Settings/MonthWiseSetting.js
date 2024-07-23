import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import './Settings.css';
import { useSelector } from 'react-redux';

const MonthWiseSettingForm = () => {
    const user = useSelector((state) => state.user.user); // Get user from Redux

    const [validated, setValidated] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        monthWiseSettingId: null,
        company: null,
        site: null,
        financialYear: null,
        salesChallanNo: '',
        salesInvoiceNo: '',
        purchaseChallanNo: '',
        salesReturnNo: '',
        creditNoteNo: '',
        purchaseReturnChallanNo: '',
        orderFormNo: '',
        purchaseOrderNo: '',
        processEntryNo: '',
        stockEntryNo: '',
        stockConversionEntryNo: '',
        voucherEntryNo: '',
        cuttingEntryNo: '',
        orderCancellationFormNo: '',
        createdBy: null,
        createdDate: '',
    });
    const [companies, setCompanies] = useState([]);
    const [sites, setSites] = useState([]);
    const [financialYears, setFinancialYears] = useState([]);

    useEffect(() => {
        fetchSettingsData();
        fetchCompanies();
        fetchSites();
        fetchFinancialYears();
    }, []);

    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/monthwise-settings');
            if (response.data && response.data.length > 0) {
                setFormData(response.data[0]);
                setIsEditMode(true);
                console.log('Fetched settings:', response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/companies');
            setCompanies(response.data);
            console.log("companies = " + JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchSites = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/sites');
            setSites(response.data);
        } catch (error) {
            console.error('Error fetching sites:', error);
        }
    };

    const fetchFinancialYears = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/financial-years');
            setFinancialYears(response.data);
        } catch (error) {
            console.error('Error fetching financial years:', error);
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
        const selectedOption = name === 'company' ? companies.find(c => c.companyId === parseInt(value)) :
                              name === 'site' ? sites.find(s => s.siteId === parseInt(value)) :
                              financialYears.find(f => f.financialYearId === parseInt(value));
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
            if (isEditMode && formData.monthWiseSettingId) {
                response = await axios.put(`http://localhost:8080/api/monthwise-settings/${formData.monthWiseSettingId}`, formData);
                console.log('Put successful with:', response.data);
            } else {
                response = await axios.post('http://localhost:8080/api/monthwise-settings', formDataWithMeta);
                console.log('Post successful with:', response.data);
            }
            setSuccessMessage('Settings saved successfully!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            fetchSettingsData();
        } catch (error) {
            console.error('Error saving settings:', error);
            setSuccessMessage('Error saving the settings.');
        }
    };

    return (
        <div className="companySettingForm">
            <div className="companySettingHeader">
                <h1>Month Wise Settings</h1>
            </div>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingSelectCompany" label="Company">
                            <Form.Select
                                name="company"
                                value={formData.company?.companyId || ''}
                                onChange={handleDropdownChange}
                            >
                                <option value="">Select Company</option>
                                {companies.map((company) => (
                                    <option key={company.companyId} value={company.companyId}>{company.companyName}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingSelectSite" label="Site">
                            <Form.Select
                                name="site"
                                value={formData.site?.siteId || ''}
                                onChange={handleDropdownChange}
                            >
                                <option value="">Select Site</option>
                                {sites.map((site) => (
                                    <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingSelectFinancialYear" label="Financial Year">
                            <Form.Select
                                name="financialYear"
                                value={formData.financialYear?.financialYearId || ''}
                                onChange={handleDropdownChange}
                            >
                                <option value="">Select Financial Year</option>
                                {financialYears.map((year) => (
                                    <option key={year.financialYearId} value={year.financialYearId}>{year.financialYear}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Sales Challan No">
                            <Form.Control
                                type="text"
                                placeholder="Sales Challan No"
                                name="salesChallanNo"
                                value={formData.salesChallanNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Sales Invoice No">
                            <Form.Control
                                type="text"
                                placeholder="Sales Invoice No"
                                name="salesInvoiceNo"
                                value={formData.salesInvoiceNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Purchase Challan No">
                            <Form.Control
                                type="text"
                                placeholder="Purchase Challan No"
                                name="purchaseChallanNo"
                                value={formData.purchaseChallanNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Sales Return No">
                            <Form.Control
                                type="text"
                                placeholder="Sales Return No"
                                name="salesReturnNo"
                                value={formData.salesReturnNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Credit Note No">
                            <Form.Control
                                type="text"
                                placeholder="Credit Note No"
                                name="creditNoteNo"
                                value={formData.creditNoteNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Purchase Return Challan No">
                            <Form.Control
                                type="text"
                                placeholder="Purchase Return Challan No"
                                name="purchaseReturnChallanNo"
                                value={formData.purchaseReturnChallanNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Order Form No">
                            <Form.Control
                                type="text"
                                placeholder="Order Form No"
                                name="orderFormNo"
                                value={formData.orderFormNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Purchase Order No">
                            <Form.Control
                                type="text"
                                placeholder="Purchase Order No"
                                name="purchaseOrderNo"
                                value={formData.purchaseOrderNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Process Entry No">
                            <Form.Control
                                type="text"
                                placeholder="Process Entry No"
                                name="processEntryNo"
                                value={formData.processEntryNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Stock Entry No">
                            <Form.Control
                                type="text"
                                placeholder="Stock Entry No"
                                name="stockEntryNo"
                                value={formData.stockEntryNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Stock Conversion Entry No">
                            <Form.Control
                                type="text"
                                placeholder="Stock Conversion Entry No"
                                name="stockConversionEntryNo"
                                value={formData.stockConversionEntryNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Voucher Entry No">
                            <Form.Control
                                type="text"
                                placeholder="Voucher Entry No"
                                name="voucherEntryNo"
                                value={formData.voucherEntryNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Cutting Entry No">
                            <Form.Control
                                type="text"
                                placeholder="Cutting Entry No"
                                name="cuttingEntryNo"
                                value={formData.cuttingEntryNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Order Cancellation Form No">
                            <Form.Control
                                type="text"
                                placeholder="Order Cancellation Form No"
                                name="orderCancellationFormNo"
                                value={formData.orderCancellationFormNo}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
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

export default MonthWiseSettingForm;
