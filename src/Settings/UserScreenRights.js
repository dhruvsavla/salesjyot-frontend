import React, { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import './Settings.css';
import { useSelector } from 'react-redux';

const UserScreenRightsForm = () => {
    const user = useSelector((state) => state.user.user); // Get user from Redux

    const [validated, setValidated] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        id: null,
        site: null,
        user: null,
        screen: '',
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
        canPrint: false,
        canExport: false,
    });
    const [sites, setSites] = useState([]);
    const [users, setUsers] = useState([]);

    const screenOptions = ['tax', 'customer', 'company', 'site', 'rack', 'hsn'];

    useEffect(() => {
        fetchRightsData();
        fetchSites();
        fetchUsers();
    }, []);

    const fetchRightsData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user-screen-rights');
            if (response.data && response.data.length > 0) {
                setFormData(response.data[0]);
                setIsEditMode(true);
                console.log('Fetched rights:', response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching rights:', error);
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

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
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
        const selectedOption = name === 'site' ? sites.find(s => s.siteId === parseInt(value)) :
                              users.find(u => u.userId === parseInt(value));
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
            if (isEditMode && formData.id) {
                response = await axios.put(`http://localhost:8080/api/user-screen-rights/${formData.id}`, formData);
                console.log('Put successful with:', response.data);
            } else {
                response = await axios.post('http://localhost:8080/api/user-screen-rights', formDataWithMeta);
                console.log('Post successful with:', response.data);
            }
            setSuccessMessage('Rights saved successfully!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            fetchRightsData();
        } catch (error) {
            console.error('Error saving rights:', error);
            setSuccessMessage('Error saving the rights.');
        }
    };

    return (
        <div className="companySettingForm">
            <div className="companySettingHeader">
                <h1>User Screen Rights</h1>
            </div>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
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
                        <FloatingLabel controlId="floatingSelectUser" label="User">
                            <Form.Select
                                name="user"
                                value={formData.user?.id || ''}
                                onChange={handleDropdownChange}
                            >
                                <option value="">Select User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.userName}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="floatingSelectScreen" label="Screen">
                            <Form.Select
                                name="screen"
                                value={formData.screen}
                                onChange={handleChange}
                            >
                                <option value="">Select Screen</option>
                                {screenOptions.map((screen) => (
                                    <option key={screen} value={screen}>{screen}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <Form.Check 
                            type="checkbox"
                            label="Can View"
                            name="canView"
                            checked={formData.canView}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md>
                        <Form.Check 
                            type="checkbox"
                            label="Can Add"
                            name="canAdd"
                            checked={formData.canAdd}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md>
                        <Form.Check 
                            type="checkbox"
                            label="Can Edit"
                            name="canEdit"
                            checked={formData.canEdit}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md>
                        <Form.Check 
                            type="checkbox"
                            label="Can Delete"
                            name="canDelete"
                            checked={formData.canDelete}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <Form.Check 
                            type="checkbox"
                            label="Can Print"
                            name="canPrint"
                            checked={formData.canPrint}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md>
                        <Form.Check 
                            type="checkbox"
                            label="Can Export"
                            name="canExport"
                            checked={formData.canExport}
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

export default UserScreenRightsForm;
