// src/components/CustomerMaster.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import TaxFormForm from './TaxFormForm.js';
import RightSidebar from '../RightSidebar.js';
import TaxFormGridView from './TaxFormGridView';

const TaxFormMaster = () => {
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
      <h1>Tax Form</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <TaxFormForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
        <div className="lower-half">
        {showGridView ? (
          <TaxFormGridView setSelectedRowData={setSelectedRowData} />
        ) : (
          <div className="tabs">
           
            
        
           
          </div>
        )}
        </div>
      </div>

  );
};

export default TaxFormMaster;
