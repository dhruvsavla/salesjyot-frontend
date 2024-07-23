import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import ContactsForm from './ContactsForm.js';
import RightSidebar from '../RightSidebar';
import ContactSMS from './ContactSMS.js';
import ContactEmail from './ContactEmail.js';
import ContactsGridView from './ContactsGridView.js';

const Contacts = () => {
  const [showGridView, setShowGridView] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedTab, setSelectedTab] = useState('');

  const toggleGridView = () => {
    setShowGridView(!showGridView);
  };

  return (
    <div className="customer-master">
      <div className="upper-half">
        <div className="header">
          <h1>Contacts </h1>
        </div>
        <div className="content-with-sidebar">
          <div className="main-content">
            <ContactsForm initialData={selectedRowData} />
          </div>
          <div className="right_sidebar">
            <RightSidebar toggleGridView={toggleGridView} />
          </div>
        </div>
      </div>
      <div className="lower-half">
        {showGridView ? (
          <ContactsGridView setSelectedRowData={setSelectedRowData} />
        ) : (
    <div className="tabs">
      <NavLink to="sms" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('sms')}>
        SMS
      </NavLink>
      <NavLink to="email" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('email')}>
        Email
      </NavLink>

          <Routes>
            <Route path="sms" element={<ContactSMS />} />
            <Route path="email" element={<ContactEmail />} />
          </Routes>
          </div>
        )}
        </div>
      </div>

);
};

export default Contacts;
