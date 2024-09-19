// src/components/Charts.js
import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import "./Charts.css";
import TotalTransactionsChart from "./TotalTransactionsChart";
import ThirtyDayTransactionsChart from "./ThirtyDayTransactionsChart";
import TotalAddressesChart from "./TotalAddressesChart";
import MetricsTable from "./MetricsTable";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Charts = () => {
  const [selectedCharts, setSelectedCharts] = useState({
    totalTransactions: "pie",
    thirtyDayTransactions: "pie",
    totalAddresses: "pie",
  });

  const handleChartTypeChange = (metric, chartType) => {
    setSelectedCharts((prev) => ({ ...prev, [metric]: chartType }));
  };

  return (
    <div className="charts-section">
      <div className="chart-container">
        <h3>Total Transactions</h3>
        <select
          onChange={(e) =>
            handleChartTypeChange("totalTransactions", e.target.value)
          }
        >
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
        <TotalTransactionsChart chartType={selectedCharts.totalTransactions} />
      </div>
      <div className="chart-container">
        <h3>30-Day Transaction Count</h3>
        <select
          onChange={(e) =>
            handleChartTypeChange("thirtyDayTransactions", e.target.value)
          }
        >
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
        <ThirtyDayTransactionsChart
          chartType={selectedCharts.thirtyDayTransactions}
        />
      </div>
      <div className="chart-container">
        <h3>Total Addresses</h3>
        <select
          onChange={(e) =>
            handleChartTypeChange("totalAddresses", e.target.value)
          }
        >
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
        <TotalAddressesChart chartType={selectedCharts.totalAddresses} />
      </div>
      <div className="chart-container">
        <h3>Metrics Table</h3>
        <MetricsTable />
      </div>
    </div>
  );
};

export default Charts;
