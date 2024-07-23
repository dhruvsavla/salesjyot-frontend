import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.js';
import SiteUsers from './SiteUsers.js';
import SiteCurrentStock from './SiteCurrentStock.js';
import SiteGridView from './SiteGridView.js'
import SiteForm from './SiteForm.js';
import RightSidebar from '../RightSidebar.js';

const SiteMaster = () => {
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
      <h1>Site Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <SiteForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
  <div className="lower-half">
  {showGridView ? (
          <SiteGridView setSelectedRowData={setSelectedRowData} />
        ) : (
    <div className="tabs">
      <NavLink to="users" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('users')}>
        Users
      </NavLink>
      <NavLink to="current-stock" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('current-stock')}>
        Current Stock
      </NavLink>
      
          <Routes>
            <Route path="users" element={<SiteUsers />} />
            <Route path="current-stock" element={<SiteCurrentStock />} />
          </Routes>
        </div>
        )}
      </div>
    </div>
  );
};

export default SiteMaster;
