// src/components/CustomerMaster.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import AddSizeRangeForm from './AddSizeRangeForm.js';
import RightSidebar from '../RightSidebar.js';
import AddSizeRangeGridView from './AddSizeRangeGridView.js';
import AddSizeRangeItems from './AddSizeRangeItems.js';

const AddSizeRangeMaster = () => {
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
      <h1>Add Size Range Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <AddSizeRangeForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
        <div className="lower-half">
        {showGridView ? (
          <AddSizeRangeGridView setSelectedRowData={setSelectedRowData} />
        ) : (
          <div className="tabs">
            <NavLink
              to="addSizeRangeItems"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('addSizeRangeItems')}
            >
             Size Range Items
            </NavLink>
            
        
            <Routes>
              <Route path="addSizeRangeItems" element={<AddSizeRangeItems />} />
            </Routes>
          </div>
        )}
        </div>
      </div>

  );
};

export default AddSizeRangeMaster;
