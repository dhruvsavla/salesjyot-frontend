import React from 'react';
import { FaCog } from 'react-icons/fa';
import { LuImport } from 'react-icons/lu';
import { FaFileExport } from 'react-icons/fa';
import { TbDatabaseExport } from 'react-icons/tb';
import { NavLink, useLocation } from 'react-router-dom';
import { PiListBold } from "react-icons/pi";
import * as XLSX from 'xlsx';
import './RightSidebar.css';

const RightSidebar = ({ toggleGridView }) => {
  const location = useLocation();

  const handleViewData = () => {
    toggleGridView(true); // Notify parent to toggle grid view
  };

  const handleDownload = () => {
    const currentPath = location.pathname;
    const downloadFunctions = {
      '/contacts': downloadContactsData,
      '/company': downloadCompanyData,
      '/customer': downloadCustomerData,
      '/priceList': downloadPriceListData,
      '/bank': downloadBankData,
      '/accounting-heads': downloadAccountingHeadData,
      '/addresses': downloadAddressData,
      '/add-size': downloadAddSizeData,
      '/add-sizeranges': downloadAddSizeRangeData,
      '/brands': downloadBrandData,
      '/financial-year': downloadFinancialYearData,
      '/hsn': downloadHSNData,
      '/rack': downloadRackData,
      '/tax': downloadTaxData,
      '/taxForm': downloadTaxFormData,
      '/site': downloadSiteData,
    };
    
    if (downloadFunctions[currentPath]) {
      downloadFunctions[currentPath]();
    }
  };

  const createExcelFile = (data, sheetName, fileName) => {
    const ws = XLSX.utils.json_to_sheet([data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  };

  const downloadRackData = () => {
    createExcelFile({ site: '', rackName: '' }, 'Rack Data', 'rack_format.xlsx');
  };

  const downloadTaxData = () => {
    createExcelFile({ taxName: '', displayName: '', taxPercentage: '' }, 'Tax Data', 'tax_format.xlsx');
  };

  const downloadTaxFormData = () => {
    createExcelFile({
      taxFormName: '', fromDate: '', toDate: '', minSales: '', maxSales: '', taxPct: '', taxMasters: '', hsns: ''
    }, 'Tax Form Data', 'tax_form_format.xlsx');
  };

  const downloadSiteData = () => {
    createExcelFile({
      siteName: '', siteCode: '', storesStock: '', hasTransactionNos: '', isPrimary: '', siteForStockKeeping: '', siteForTransactionNos: ''
    }, 'Site Data', 'site_format.xlsx');
  };

  const downloadAddSizeRangeData = () => {
    createExcelFile({ sizeRange: '', isPrimary: '' }, 'Add Size Range Data', 'sizeRange_format.xlsx');
  };

  const downloadBrandData = () => {
    createExcelFile({ brandName: '' }, 'Brand Data', 'brand_format.xlsx');
  };

  const downloadFinancialYearData = () => {
    createExcelFile({
      financialYear: '', startDate: '', endDate: '', isDefault: ''
    }, 'Financial Year Data', 'financial_year_format.xlsx');
  };

  const downloadHSNData = () => {
    createExcelFile({ hsnCode: '', hsnDescription: '' }, 'HSN Data', 'hsn_format.xlsx');
  };

  const downloadAddSizeData = () => {
    createExcelFile({ size: '', position: '' }, 'Add Size Data', 'size_format.xlsx');
  };

  const downloadAddressData = () => {
    createExcelFile({
      addressName: '', primary: '', line1: '', line2: '', city: '', state: '', country: '', pincode: '', area: '',
      landline: '', fax: '', email: '', defaultTax: '', vatNo: '', cstNo: '', tinNo: '', lbtNo: '', defaultTransport: ''
    }, 'Address Data', 'address_format.xlsx');
  };

  const downloadAccountingHeadData = () => {
    createExcelFile({
      accountName: '', displayName: '', parentAccount: '', displayInTrialBalance: '', trialBalanceSide: '',
      displayInPnl: '', pnlSide: ''
    }, 'Accounting Head Data', 'accounting_head_format.xlsx');
  };

  const downloadContactsData = () => {
    createExcelFile({
      customer: '', name: '', isPrimary: '', designation: '', addresses: '', landline: '', mobile: '', fax: '', email: ''
    }, 'Contact Data', 'contact_format.xlsx');
  };

  const downloadCompanyData = () => {
    createExcelFile({
      companyName: '', companyDescription: '', address: '', landline: '', fax: '', email: '', contactPersons: '',
      mobileNumber: '', vatNo: '', cstNo: '', tinNo: '', lbtNo: '', exciseNo: '', exciseChapHeading: '',
      exciseRange: '', exciseDivision: '', exciseCommissionerate: ''
    }, 'Company Data', 'company_format.xlsx');
  };

  const downloadCustomerData = () => {
    createExcelFile({
      customerName: '', contactName: '', contactEmail: '', contactPhone: ''
    }, 'Customer Data', 'customer_format.xlsx');
  };

  const downloadBankData = () => {
    createExcelFile({ companyName: '', bankName: '', accountNo: '' }, 'Bank Data', 'bank_format.xlsx');
  };

  const downloadPriceListData = () => {
    createExcelFile({ priceListName: '', isDefault: '' }, 'Price List Data', 'priceList_format.xlsx');
  };

  const SidebarItem = ({ to, onClick, icon: Icon, text }) => (
    <NavLink to={to} className="sidebar-link" onClick={onClick}>
      <div className="sidebar-item">
        <div>
          <Icon className="sidebar-icon" />
        </div>
        <span className="sidebar-text">{text}</span>
      </div>
    </NavLink>
  );

  return (
    <div className="right_sidebar">
      <SidebarItem to={location.pathname} icon={LuImport} text="Import Excel" />
      <SidebarItem to={location.pathname} onClick={handleDownload} icon={FaFileExport} text="Download Format" />
      <SidebarItem to={location.pathname} onClick={handleViewData} icon={PiListBold} text="View Data" />
      <SidebarItem to={location.pathname} icon={TbDatabaseExport} text="Export To Excel" />
      <SidebarItem to={location.pathname} icon={FaCog} text="Settings" />
    </div>
  );
};

export default RightSidebar;
