import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import CompanyForm from '../Company/CompanyForm';
import RightSidebar from '../RightSidebar';
import CompanyGridView from '../Company/CompanyGridView';
import Contacts from '../Customer/CustomerContacts';
import Addresses from '../Customer/CustomerAddresses';
import Websites from '../Customer/CustomerWebsites';
import Orders from '../Customer/CustomerOrders';
import Bills from '../Customer/CustomerBills';
import GR from '../Customer/CustomerGR';
import Payments from '../Customer/CustomerPayments';
import OutStandingBills from '../Customer/CustomerOutStandingBills';
import Ledger from '../Customer/CustomerLedger';
import Attachments from '../Customer/CustomerAttachments';

const CompanyMaster = () => {
  const [showGridView, setShowGridView] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  
  const toggleGridView = () => {
    setShowGridView(!showGridView);
  };

  return (
    <div className="customer-master">
      <div className="upper-half">
        <div className="header">
          <h1>Company Master</h1>
        </div>
        <div className="content-with-sidebar">
          <div className="main-content">
            <CompanyForm initialData={selectedRowData} />
          </div>
          <div className="right_sidebar">
            <RightSidebar toggleGridView={toggleGridView} />
          </div>
        </div>
      </div>
      <div className="lower-half">
        {showGridView ? (
          <CompanyGridView setSelectedRowData={setSelectedRowData} />
        ) : (
          <div className="tabs">
            <NavLink to="contacts" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Contacts
            </NavLink>
            <NavLink to="addresses" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Addresses
            </NavLink>
            <NavLink to="websites" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Websites
            </NavLink>
            <NavLink to="orders" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Orders
            </NavLink>
            <NavLink to="bills" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Bills
            </NavLink>
            <NavLink to="gr" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              GR
            </NavLink>
            <NavLink to="payments" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Payments
            </NavLink>
            <NavLink to="outstandingbills" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Outstanding Bills
            </NavLink>
            <NavLink to="ledger" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Ledger
            </NavLink>
            <NavLink to="attachments" className={({ isActive }) => (isActive ? 'active-tab' : '')}>
              Attachments
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyMaster;
