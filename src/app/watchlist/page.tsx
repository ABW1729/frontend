"use client"
import React, { useState, useEffect } from 'react';
import { Button, Checkbox,Table,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import { getCookie,setCookie} from 'cookies-next';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from 'rsuite';
import { useRouter } from 'next/navigation';
import './loader.css'
interface Stock {
  id: number;
  name: string;
  symbol: string;
  price:string
}

function Watchlist() {
   let retry=0;
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
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
          body: JSON.stringify({ token:token }),
        });

        if (response.ok) {
          fetchStocksData();
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


 const handleTokenRefresh = async () => {
        const refreshToken = getCookie('refresh');
        try {
            const response = await fetch('https://backend-klm7.onrender.com/api/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                },
                body: JSON.stringify({ refresh: refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                setCookie('access_token', data.access, { expires: new Date(Date.now() + data.access_expiry * 1000) });
            } else {
                router.replace("/");
            }
        } catch (error) {
            console.error('Error:', error);
            router.replace("/");
        }
    };
    
  const fetchStocksData = async () => {
    try {
      const res = await fetch("https://backend-klm7.onrender.com/api/stocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      
      });

      if (res.status === 200) {
        const data = await res.json();
        setStocks(data.stocks);
        retry=0;
        }else if (res.status === 401 && retry<2) {
        retry++;
        await handleTokenRefresh(); // Trigger token refresh
        await fetchStocksData();
 
      } else {
        toast.error('Cannot fetch stocks');
         retry=0;
      }
     }catch (error) {
      console.error('Error:', error);
      retry=0;
    }
  };

  const handleRefresh = () => {
    fetchStocksData();
  };


  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

  const handleSelectAll = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allSelectedStocks = Object.keys(stocks);
      setSelectedStocks(allSelectedStocks);
    } else {
      setSelectedStocks([]);
    }
  };
  
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, symbol:string) => {
    if (event.target.checked) {
      setSelectedStocks(prevSelectedStocks => [...prevSelectedStocks, symbol]);
    } else {
      setSelectedStocks(prevSelectedStocks => prevSelectedStocks.filter(item => item !== symbol));
    }
  };

  const handleDeleteStock = async (stocks:Object) => {
    try {
      
      const res = await fetch("https://backend-klm7.onrender.com/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stocks: stocks }),
      });

      if (res.status === 200) {
        // Update stocks after successful deletion
        fetchStocksData();
        retry=0;
        toast.success('Stock deleted successfully');
      }else if (res.status === 401 && retry<2) {
        retry++;
        await handleTokenRefresh(); // Trigger token refresh
        await handleDeleteStock(selectedStocks)
        }else {
        toast.error('Unable to delete stock');
        retry=0;
      }
    } catch (error) {
      console.error('Error:', error);
      retry=0;
    }

    

    
   
    
  };

  return (
    (loading ? (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    ) :
    <>
      <Navbar />
      <div style={{ textAlign: 'center', margin: '10px auto', maxWidth: 'calc(80% + 20px)' }}>
      <div style={{ textAlign: 'center' }}>
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" onClick={handleRefresh}>Refresh</Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" onClick={() => handleDeleteStock(selectedStocks)}>Delete Selected Stocks</Button>
      </div>
    </div>
      <TableContainer component={Paper} style={{ margin: '10px auto', borderRadius: '10px', width: 'calc(100% - 20px)' }}>
        <Table style={{ minWidth: '80%' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedStocks.length > 0 && selectedStocks.length < Object.entries(stocks).length}
                  checked={selectedStocks.length === Object.entries(stocks).length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>Symbol</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(stocks).map(([symbol, stock]) => (
              <TableRow key={symbol}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStocks.includes(symbol)}
                    onChange={(event) => handleSelect(event, symbol)}
                  />
                </TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>{stock.name}</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>{symbol}</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>{stock.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </>)
  );
}

export default Watchlist;
