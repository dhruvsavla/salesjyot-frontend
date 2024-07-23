import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DataTable from './SiteDataTable'; // Assuming this is where your BankDataTable component is located

const siteColumns = [
  { Header: 'Site Name', accessor: 'siteName' },
  { Header: 'Site Code', accessor: 'siteCode' },
  { Header: 'Site For Stock Keeping', accessor: 'siteForStockKeeping' },
  { Header: 'Site For Transaction Numbers', accessor: 'siteForTransactionNos' },
  {
    Header: 'Stores Stock',
    accessor: 'storesStock',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
  },
  {
    Header: 'Is Primary',
    accessor: 'isPrimary',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
  },
  {
    Header: 'Has Transaction Nos',
    accessor: 'hasTransactionNos',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
  },
];

const SiteGridView = ({ setSelectedRowData }) => {
  const [data, setData] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null); // Ensure selectedCustomer state is initialized properly

  const apiEndpoint = 'http://localhost:8080/api/sites';
  const deleteAPIEndpoint = 'http://localhost:8080/api/sites';

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
        stompClient.subscribe('/topic/sites', (message) => {
          const updatedData = JSON.parse(message.body);
          console.log('Received message:', updatedData);
          setData((prevData) => {
            const dataCopy = [...prevData];
            const index = dataCopy.findIndex(item => item.siteId === updatedData.siteId);
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
      const endpoint = `${apiEndpoint}/${updatedData.siteId}`;
      await axios.put(endpoint, updatedData);
      setData((prevData) => prevData.map(dataItem => dataItem.siteId === updatedData.siteId ? updatedData : dataItem));
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleRowSelect = (row) => {
    setSelectedSite(row.original); // Update selectedCustomer state with the clicked row's data
    setSelectedRowData(row.original);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Site Grid View</h1>
      <DataTable
        columns={siteColumns}
        data={data}
        setSelectedRowData={setSelectedRowData}
        onRowClick={handleRowSelect} // Ensure this prop is correctly passed and used in DataTable
        selectedSite={selectedSite} // Pass selectedCustomer down to DataTable
        deleteAPIEndpoint={deleteAPIEndpoint}
        apiEndpoint={apiEndpoint}
        setData={setData}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default SiteGridView;
