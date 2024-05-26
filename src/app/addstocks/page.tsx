"use client"
import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, Typography, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import "react-toastify/dist/ReactToastify.css";
import './loader.css';
import { getCookie, setCookie } from 'cookies-next'; // Import functions to set and get cookies

interface Stock {
  name: string;
  symbol: string;
}


const StocksTable= () => {
  let retry=0;
    const stocks = [
        { id: 1, name: 'Apple Inc.', symbol: 'AAPL' },
        { id: 2, name: 'Alphabet Inc.', symbol: 'GOOGL' },
        { id: 3, name: 'Microsoft Corporation', symbol: 'MSFT' },
        { id: 4, name: 'Amazon.com Inc.', symbol: 'AMZN' },
        { id: 5, name: 'Facebook Inc.', symbol: 'FB' },
        { id: 6, name: 'Tesla Inc.', symbol: 'TSLA' },
        { id: 7, name: 'NVIDIA Corporation', symbol: 'NVDA' },
        { id: 8, name: 'JPMorgan Chase & Co.', symbol: 'JPM' },
        { id: 9, name: 'Visa Inc.', symbol: 'V' },
        { id: 10, name: 'The Walt Disney Company', symbol: 'DIS' },
        { id: 11, name: 'Netflix Inc.', symbol: 'NFLX' },
        { id: 12, name: 'Intel Corporation', symbol: 'INTC' },
        { id: 13, name: 'PayPal Holdings Inc.', symbol: 'PYPL' },
        { id: 14, name: 'Salesforce.com Inc.', symbol: 'CRM' },
        { id: 15, name: 'Alibaba Group Holding Limited', symbol: 'BABA' },
        { id: 16, name: 'The Boeing Company', symbol: 'BA' },
        { id: 17, name: 'The Home Depot Inc.', symbol: 'HD' },
        { id: 18, name: 'Adobe Inc.', symbol: 'ADBE' },
        { id: 19, name: 'The Goldman Sachs Group Inc.', symbol: 'GS' },
        { id: 20, name: 'Starbucks Corporation', symbol: 'SBUX' },
        { id: 21, name: 'NIKE Inc.', symbol: 'NKE' },
        { id: 22, name: 'Airbnb Inc.', symbol: 'ABNB' },
        { id: 23, name: 'ServiceNow Inc.', symbol: 'NOW' },
        { id: 24, name: 'Costco Wholesale Corporation', symbol: 'COST' },
        { id: 25, name: 'AT&T Inc.', symbol: 'T' },
        { id: 26, name: 'The Coca-Cola Company', symbol: 'KO' },
        { id: 27, name: 'Walmart Inc.', symbol: 'WMT' },
        { id: 28, name: 'McDonald\'s Corporation', symbol: 'MCD' },
        { id: 29, name: 'Chevron Corporation', symbol: 'CVX' },
        { id: 30, name: 'PepsiCo Inc.', symbol: 'PEP' },
    ];
    
     const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const token = getCookie('access');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch('https://backend-klm7.onrender.com/api/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({token: token }),
        });

        if (response.ok) {
          setLoading(false);
        } else {
          router.replace('/');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (!token) {
      router.replace('/');
    } else {
      checkToken();
    }
  }, [token, router]);
  
   const handleAddSelectedStocks = async () => {
    try {
      const response = await fetch('https://backend-klm7.onrender.com/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stocks: selectedStocks }),
      });

      if (response.ok) {
        toast.success('Stocks added successfully');
        retry=0;
      } else if (response.status === 401 && retry<2) {
        retry++;
        await handleTokenRefresh(); // Trigger token refresh
        await handleAddSelectedStocks(); // Retry original request
      } else {
        const data = await response.json();
        toast.error(data.message);
        retry=0;
      }
    } catch (error) {
      console.error('Error:', error);
      retry=0;
    }
  };

  const handleTokenRefresh = async () => {
             const refreshToken = getCookie('refresh');   
 try {
      const response = await fetch('https://backend-klm7.onrender.com/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
     
        setCookie('token', data.access_token); // Update token in cookies
      } else {
        // Handle refresh token failure (e.g., redirect to login page)
        router.replace("/");
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle refresh token failure (e.g., redirect to login page)
      router.replace("/");
    }
  };


 const [selectedStocks, setSelectedStocks] = useState<{ [key: string]: Stock }>({});

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const allSelectedStocks: { [key: string]: Stock } = {};
        stocks.forEach(stock => {
          allSelectedStocks[stock.symbol] = { name: stock.name, symbol: stock.symbol };
        });
        setSelectedStocks(allSelectedStocks);
      } else {
        setSelectedStocks({});
      }
    };
    
    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, symbol: string) => {
      setSelectedStocks(prevSelectedStocks => {
        const isSelected = prevSelectedStocks.hasOwnProperty(symbol);
        if (isSelected) {
          const { [symbol]: removedStock, ...rest } = prevSelectedStocks;
          return rest;
        } else {
          const selectedStock = stocks.find(stock => stock.symbol === symbol);
          if (selectedStock) {
            return { ...prevSelectedStocks, [symbol]: selectedStock };
          } else {
            return prevSelectedStocks;
          }
        }
      });
    };
    
      return (
   
    (loading ?  (<div className="loader-container">
    <div className="loader"></div>
  </div>) :
    <>
    <Navbar></Navbar>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button variant="contained" onClick={handleAddSelectedStocks} sx={{ borderRadius: '10px', padding: '10px 20px', margin: '10px', width: '80%', maxWidth: '400px' }}>
        Add Selected Stocks
      </Button>
      <TableContainer component={Paper} sx={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '20px', width: '80%' }}>
        <Table sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={Object.keys(selectedStocks).length > 0 && Object.keys(selectedStocks).length < stocks.length}
                  checked={Object.keys(selectedStocks).length === stocks.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Name</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Symbol</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStocks.hasOwnProperty(stock.symbol)}
                    onChange={(event) => handleSelect(event, stock.symbol)}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold', padding: '8px', fontSize: '14px' }}>{stock.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold', padding: '8px', fontSize: '14px' }}>{stock.symbol}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </>)
    )
    };

export default StocksTable;
