import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const TransactionSettingsForm = () => {
    const user = useSelector((state) => state.user.user); // Get user from Redux

    const [validated, setValidated] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        transactionSettingsId: '',
        company: {},
        site: {},
        fyear: {},
        salesChallanNo: '',
        salesChallanPrefix: '',
        salesInvoiceNo: '',
        salesInvoicePrefix: '',
        purchaseChallanNo: '',
        purchaseChallanPrefix: '',
        salesReturnNo: '',
        salesReturnPrefix: '',
        creditNoteNo: '',
        creditNotePrefix: '',
        purchaseReturnChallanNo: '',
        purchaseReturnChallanPrefix: '',
        orderFormNo: '',
        orderFormPrefix: '',
        purchaseOrderNo: '',
        purchaseOrderPrefix: '',
        processEntryNo: '',
        processEntryPrefix: '',
        stockEntryNo: '',
        stockEntryPrefix: '',
        stockConversionEntryNo: '',
        stockConversionEntryPrefix: '',
        voucherEntryNo: '',
        voucherEntryPrefix: '',
        cuttingEntryNo: '',
        cuttingEntryPrefix: '',
        orderCancellationFormNo: '',
        orderCancellationFormPrefix: '',
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
            const response = await axios.get('http://localhost:8080/api/transaction-settings');
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
        const currentDate = new Date().toISOString();

    // Filter out empty parentAccount field
    const formDataWithMeta = {
      ...formData,
      createdBy: user,
      createdDate: currentDate,
    };
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:8080/api/transaction-settings/${formData.transactionSettingsId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/transaction-settings', formDataWithMeta);
            }
            // Handle successful form submission (e.g., show a message, redirect, etc.)
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="companySettingForm">
            <div className="companySettingHeader">
                <h1>Transaction Settings</h1>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingSelectCompany" label="Company">
                            <Form.Select
                                name="company"
                                value={formData.company?.companyId || ''}
                                onChange={(e) => handleDropdownChange(e, companies)}
                            >
                                <option value="">Select Company</option>
                                {companies.map((company) => (
                                    <option key={company.companyId} value={company.companyId}>
                                        {company.companyName}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingSelectSite" label="Site">
                            <Form.Select
                                name="site"
                                value={formData.site?.siteId || ''}
                                onChange={(e) => handleDropdownChange(e, sites)}
                            >
                                <option value="">Select Site</option>
                                {sites.map((site) => (
                                    <option key={site.siteId} value={site.siteId}>
                                        {site.siteName}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingSelectFinancialYear" label="Financial Year">
                            <Form.Select
                                name="fyear"
                                value={formData.fyear?.financialYearId || ''}
                                onChange={(e) => handleDropdownChange(e, financialYears)}
                            >
                                <option value="">Select Financial Year</option>
                                {financialYears.map((year) => (
                                    <option key={year.financialYearId} value={year.financialYearId}>
                                        {year.financialYear}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>

                {[
                    { name: 'salesChallanNo', label: 'Sales Challan No', type: 'number' },
                    { name: 'salesChallanPrefix', label: 'Sales Challan Prefix', type: 'text' },
                    { name: 'salesInvoiceNo', label: 'Sales Invoice No', type: 'number' },
                    { name: 'salesInvoicePrefix', label: 'Sales Invoice Prefix', type: 'text' },
                    { name: 'purchaseChallanNo', label: 'Purchase Challan No', type: 'number' },
                    { name: 'purchaseChallanPrefix', label: 'Purchase Challan Prefix', type: 'text' },
                    { name: 'salesReturnNo', label: 'Sales Return No', type: 'number' },
                    { name: 'salesReturnPrefix', label: 'Sales Return Prefix', type: 'text' },
                    { name: 'creditNoteNo', label: 'Credit Note No', type: 'number' },
                    { name: 'creditNotePrefix', label: 'Credit Note Prefix', type: 'text' },
                    { name: 'purchaseReturnChallanNo', label: 'Purchase Return Challan No', type: 'number' },
                    { name: 'purchaseReturnChallanPrefix', label: 'Purchase Return Challan Prefix', type: 'text' },
                    { name: 'orderFormNo', label: 'Order Form No', type: 'number' },
                    { name: 'orderFormPrefix', label: 'Order Form Prefix', type: 'text' },
                    { name: 'purchaseOrderNo', label: 'Purchase Order No', type: 'number' },
                    { name: 'purchaseOrderPrefix', label: 'Purchase Order Prefix', type: 'text' },
                    { name: 'processEntryNo', label: 'Process Entry No', type: 'number' },
                    { name: 'processEntryPrefix', label: 'Process Entry Prefix', type: 'text' },
                    { name: 'stockEntryNo', label: 'Stock Entry No', type: 'number' },
                    { name: 'stockEntryPrefix', label: 'Stock Entry Prefix', type: 'text' },
                    { name: 'stockConversionEntryNo', label: 'Stock Conversion Entry No', type: 'number' },
                    { name: 'stockConversionEntryPrefix', label: 'Stock Conversion Entry Prefix', type: 'text' },
                    { name: 'voucherEntryNo', label: 'Voucher Entry No', type: 'number' },
                    { name: 'voucherEntryPrefix', label: 'Voucher Entry Prefix', type: 'text' },
                    { name: 'cuttingEntryNo', label: 'Cutting Entry No', type: 'number' },
                    { name: 'cuttingEntryPrefix', label: 'Cutting Entry Prefix', type: 'text' },
                    { name: 'orderCancellationFormNo', label: 'Order Cancellation Form No', type: 'number' },
                    { name: 'orderCancellationFormPrefix', label: 'Order Cancellation Form Prefix', type: 'text' }
                ].map((field, index) => (
                    <Row className="mb-3" key={index}>
                        <Col md>
                            <FloatingLabel controlId={`floatingInputGrid${field.name}`} label={field.label}>
                                <Form.Control
                                    type={field.type}
                                    placeholder={field.label}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Col>
                        
                    </Row>
                ))}

                    <div className="submitButton">
                                        <Button type="submit">
                                            {isEditMode ? 'Save' : 'Save'}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        );
                    };

export default TransactionSettingsForm;