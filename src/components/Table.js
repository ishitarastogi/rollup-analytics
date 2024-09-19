import React, { useState, useEffect } from "react";
import {
  fetchGoogleSheetData,
  fetchBlockExplorerData,
} from "../services/fetchGoogleSheetData";
import FilterBar from "./FilterBar"; // Import the FilterBar component
import "./Table.css";

const Table = () => {
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filters, setFilters] = useState({
    rollups: "",
    frameworks: "",
    das: "",
    verticals: "",
    raasProviders: "",
    dateRange: "1W", // Add a dateRange filter
  });

  const [uniqueOptions, setUniqueOptions] = useState({
    rollups: [],
    frameworks: [],
    das: [],
    verticals: [],
    raasProviders: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        // First, fetch Google Sheets data and display it immediately
        const initialData = await fetchGoogleSheetData();
        setSheetData(initialData);
        setLoading(false); // Data has been loaded
        setError(null); // Clear any previous errors

        // Extract unique values for filters
        const rollups = [...new Set(initialData.map((row) => row.name))];
        const frameworks = [
          ...new Set(initialData.map((row) => row.framework)),
        ];
        const das = [...new Set(initialData.map((row) => row.da))];
        const verticals = [...new Set(initialData.map((row) => row.vertical))];
        const raasProviders = [...new Set(initialData.map((row) => row.raas))];

        setUniqueOptions({
          rollups,
          frameworks,
          das,
          verticals,
          raasProviders,
        });

        // Then, fetch block explorer data in the background
        const updatedData = await Promise.all(
          initialData.map(async (row) => {
            const updatedRow = await fetchBlockExplorerData(row);
            return updatedRow;
          })
        );
        setSheetData(updatedData); // Update table with block explorer and TVL data
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading on error
        setError("Failed to fetch data. Please try again later.");
      }
    };

    getData();
  }, []);

  const filterData = (data) => {
    return data.filter((row) => {
      return (
        (!filters.rollups || row.name === filters.rollups) &&
        (!filters.frameworks || row.framework === filters.frameworks) &&
        (!filters.das || row.da === filters.das) &&
        (!filters.verticals || row.vertical === filters.verticals) &&
        (!filters.raasProviders || row.raas === filters.raasProviders)
      );
    });
  };

  if (loading) {
    return <div className="loading-message">Loading data, please wait...</div>;
  }

  return (
    <div>
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        uniqueOptions={uniqueOptions} // Ensure it's not undefined
      />

      <div className="scrollable-table">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rollups Name</th>
                <th>Launch Date</th>
                <th>TPS</th>
                <th>TVL</th>
                <th>Total Transactions</th>
                <th>Total Addresses</th>
                <th>30 Day Tx Count</th>
                <th>Framework</th>
                <th>DA</th>
                <th>Vertical</th>
                <th>RaaS Provider</th>
              </tr>
            </thead>
            <tbody>
              {filterData(sheetData).map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.launchDate}</td>
                  <td>--</td> {/* Placeholder for TPS */}
                  <td>{row.tvl || "--"}</td> {/* Display fetched TVL */}
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
    </div>
  );
};

export default Table;
