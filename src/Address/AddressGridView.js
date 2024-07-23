//addSizeId
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DataTable from './AddressDataTable';

const addressColumns = [
  { Header: 'Address Name', accessor: 'addressName' },
  {
    Header: 'Is Primary',
    accessor: 'isPrimary',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
  },
  {Header: 'Line 1', accessor: 'line1'},
  {Header: 'Line 2', accessor: 'line2'},
  {Header: 'City', accessor: 'city'},
  {Header: 'State', accessor: 'state'},
  {Header: 'Country', accessor: 'country'},
  {Header: 'Pincode', accessor: 'pincode'},
  {Header: 'Area', accessor: 'area'},
  {Header: 'LandLine', accessor: 'landline'},
  {Header: 'Fax', accessor: 'fax'},
  {Header: 'Email', accessor: 'email'},
  {Header: 'Default Tax', accessor: 'defaultTax.taxName'},
  {Header: 'VAT No', accessor: 'vatNo'},
  {Header: 'CST No', accessor: 'cstNo'},
  {Header: 'TIN No', accessor: 'tinNo'},
  {Header: 'LBT No', accessor: 'lbtNo'},
  {Header: 'Default Transport', accessor: 'defaultTransport'},
 
];

const AddressGridView = ({ setSelectedRowData }) => {
  const [data, setData] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); // Ensure selectedCustomer state is initialized properly

  const apiEndpoint = 'http://localhost:8080/api/addresses';
  const deleteAPIEndpoint = 'http://localhost:8080/api/addresses';

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
        stompClient.subscribe('/topic/addresses', (message) => {
          const updatedData = JSON.parse(message.body);
          console.log('Received message:', updatedData);
          setData((prevData) => {
            const dataCopy = [...prevData];
            const index = dataCopy.findIndex(item => item.addressId === updatedData.addressId);
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
      const endpoint = `${apiEndpoint}/${updatedData.addressId}`;
      await axios.put(endpoint, updatedData);
      setData((prevData) => prevData.map(dataItem => dataItem.addressId === updatedData.addressId ? updatedData : dataItem));
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleRowSelect = (row) => {
    setSelectedAddress(row.original); // Update selectedCustomer state with the clicked row's data
    setSelectedRowData(row.original);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Address Grid View</h1>
      <DataTable
        columns={addressColumns}
        data={data}
        setSelectedRowData={setSelectedRowData}
        onRowClick={handleRowSelect} // Ensure this prop is correctly passed and used in DataTable
        selectedAddress={selectedAddress} // Pass selectedCustomer down to DataTable
        deleteAPIEndpoint={deleteAPIEndpoint}
        apiEndpoint={apiEndpoint}
        setData={setData}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default AddressGridView;
