import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './CustomerMaster.css';
import CustomerGridView from './CustomerGridView.js';
import CustomerForm from './CustomerForm';
import Contacts from './CustomerContacts.js';
import Addresses from './CustomerAddresses.js';
import Websites from './CustomerWebsites.js';
import Orders from './CustomerOrders.js';
import Bills from './CustomerBills.js';
import GR from './CustomerGR.js';
import Payments from './CustomerPayments.js'
import OutStandingBills from './CustomerOutStandingBills.js';
import Ledger from './CustomerLedger.js';
import Attachments from './CustomerAttachments.js';
import RightSidebar from '../RightSidebar.js';

const CustomerMaster = () => {
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
      <h1>Customer Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <CustomerForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
  <div className="lower-half">
  {showGridView ? (
          <CustomerGridView setSelectedRowData={setSelectedRowData} />
        ) : (
    <div className="tabs">
      <NavLink to="contacts" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('contacts')}>
        Contacts
      </NavLink>
      <NavLink to="addresses" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('addresses')}>
        Addresses
      </NavLink>
      <NavLink to="websites" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('websites')}>
        Websites
      </NavLink>
      <NavLink to="orders" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('orders')}>
        Orders
      </NavLink>
      <NavLink to="bills" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('bills')}>
        Bills
      </NavLink>
      <NavLink to="gr" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('gr')}>
        GR
      </NavLink>
      <NavLink to="payments" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('payments')}>
        Payments
      </NavLink>
      <NavLink to="outstandingbills" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('outstandingbills')}>
        Outstanding Bills
      </NavLink>
      <NavLink to="ledger" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('ledger')}>
        Ledger
      </NavLink>
      <NavLink to="attachments" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('attachments')}>
        Attachments
      </NavLink>
          <Routes>
            <Route path="contacts" element={<Contacts />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="websites" element={<Websites />} />
            <Route path="orders" element={<Orders />} />
            <Route path="bills" element={<Bills />} />
            <Route path="gr" element={<GR />} />
            <Route path="payments" element={<Payments />} />
            <Route path="outstandingbills" element={<OutStandingBills />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="attachments" element={<Attachments />} />
          </Routes>
        </div>
        )}
      </div>
    </div>
  );
};

export default CustomerMaster;
