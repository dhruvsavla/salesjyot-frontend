import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.js';
import RackCurrentStock from './RackCurrentStock.js';
import RackGridView from './RackGridView.js'
import RackForm from './RackForm.js';
import RightSidebar from '../RightSidebar.js';

const RackMaster = () => {
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
      <h1>Rack Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <RackForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
  <div className="lower-half">
  {showGridView ? (
          <RackGridView setSelectedRowData={setSelectedRowData} />
        ) : (
    <div className="tabs">
      <NavLink to="current-stock" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('current-stock')}>
        Current Stock
      </NavLink>
      
          <Routes>
            <Route path="current-stock" element={<RackCurrentStock />} />
          </Routes>
        </div>
        )}
      </div>
    </div>
  );
};

export default RackMaster;
