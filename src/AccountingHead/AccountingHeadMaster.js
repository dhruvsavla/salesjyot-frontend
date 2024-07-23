import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import AccountingHeadForm from './AccountingHeadForm.js';
import AccountingHeadGridView from './AccountingHeadGridView.js';
import RightSidebar from '../RightSidebar.js';
import AccountingHeadTransactions from './AccountingHeadTransactions.js';

const AccountingHeadMaster = () => {
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
      <h1>Accounting Head Master</h1>
    </div>
    <div className="content-with-sidebar">
      <div className="main-content">
        <AccountingHeadForm initialData={selectedRowData}/>
      </div>
      <div className="right_sidebar">
        <RightSidebar toggleGridView={toggleGridView}/>
      </div>
    </div>
  </div>
  <div className="lower-half">
  {showGridView ? (
          <AccountingHeadGridView setSelectedRowData={setSelectedRowData} />
        ) : (
    <div className="tabs">
      <NavLink to="transactions" className={({ isActive }) => (isActive ? 'active-tab' : '')} onClick={() => setSelectedTab('transactions')}>
        Transactions
      </NavLink>
      
     
          <Routes>
            <Route path="transactions" element={<AccountingHeadTransactions />} />
          </Routes>
        </div>
        )}
      </div>
    </div>
  );
};

export default AccountingHeadMaster;
