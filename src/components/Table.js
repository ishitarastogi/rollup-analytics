import React, { useState, useEffect } from "react";
import {
  fetchGoogleSheetData,
  fetchBlockExplorerData,
} from "../services/fetchGoogleSheetData";
import FilterBar from "./FilterBar";
import ChartToggle from "./ChartToggle"; // Import the ChartToggle component
import "./Table.css";

const Table = () => {
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rollups: "",
    frameworks: "",
    das: "",
    verticals: "",
    raasProviders: "",
    l2OrL3: "",
    dateRange: "All",
  });

  const [uniqueOptions, setUniqueOptions] = useState({
    rollups: [],
    frameworks: [],
    das: [],
    verticals: [],
    raasProviders: [],
    l2OrL3: [],
  });

  const [raasData, setRaasData] = useState({});

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
        const l2OrL3 = [...new Set(initialData.map((row) => row.l2OrL3))];

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

        // Calculate the sum of total transactions for each RaaS provider
        const raasTransactionSums = updatedData.reduce((acc, row) => {
          if (!row.totalTransactions || row.totalTransactions === "--")
            return acc;
          const totalTransactions = Number(row.totalTransactions);
          acc[row.raas] = (acc[row.raas] || 0) + totalTransactions;
          return acc;
        }, {});

        setRaasData(raasTransactionSums);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
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
        (!filters.raasProviders || row.raas === filters.raasProviders) &&
        (!filters.l2OrL3 || row.l2OrL3 === filters.l2OrL3)
      );
    });
  };

  if (loading) {
    return <div className="loading-message">Loading data, please wait...</div>;
  }

  return (
    <div>
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
              </tr>
            </thead>
            <tbody>
              {filterData(sheetData).map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.launchDate}</td>
                  <td>--</td>
                  <td>{row.tvl || "--"}</td>
                  <td>{row.totalTransactions}</td>
                  <td>{row.totalAddresses}</td>
                  <td>{row.last30DaysTxCount}</td>
                  <td>{row.framework}</td>
                  <td>{row.da}</td>
                  <td>{row.vertical}</td>
                  <td>{row.raas}</td>
                  <td>{row.l2OrL3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Adding the ChartToggle component here */}
      <ChartToggle raasData={raasData} />
    </div>
  );
};

export default Table;
