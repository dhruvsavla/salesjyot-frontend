// src/components/CustomerMaster.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import TaxForm from './TaxForm.js';
import RightSidebar from '../RightSidebar.js';
import TaxLedger from './TaxLedger.js';
import TaxGridView from './TaxGridView';

const TaxMaster = () => {
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
      <h1>Tax Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <TaxForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
        <div className="lower-half">
        {showGridView ? (
          <TaxGridView setSelectedRowData={setSelectedRowData} />
        ) : (
          <div className="tabs">
            <NavLink
              to="taxLedger"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('taxLedger')}
            >
              Tax Ledger
            </NavLink>
            
        
            <Routes>
              <Route path="taxLedger" element={<TaxLedger />} />
            </Routes>
          </div>
        )}
        </div>
      </div>

  );
};

export default TaxMaster;
