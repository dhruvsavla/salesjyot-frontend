import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AccountingHeadForm = ({ initialData, onUpdate }) => {
  const [validated, setValidated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    displayName: '',
    parentAccount: '',
    displayInTrialBalance: false,
    trialBalanceSide: '',
    displayInPnl: false,
    pnlSide: '',
  });

  const [parentAccounts, setParentAccounts] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchParentAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/accounting-heads');
        setParentAccounts(response.data);
      } catch (error) {
        console.error('Error fetching parent accounts:', error);
      }
    };

    fetchParentAccounts();

    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      setIsEditMode(true);
    } else {
      setFormData({
        accountName: '',
        displayName: '',
        parentAccount: '',
        displayInTrialBalance: false,
        trialBalanceSide: '',
        displayInPnl: false,
        pnlSide: '',
      });
      setIsEditMode(false);
    }
  }, [initialData]);

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
      parentAccount: formData.parentAccount || null,
      createdBy: user,
      createdDate: currentDate,
    };

    try {
      if (isEditMode) {
        const response = await axios.put(`http://localhost:8080/api/accounting-heads/${formData.accountingHeadId}`, formDataWithMeta);
        console.log('Put successful with:', JSON.stringify(response.data));
        setIsEditMode(false);
      } else {
        const response = await axios.post('http://localhost:8080/api/accounting-heads', formDataWithMeta);
        console.log('Post successful with:', JSON.stringify(response.data));
      }
      setFormData({
        accountName: '',
        displayName: '',
        parentAccount: '',
        displayInTrialBalance: false,
        trialBalanceSide: '',
        displayInPnl: false,
        pnlSide: '',
      });
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  return (
    <div className="customer-form">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Account Name">
              <Form.Control
                type="text"
                placeholder="Account Name"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide an Account Name.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Display Name">
              <Form.Control
                type="text"
                placeholder="Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a Display Name.</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingSelectGrid" label="Parent Account">
              <Form.Select
                name="parentAccount"
                value={formData.parentAccount}
                onChange={handleChange}
              >
                <option value="">Select Parent Account</option>
                {parentAccounts.map(account => (
                  <option key={account.accountingHeadId} value={account.accountName}>
                    {account.accountName}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Trial Balance Side">
              <Form.Control
                type="text"
                placeholder="Trial Balance Side"
                name="trialBalanceSide"
                value={formData.trialBalanceSide}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <Form.Check
              type="checkbox"
              label="Display in Trial Balance"
              name="displayInTrialBalance"
              checked={formData.displayInTrialBalance}
              onChange={handleChange}
              className="mt-4"
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="P&L Side">
              <Form.Control
                type="text"
                placeholder="P&L Side"
                name="pnlSide"
                value={formData.pnlSide}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <Form.Check
              type="checkbox"
              label="Display in P&L"
              name="displayInPnl"
              checked={formData.displayInPnl}
              onChange={handleChange}
              className="mt-4"
            />
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

export default AccountingHeadForm;
