import React from 'react';
import './App.css';
import Sidebar from './Sidebar.js';
import CustomerMaster from './Customer/CustomerMaster.js';
import PriceListMaster from './PriiceList/PriceListMaster.js';
import CompanyMaster from './Company/CompanyMaster.js';
import Contacts from './Contact/Contacts.js';
import BankMaster from './Bank/BankMaster.js';
import Home from './Home.js';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import LoginPage from './Logiin/LoginPage.js';
import SignupPage from './Logiin/SignupPage.js';
import HSNMaster from './HSN/HSNMaster.js'
import TaxMaster from './Tax/TaxMaster.js';
import SiteMaster from './Site/SiteMaster.js';
import RackMaster from './Rack/RackMaster.js';
import FinancialYearForm from './FinancialYear/FinancialYearForm.js';
import FinancialYearMaster from './FinancialYear/FinancialYearMaster.js';
import CompanySetting from './Settings/CompanySetting.js';
import AccountingHeadMaster from './AccountingHead/AccountingHeadMaster.js';
import AddSizeRangeMaster from './AddSizeRange/AddSizeRangeMaster.js';
import AddSizeMaster from './AddSize/AddSizeMaster.js';
import SiteWiseSettingsForm from './Settings/SiteWiseSettings.js';
import BrandMaster from './Brand/BrandMaster.js';
import MonthWiseSettingForm from './Settings/MonthWiseSetting.js';
import TransactionSettingsForm from './Settings/TransactionSetting.js';
import UserPreferencesForm from './Settings/UserPreferences.js';
import UserScreenRightsForm from './Settings/UserScreenRights.js';
import AddressMaster from './Address/AddressMaster.js';
import TaxFormMaster from './TaxForm/TaxFormMaster.js';
import SizeAliasMaster from './SizeAlias/SizeAliasMaster.js';
import ProductMaster from './Product/ProductMaster.js';

function App() {
  return (
    <div className="App">
      <Router>
        <MainContent />
      </Router>
    </div>
  );
}

function MainContent() {
  const location = useLocation(); // Define useLocation hook here
  const noSidebarRoutes = ['/', '/signUpPage'];

  return (
    <>
      {!noSidebarRoutes.includes(location.pathname) && <Sidebar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signUpPage" element={<SignupPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/customer/*" element={<CustomerMaster />} />
        <Route path="/company/*" element={<CompanyMaster />} />
        <Route path="/priceList/*" element={<PriceListMaster />} />
        <Route path="/contacts/*" element={<Contacts />} />
        <Route path="/bank/*" element={<BankMaster />} />
        <Route path="/hsn/*" element={<HSNMaster />} />
        <Route path="/tax/*" element={<TaxMaster />} />
        <Route path="/site/*" element={<SiteMaster />} />
        <Route path="/rack/*" element={<RackMaster />} />
        <Route path="/financial-year/*" element={<FinancialYearMaster />} />
        <Route path="/company-settings/*" element = {<CompanySetting/>} />
        <Route path="/accounting-heads/*" element = {<AccountingHeadMaster/>} />
        <Route path="/add-size/*" element = {<AddSizeMaster/>} />
        <Route path="/add-sizeranges/*" element = {<AddSizeRangeMaster/>} />
        <Route path="/site-settings/*" element = {<SiteWiseSettingsForm/>} />
        <Route path="/brands/*" element = {<BrandMaster/>} />
        <Route path="/monthwise-setting/*" element = {<MonthWiseSettingForm/>} />
        <Route path="/transaction-setting/*" element = {<TransactionSettingsForm/>} />
        <Route path="/user-preferences/*" element = {<UserPreferencesForm/>} />
        <Route path="/user-screen-rights/*" element={<UserScreenRightsForm/>} />
        <Route path="/addresses/*" element={<AddressMaster/>} />
        <Route path="/taxForm/*" element={<TaxFormMaster/>} />
        <Route path="/size-alias/*" element={<SizeAliasMaster/>} />
        <Route path="/product/*" element={<ProductMaster/>} />
      </Routes>
    </>
  );
}

export default App;
