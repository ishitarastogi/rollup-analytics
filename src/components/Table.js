import React, { useState, useEffect } from "react";
import {
  fetchGoogleSheetData,
  fetchBlockExplorerData,
} from "../services/fetchGoogleSheetData";
import "./Table.css";

const Table = () => {
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const getData = async () => {
      try {
        // First, fetch Google Sheets data and display it immediately
        const initialData = await fetchGoogleSheetData();
        setSheetData(initialData);
        setLoading(false); // Data has been loaded
        setError(null); // Clear any previous errors

        // Then, fetch block explorer data in the background
        const updatedData = await Promise.all(
          initialData.map(async (row) => {
            const updatedRow = await fetchBlockExplorerData(row);
            return updatedRow;
          })
        );
        setSheetData(updatedData); // Update table with block explorer data
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading on error
        setError("Failed to fetch data. Please try again later.");
      }
    };

    getData();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading data, please wait...</div>;
  }

  return (
    <div className="scrollable-table">
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rollups Name</th>
              <th>Launch Date</th>
              <th>TPS</th> {/* Placeholder */}
              <th>TVL</th> {/* New TVL Column */}
              <th>Total Transactions</th>
              <th>Total Addresses</th>
              <th>30 Day Tx Count</th> {/* Placeholder */}
              <th>Framework</th>
              <th>DA</th>
              <th>Vertical</th>
              <th>RaaS Provider</th>
            </tr>
          </thead>
          <tbody>
            {sheetData.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.launchDate}</td>
                <td>--</td> {/* Placeholder */}
                <td>{row.tvl || "--"}</td> {/* Display TVL */}
                <td>{row.totalTransactions}</td>
                <td>{row.totalAddresses}</td>
                <td>{row.last30DaysTxCount}</td>
                <td>{row.framework}</td>
                <td>{row.da}</td>
                <td>{row.vertical}</td>
                <td>{row.raas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
