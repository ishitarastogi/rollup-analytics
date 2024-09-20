// Table.js
import React, { useState, useEffect } from "react";
import {
  fetchGoogleSheetData,
  fetchBlockExplorerData,
} from "../services/fetchGoogleSheetData";
import FilterBar from "./FilterBar";
import ChartToggle from "./ChartToggle";
import ChartToggleAddresses from "./ChartToggleAddresses";
import { FaCog } from "react-icons/fa"; // Import settings icon
import "./Table.css";

const Table = () => {
  // **State Variables**
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

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    launchDate: true,
    tps: false,
    tvl: true,
    totalTransactions: true,
    totalAddresses: true,
    transactionsToday: true,
    last30DaysTxCount: true,
    l2OrL3: true,
    settlement: true,
    framework: false,
    da: false,
    vertical: false,
    raas: false,
  });

  // State for toggling the settings modal
  const [showSettings, setShowSettings] = useState(false);

  // Data for charts
  const [raasData, setRaasData] = useState({});
  const [rollupsData, setRollupsData] = useState({});
  const [addressesData, setAddressesData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const initialData = await fetchGoogleSheetData();
        setSheetData(initialData);

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

        const raasTransactionSums = updatedData.reduce((acc, row) => {
          if (!row.totalTransactions || row.totalTransactions === "--")
            return acc;
          const totalTransactions = Number(row.totalTransactions);
          acc[row.raas] = (acc[row.raas] || 0) + totalTransactions;
          return acc;
        }, {});

        const rollupsTransactionSums = updatedData.reduce((acc, row) => {
          if (!row.totalTransactions || row.totalTransactions === "--")
            return acc;
          const totalTransactions = Number(row.totalTransactions);
          acc[row.name] = (acc[row.name] || 0) + totalTransactions;
          return acc;
        }, {});

        const addressesTransactionSums = updatedData.reduce((acc, row) => {
          if (!row.totalAddresses || row.totalAddresses === "--") return acc;
          const totalAddresses = Number(row.totalAddresses);
          acc[row.name] = (acc[row.name] || 0) + totalAddresses;
          return acc;
        }, {});

        setRaasData(raasTransactionSums);
        setRollupsData(rollupsTransactionSums);
        setAddressesData(addressesTransactionSums);
        setLoading(false); // <-- Move setLoading(false) here
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    getData();
  }, []);

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (num === "--" || isNaN(num)) return "--";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  };

  // Updated filterData function with date range filtering
  const filterData = (data) => {
    return data.filter((row) => {
      const now = new Date();
      const launchDate = new Date(row.launchDate);
      let dateMatch = true;

      if (filters.dateRange !== "All") {
        const timeDiff = now - launchDate;
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = oneDay * 7;
        const oneMonth = oneDay * 30;
        const threeMonths = oneDay * 90;
        const oneYear = oneDay * 365;

        switch (filters.dateRange) {
          case "1W":
            dateMatch = timeDiff <= oneWeek;
            break;
          case "1M":
            dateMatch = timeDiff <= oneMonth;
            break;
          case "3M":
            dateMatch = timeDiff <= threeMonths;
            break;
          case "1Y":
            dateMatch = timeDiff <= oneYear;
            break;
          default:
            dateMatch = true;
        }
      }

      return (
        dateMatch &&
        (!filters.rollups || row.name === filters.rollups) &&
        (!filters.frameworks || row.framework === filters.frameworks) &&
        (!filters.das || row.da === filters.das) &&
        (!filters.verticals || row.vertical === filters.verticals) &&
        (!filters.raasProviders || row.raas === filters.raasProviders) &&
        (!filters.l2OrL3 || row.l2OrL3 === filters.l2OrL3)
      );
    });
  };

  const filteredData = filterData(sheetData);

  // Determine if any row has L2/L3 as 'L3' to conditionally display the Settlement column
  const hasL3 = filteredData.some((row) => row.l2OrL3 === "L3");

  // Prepare data for charts
  const filteredRollupsData = filteredData.reduce((acc, row) => {
    if (!row.totalTransactions || row.totalTransactions === "--") return acc;
    const totalTransactions = Number(row.totalTransactions);
    acc[row.name] = totalTransactions;
    return acc;
  }, {});

  const filteredAddressesData = filteredData.reduce((acc, row) => {
    if (!row.totalAddresses || row.totalAddresses === "--") return acc;
    const totalAddresses = Number(row.totalAddresses);
    acc[row.name] = totalAddresses;
    return acc;
  }, {});

  if (loading) {
    return <div className="loading-message">Loading data, please wait...</div>;
  }

  const columnKeys = [
    "name",
    "launchDate",
    "tps",
    "tvl",
    "totalTransactions",
    "totalAddresses",
    "transactionsToday",
    "last30DaysTxCount",
    "l2OrL3",
    "settlement",
    "framework",
    "da",
    "vertical",
    "raas",
  ];

  return (
    <div>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        uniqueOptions={uniqueOptions}
        setShowSettings={setShowSettings}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Column Settings</h2>
            {columnKeys.map((columnKey) => (
              <label key={columnKey}>
                <input
                  type="checkbox"
                  checked={columnVisibility[columnKey]}
                  onChange={() =>
                    setColumnVisibility({
                      ...columnVisibility,
                      [columnKey]: !columnVisibility[columnKey],
                    })
                  }
                />
                {columnKey === "l2OrL3"
                  ? "L2/L3"
                  : columnKey.charAt(0).toUpperCase() +
                    columnKey.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
            ))}
            <button
              className="close-button"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="scrollable-table">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table>
            <thead>
              <tr>
                {columnVisibility.name && <th>Rollups Name</th>}
                {columnVisibility.launchDate && <th>Launch Date</th>}
                {columnVisibility.tps && <th>TPS</th>}
                {columnVisibility.tvl && <th>TVL</th>}
                {columnVisibility.totalTransactions && (
                  <th>Total Transactions</th>
                )}
                {columnVisibility.totalAddresses && <th>Total Addresses</th>}
                {columnVisibility.transactionsToday && (
                  <th>Daily Transactions</th>
                )}
                {columnVisibility.last30DaysTxCount && <th>30 Day Tx Count</th>}
                {columnVisibility.l2OrL3 && <th>L2/L3</th>}
                {hasL3 && columnVisibility.settlement && <th>Settlement</th>}
                {columnVisibility.framework && <th>Framework</th>}
                {columnVisibility.da && <th>DA</th>}
                {columnVisibility.vertical && <th>Vertical</th>}
                {columnVisibility.raas && <th>RaaS Provider</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {columnVisibility.name && <td>{row.name}</td>}
                  {columnVisibility.launchDate && <td>{row.launchDate}</td>}
                  {columnVisibility.tps && <td>--</td>}
                  {columnVisibility.tvl && <td>{row.tvl || "--"}</td>}
                  {columnVisibility.totalTransactions && (
                    <td>{formatNumber(Number(row.totalTransactions))}</td>
                  )}
                  {columnVisibility.totalAddresses && (
                    <td>{formatNumber(Number(row.totalAddresses))}</td>
                  )}
                  {columnVisibility.transactionsToday && (
                    <td>{formatNumber(Number(row.transactionsToday))}</td>
                  )}
                  {columnVisibility.last30DaysTxCount && (
                    <td>{formatNumber(Number(row.last30DaysTxCount))}</td>
                  )}
                  {columnVisibility.l2OrL3 && <td>{row.l2OrL3}</td>}
                  {hasL3 && columnVisibility.settlement && (
                    <td>{row.l2OrL3 === "L3" ? row.settlement : "--"}</td>
                  )}
                  {columnVisibility.framework && <td>{row.framework}</td>}
                  {columnVisibility.da && <td>{row.da}</td>}
                  {columnVisibility.vertical && <td>{row.vertical}</td>}
                  {columnVisibility.raas && <td>{row.raas}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="charts-container">
        <ChartToggle
          raasData={raasData}
          rollupsData={filteredRollupsData}
          sheetData={sheetData}
        />

        <ChartToggleAddresses
          raasData={raasData}
          rollupsData={filteredAddressesData}
          sheetData={sheetData}
        />
      </div>
    </div>
  );
};

export default Table;
