// src/components/CustomerMaster.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import AddSizeForm from './AddSizeForm.js';
import RightSidebar from '../RightSidebar.js';
import AddSizeGridView from './AddSizeGridView.js';

const AddSizeMaster = () => {
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
      <h1>Add Size Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <AddSizeForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
        <div className="lower-half">
        {showGridView ? (
          <AddSizeGridView setSelectedRowData={setSelectedRowData} />
        ) : (
          <div className="tabs">

          </div>
        )}
        </div>
      </div>

  );
};

export default AddSizeMaster;
