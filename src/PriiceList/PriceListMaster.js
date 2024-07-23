import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import '../Customer/CustomerMaster.css';
import PriceListForm from './PriceListForm';
import Customers from './PriceListCustomers';
import Items from './PriceListItems';
import RightSidebar from '../RightSidebar';
import PriceListGridView from './PriceListGridView';

const PriceListMaster = () => {
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showGridView, setShowGridView] = useState(false);

  const toggleGridView = () => {
    setShowGridView(!showGridView);
  };

  return (
    <div className="price-list-master">
      <div className="upper-half">
        <div className="header">
          <h1>Price List Master</h1>
        </div>
        <div className="content-with-sidebar">
          <div className="main-content">
            <PriceListForm initialData={selectedRowData}  />
          </div>
          <div className="right-sidebar">
            <RightSidebar toggleGridView={toggleGridView}/>
          </div>
        </div>
      </div>
      <div className="lower-half">
        {showGridView ? (
          <PriceListGridView setSelectedRowData={setSelectedRowData} />
        ) : (
          <div className="tabs">
            <NavLink
              to="customers"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('customers')}
            >
              Customer
            </NavLink>
            <NavLink
              to="items"
              className={({ isActive }) => (isActive ? 'active-tab' : '')}
              onClick={() => setSelectedTab('items')}
            >
              Items
            </NavLink>
          
            <Routes>
              <Route path="customers" element={<Customers />} />
              <Route path="items" element={<Items />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceListMaster;
