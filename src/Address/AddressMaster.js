// src/components/CustomerMaster.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import AddressForm from './AddressForm.js';
import RightSidebar from '../RightSidebar.js';
import AddressGridView from './AddressGridView.js';
import AddressContacts from './AddressContacts.js';
import AddressOrders from './AddressOrders.js';
import AddressBills from './AddressBills.js';
import AddressGR from './AddressGR.js';
import AddressPayments from './AddressPayments.js';
import AddressOutStandingBills from './AddrressOutStandingBills.js';
import AddressAttachments from './AddressAttachments.js';
import AddressSiteTaxForm from './AddressSiteTaxForm.js';

const AddressMaster = () => {
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showGridView, setShowGridView] = useState(false);

  const toggleGridView = () => {
    setShowGridView(!showGridView);
  };

  return (

      <div className="customer-master">
        <div className="upper-half">
    <div className="header">
      <h1>Address Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <AddressForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
        <div className="lower-half">
        {showGridView ? (
          <AddressGridView setSelectedRowData={setSelectedRowData} />
        ) : (
          <div className="tabs">
            <NavLink
              to="addressContacts"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addressContacts')}
            >
             Address Contacts
            </NavLink>
            <NavLink
              to="addressOrders"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addressOrders')}
            >
             Address Orders
            </NavLink>
            <NavLink
              to="addressBills"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addressBills')}
            >
             Address Bills 
            </NavLink>
            <NavLink
              to="addressGR"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addressGR')}
            >
            Address GR
            </NavLink>
            <NavLink
              to="addressPayments"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addressPayments')}
            >
             Address Payments
            </NavLink>
            <NavLink
              to="addressOutStandingBills"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addressOutStandingBills')}
            >
             Address OutStanding Bills
            </NavLink>
            <NavLink
              to="addressAttachments"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addressAttachments')}
            >
             Address Attachments
            </NavLink>
            <NavLink
              to="addressSiteTaxForm"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addressSiteTaxForm')}
            >
             Address Site Tax Form
            </NavLink>
            
        
            <Routes>
              <Route path="addressContacts" element={<AddressContacts />} />
              
              <Route path="addressOrders" element={<AddressOrders />} />

              <Route path="addressBills" element={<AddressBills />} />

              <Route path="addressGR" element={<AddressGR />} />

              <Route path="addressPayments" element={<AddressPayments />} />

              <Route path="addressOutStandingBills" element={<AddressOutStandingBills />} />

              <Route path="addressAttachments" element={<AddressAttachments />} />

              <Route path="addressSiteTaxForm" element={<AddressSiteTaxForm />} />

            </Routes>
          </div>
        )}
        </div>
      </div>

  );
};

export default AddressMaster;
