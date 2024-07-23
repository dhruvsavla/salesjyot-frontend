import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import FinancialYearGridView from './FinancialYearGridView.js';
import FinancialYearForm from './FinancialYearForm.js';
import FYClosingOutstanding from './FYClosingOutstanding.js';
import FYClosingPnL from './FYClosingPnL.js';
import FYClosingStockAmt from './FYClosingStockAmt.js';
import FYClosingStockQty from './FYClosingStockQty.js';
import RightSidebar from '../RightSidebar.js';

const FinancialYearMaster = () => {
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
      <h1>Financial Year Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <FinancialYearForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
  <div className="lower-half">
  {showGridView ? (
          <FinancialYearGridView setSelectedRowData={setSelectedRowData} />
        ) : (
    <div className="tabs">
      <NavLink to="closingStockQty" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('closingStockQty')}>
        Closing Stock Qty
      </NavLink>
      <NavLink to="closingStockAmt" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('closingStockAmt')}>
        Closing Stock Amt
      </NavLink>
      <NavLink to="closingOutstanding" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('closingOutstanding')}>
        Closing OutStanding
      </NavLink>
      <NavLink to="closingPnL" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('closingPnL')}>
        Closing P & L
      </NavLink>
     
          <Routes>
            <Route path="closingStockQty" element={<FYClosingStockQty />} />
            <Route path="closingStockAmt" element={<FYClosingStockAmt />} />
            <Route path="closingOutstanding" element={<FYClosingOutstanding />} />
            <Route path="closingPnL" element={<FYClosingPnL />} />
          </Routes>
        </div>
        )}
      </div>
    </div>
  );
};

export default FinancialYearMaster;
