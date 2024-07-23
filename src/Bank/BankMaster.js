// src/components/CustomerMaster.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import BankForm from '../Bank/BankForm.js';
import Customers from '../PriiceList/PriceListCustomers.js';
import Items from '../PriiceList/PriceListItems.js';
import RightSidebar from '../RightSidebar.js';
import BankLedger from '../Bank/BankLedger.js';
import BankGridView from './BankGridView';

const BankMaster = () => {
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
      <h1>Bank Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <BankForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
        <div className="lower-half">
        {showGridView ? (
          <BankGridView setSelectedRowData={setSelectedRowData} />
        ) : (
          <div className="tabs">
            <NavLink
              to="bankLedger"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('bankLedger')}
            >
              Bank Ledger
            </NavLink>
            
        
            <Routes>
              <Route path="bankLedger" element={<BankLedger />} />
            </Routes>
          </div>
        )}
        </div>
      </div>

  );
};

export default BankMaster;
