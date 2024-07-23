import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DataTable from './ProductDataTable'; // Assume this is a generic data table component

const productColumns = [
    { Header: 'Product Name', accessor: 'productName' },
    { Header: 'Color', accessor: 'color' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Average Price', accessor: 'avgPrice' },
    { Header: 'Average MRP', accessor: 'avgMrp' },
    { Header: 'Average Cost', accessor: 'avgCost' },
    { Header: 'Supplier', accessor: 'supplier.customerName' },
    { Header: 'Supplier Product Name', accessor: 'supplierProductName' },
    { Header: 'Supplier Product Color', accessor: 'supplierProductColor' },
    { Header: 'Per Box', accessor: 'perBox' },
    { Header: 'Unit', accessor: 'unit' },
    { Header: 'Taxes Included', accessor: 'taxesIncluded', Cell: ({ value }) => (value ? 'Yes' : 'No') },
    { Header: 'Size Range', accessor: 'addSizeRange.sizeRange' },  // Assuming `AddSizeRange` has a `rangeName` property
    { Header: 'Available Sizes', accessor: 'available_sizes', Cell: ({ value }) => value.map(available_sizes => available_sizes.size).join(', ') }  // Assuming `AddSize` has a `sizeName` property
  ];
  

const ProductGridView = ({ setSelectedRowData }) => {
  const [data, setData] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const apiEndpoint = 'http://localhost:8080/api/products';
  const deleteAPIEndpoint = 'http://localhost:8080/api/products';

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
        stompClient.subscribe('/topic/products', (message) => {
          const updatedData = JSON.parse(message.body);
          console.log('Received message:', updatedData);
          setData((prevData) => {
            const dataCopy = [...prevData];
            const index = dataCopy.findIndex(item => item.productId === updatedData.productId);
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
      const endpoint = `${apiEndpoint}/${updatedData.productId}`;
      await axios.put(endpoint, updatedData);
      setData((prevData) => prevData.map(dataItem => dataItem.productId === updatedData.productId ? updatedData : dataItem));
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleRowSelect = (row) => {
    setSelectedProduct(row.original);
    setSelectedRowData(row.original);
  };

  return (
    <div>
    <h1 style={{ textAlign: "center" }}>Product Grid View</h1>
      <DataTable
        columns={productColumns}
        data={data}
        setSelectedRowData={setSelectedRowData}
        onRowClick={handleRowSelect}
        selectedProduct={selectedProduct}
        deleteAPIEndpoint={deleteAPIEndpoint}
        apiEndpoint={apiEndpoint}
        setData={setData}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default ProductGridView;
