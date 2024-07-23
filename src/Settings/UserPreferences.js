import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const UserPreferencesForm = () => {
    const user = useSelector((state) => state.user.user); // Get user from Redux

    const [validated, setValidated] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        userPreferencesId: '',
        viewDashboardOnStart: false,
        passwordExpiresInDays: 0,
        enableReminders: false
    });

    useEffect(() => {
        fetchSettingsData();
    }, []);

    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user-preferences');
            if (response.data && response.data.length > 0) {
                setFormData(response.data[0]);
                setIsEditMode(true);
                console.log('Fetched settings:', response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };
    

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
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
                await axios.put(`http://localhost:8080/api/user-preferences/${formData.userPreferencesId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/user-preferences', formDataWithMeta);
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
            <h1>User Preferences</h1>
        </div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="viewDashboardOnStart">
                    <Form.Check
                        type="checkbox"
                        label="View Dashboard on Start"
                        name="viewDashboardOnStart"
                        checked={formData.viewDashboardOnStart}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="passwordExpiresInDays">
                    <Form.Label>Password Expires in Days</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter password expiration days"
                        name="passwordExpiresInDays"
                        value={formData.passwordExpiresInDays}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="enableReminders">
                    <Form.Check
                        type="checkbox"
                        label="Enable Reminders"
                        name="enableReminders"
                        checked={formData.enableReminders}
                        onChange={handleChange}
                    />
                </Form.Group>


                <div className="submitButton">
                                        <Button type="submit">
                                            {isEditMode ? 'Save' : 'Save'}
                                        </Button>
                                    </div>
            </Form>
        </div>
    );
};

export default UserPreferencesForm;
