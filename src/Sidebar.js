import React, { useState } from 'react';
import { FaHome, FaUserAlt, FaCog } from 'react-icons/fa';
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FaBusinessTime } from "react-icons/fa";
import { RiContactsBook3Fill } from "react-icons/ri";
import { BiSolidBank } from "react-icons/bi";
import { PiWarehouseFill } from "react-icons/pi";
import { HiReceiptTax } from "react-icons/hi";
import { GiMoneyStack } from "react-icons/gi";

const Sidebar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showMasters, setShowMasters] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(prevState => !prevState);
  };

  const handleMastersClick = () => {
    setShowMasters(prevState => !prevState);
  };

  return (
    <div className="sidebar">
      <NavLink to="/home" className="sidebar-link" activeClassName="active-sidebar-link">
        <div className="sidebar-item">
          <div>
            <PiWarehouseFill className="sidebar-icon" />
          </div>
          <span className="sidebar-text">Home</span>
        </div>
      </NavLink>
      <div className="sidebar-link" onClick={handleMastersClick}>
        <div className="sidebar-item">
          <div>
            <FaUserAlt className="sidebar-icon" />
          </div>
          <span className="sidebar-text">Masters</span>
        </div>
      </div>
      {showMasters && (
        <div className="settings-list">
          <NavLink to="/customer" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Customer</span>
            </div>
          </NavLink>
          <NavLink to="/company" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Company</span>
            </div>
          </NavLink>
          <NavLink to="/tax" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Tax</span>
            </div>
          </NavLink>
          <NavLink to="/taxForm" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Tax Form</span>
            </div>
          </NavLink>
          <NavLink to="/priceList" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Price List</span>
            </div>
          </NavLink>
          <NavLink to="/hsn" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">HSN</span>
            </div>
          </NavLink>
          <NavLink to="/contacts" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Contacts</span>
            </div>
          </NavLink>
          <NavLink to="/bank" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Bank</span>
            </div>
          </NavLink>
          <NavLink to="/site" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Site</span>
            </div>
          </NavLink>
          <NavLink to="/rack" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Rack</span>
            </div>
          </NavLink>
          <NavLink to="/financial-year" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Financial Year</span>
            </div>
          </NavLink>
          <NavLink to="/accounting-heads" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Accounting Heads</span>
            </div>
          </NavLink>
          <NavLink to="/add-size" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Add Size</span>
            </div>
          </NavLink>
          <NavLink to="/add-sizeranges" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Size Range</span>
            </div>
          </NavLink>
          <NavLink to="/brands" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Brand</span>
            </div>
          </NavLink>
          <NavLink to="/addresses" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Address</span>
            </div>
          </NavLink>
          <NavLink to="/size-alias" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Size Alias</span>
            </div>
          </NavLink>
          <NavLink to="/product" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Product</span>
            </div>
          </NavLink>
        </div>
      )}
      
      <div className="sidebar-link" onClick={handleSettingsClick}>
        <div className="sidebar-item">
          <div>
            <FaCog className="sidebar-icon" />
          </div>
          <span className="sidebar-text">Settings</span>
        </div>
      </div>
      {showSettings && (
        <div className="settings-list">
          <NavLink to="/company-settings" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Company Settings</span>
            </div>
          </NavLink>
          <NavLink to="/site-settings" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Site Settings</span>
            </div>
          </NavLink>
          <NavLink to="/monthwise-setting" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Monthwise Settings</span>
            </div>
          </NavLink>
          <NavLink to="/transaction-setting" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">Transaction Settings</span>
            </div>
          </NavLink>
          <NavLink to="/user-preferences" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">User Preferences</span>
            </div>
          </NavLink>
          <NavLink to="/user-screen-rights" className="sidebar-link" activeClassName="active-sidebar-link">
            <div className="sidebar-item">
              <span className="sidebar-text">User Screen Rights</span>
            </div>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
