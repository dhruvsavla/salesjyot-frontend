import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DataTable from './DataTable';

const companyColumns = [
  { Header: 'Company Name', accessor: 'companyName' },
  { Header: 'Company description', accessor: 'companyDescription' },
  { Header: 'Address', accessor: 'address' },
  { Header: 'Landline', accessor: 'landline' },
  { Header: 'Fax', accessor: 'fax' },
  { Header: 'Mobile', accessor: 'mobileNumber' },
  { Header: 'Email', accessor: 'email' },
  { Header: 'Contact persons', accessor: 'contactPersons' },
  { Header: 'VAT No', accessor: 'vatNo' },
  { Header: 'CST No', accessor: 'cstNo' },
  { Header: 'TIN No', accessor: 'tinNo' },
  { Header: 'Excise No', accessor: 'exciseNo' },
  { Header: 'Excise Chap Heading', accessor: 'exciseChapHeading' },
  { Header: 'Excise Range', accessor: 'exciseRange' },
  { Header: 'Excise Division', accessor: 'exciseDivision' },
  { Header: 'Excise Commissionerate', accessor: 'exciseCommiissionerate' },
];

const CompanyGridView = ({ setSelectedRowData }) => {
  const [data, setData] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null); // Ensure selectedCustomer state is initialized properly

  const apiEndpoint = 'http://localhost:8080/api/companies';
  const deleteAPIEndpoint = 'http://localhost:8080/api/companies';

  const fetchData = async () => {
    try {
      const response = await axios.get(apiEndpoint);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket server');
        setConnected(true);
        stompClient.subscribe('/topic/companies', (message) => {
          const updatedData = JSON.parse(message.body);
          console.log('Received message:', updatedData);
          setData((prevData) => {
            const dataCopy = [...prevData];
            const index = dataCopy.findIndex(item => item.companyId === updatedData.companyId);
            if (index !== -1) {
              dataCopy[index] = updatedData;
            } else {
              dataCopy.push(updatedData);
            }
            return dataCopy;
          });
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket server');
        setConnected(false);
      },
      onStompError: (error) => {
        console.error('Error in STOMP protocol', error);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        console.log('WebSocket client deactivated');
      }
    };
  }, []);

  const handleUpdate = async (updatedData) => {
    try {
      const endpoint = `${apiEndpoint}/${updatedData.companyId}`;
      await axios.put(endpoint, updatedData);
      setData((prevData) => prevData.map(dataItem => dataItem.companyId === updatedData.companyId ? updatedData : dataItem));
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleRowSelect = (row) => {
    setSelectedCompany(row.original); // Update selectedCustomer state with the clicked row's data
    setSelectedRowData(row.original);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Company Grid View</h1>
      <DataTable
        columns={companyColumns}
        data={data}
        setSelectedRowData={setSelectedRowData}
        onRowClick={handleRowSelect} // Ensure this prop is correctly passed and used in DataTable
        selectedCompany={selectedCompany} // Pass selectedCustomer down to DataTable
        deleteAPIEndpoint={deleteAPIEndpoint}
        apiEndpoint={apiEndpoint}
        setData={setData}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default CompanyGridView;
