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
    l2OrL3: "", // New filter for L2/L3
    dateRange: "", // Default to empty string for showing all
  });

  const [uniqueOptions, setUniqueOptions] = useState({
    rollups: [],
    frameworks: [],
    das: [],
    verticals: [],
    raasProviders: [],
    l2OrL3: [], // Unique values for L2/L3
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const initialData = await fetchGoogleSheetData();
        setSheetData(initialData);
        setLoading(false);
        setError(null);

        const rollups = [...new Set(initialData.map((row) => row.name))];
        const frameworks = [
          ...new Set(initialData.map((row) => row.framework)),
        ];
        const das = [...new Set(initialData.map((row) => row.da))];
        const verticals = [...new Set(initialData.map((row) => row.vertical))];
        const raasProviders = [...new Set(initialData.map((row) => row.raas))];
        const l2OrL3 = [...new Set(initialData.map((row) => row.l2OrL3))]; // L2/L3 values

        setUniqueOptions({
          rollups,
          frameworks,
          das,
          verticals,
          raasProviders,
          l2OrL3,
        });

        const updatedData = await Promise.all(
          initialData.map(async (row) => {
            const updatedRow = await fetchBlockExplorerData(row);
            return updatedRow;
          })
        );
        setSheetData(updatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    getData();
  }, []);

  // Get the date range limit based on the selected date range
  const getDateRangeLimit = () => {
    if (!filters.dateRange) return null; // Show all data if no date range selected

    const now = new Date();
    switch (filters.dateRange) {
      case "1W":
        return new Date(now.setDate(now.getDate() - 7));
      case "1M":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "3M":
        return new Date(now.setMonth(now.getMonth() - 3));
      case "1Y":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  const filterData = (data) => {
    const dateRangeLimit = getDateRangeLimit();

    return data.filter((row) => {
      const rowDate = new Date(row.launchDate);

      return (
        (!filters.rollups || row.name === filters.rollups) &&
        (!filters.frameworks || row.framework === filters.frameworks) &&
        (!filters.das || row.da === filters.das) &&
        (!filters.verticals || row.vertical === filters.verticals) &&
        (!filters.raasProviders || row.raas === filters.raasProviders) &&
        (!filters.l2OrL3 || row.l2OrL3 === filters.l2OrL3) && // L2/L3 filter logic
        (!dateRangeLimit || rowDate >= dateRangeLimit)
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
        uniqueOptions={uniqueOptions}
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
                <th>L2/L3</th>
                {filters.l2OrL3 === "L3" && <th>Settlement when L3</th>}{" "}
                {/* Conditionally render column */}
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
                  <td>{row.l2OrL3}</td>
                  {filters.l2OrL3 === "L3" && (
                    <td>{row.settlementWhenL3}</td>
                  )}{" "}
                  {/* Show L3 settlement if L3 */}
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
