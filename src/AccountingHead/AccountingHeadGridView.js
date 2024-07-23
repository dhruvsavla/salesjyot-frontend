import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DataTable from './AccountingHeadDataTable'; // Assuming this is where your BankDataTable component is located

const accountingHeadColumns = [
  { Header: 'Account Name', accessor: 'accountName' },
  { Header: 'Dsiplay Name', accessor: 'displayName' },
  { Header: 'Parent Account', accessor: 'parentAccount' },
  {
    Header: 'Display in Trial Balance',
    accessor: 'displayInTrialBalance',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
  },
  { Header: 'trial Balance Side', accessor: 'trialBalanceSide' },
  {
    Header: 'Display in P/L',
    accessor: 'displayInPnl',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
  },
  { Header: 'P/L side', accessor: 'pnlSide' },
];

const AccountingHeadGridView = ({ setSelectedRowData }) => {
  const [data, setData] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedAccountingHead, setSelectedAccountingHead] = useState(null); // Ensure selectedCustomer state is initialized properly

  const apiEndpoint = 'http://localhost:8080/api/accounting-heads';
  const deleteAPIEndpoint = 'http://localhost:8080/api/accounting-heads';

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
        stompClient.subscribe('/topic/accounting-heads', (message) => {
          const updatedData = JSON.parse(message.body);
          console.log('Received message:', updatedData);
          setData((prevData) => {
            const dataCopy = [...prevData];
            const index = dataCopy.findIndex(item => item.accountingHeadId === updatedData.accountingHeadId);
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
      const endpoint = `${apiEndpoint}/${updatedData.accountingHeadId}`;
      await axios.put(endpoint, updatedData);
      setData((prevData) => prevData.map(dataItem => dataItem.accountingHeadId === updatedData.accountingHeadId ? updatedData : dataItem));
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleRowSelect = (row) => {
    setSelectedAccountingHead(row.original); // Update selectedCustomer state with the clicked row's data
    setSelectedRowData(row.original);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Accounting Heads Grid View</h1>
      <DataTable
        columns={accountingHeadColumns}
        data={data}
        setSelectedRowData={setSelectedRowData}
        onRowClick={handleRowSelect} // Ensure this prop is correctly passed and used in DataTable
        selectedAccountingHead={selectedAccountingHead} // Pass selectedCustomer down to DataTable
        deleteAPIEndpoint={deleteAPIEndpoint}
        apiEndpoint={apiEndpoint}
        setData={setData}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default AccountingHeadGridView;
