import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "./ChartToggle.css"; // Import the CSS file here

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ChartToggle = ({ raasData, rollupsData }) => {
  const [chartType, setChartType] = useState("pie");
  const [dataType, setDataType] = useState("raas"); // State to switch between RaaS and Rollups chart
  const [minTx, setMinTx] = useState(0); // State for minimum transactions filter
  const [maxTx, setMaxTx] = useState(Infinity); // State for maximum transactions filter

  // Mapping the correct color to each RaaS provider
  const colorMap = {
    Gelato: "#ff3b57",
    Conduit: "#46BDC6",
    Alchemy: "#4185F4",
    Caldera: "#EC6731",
    Altlayer: "#B28AFE",
  };

  // Prepare data for the RaaS Provider chart (pie/bar)
  const raasLabels = Object.keys(raasData);
  const raasDataValues = Object.values(raasData);
  const raasBackgroundColors = raasLabels.map(
    (label) => colorMap[label] || "#000000"
  );

  // Prepare data for the Rollups Name chart (bar)
  let filteredRollupsLabels = [];
  let filteredRollupsDataValues = [];

  Object.entries(rollupsData).forEach(([label, value]) => {
    if (value >= minTx && value <= maxTx) {
      filteredRollupsLabels.push(label);
      filteredRollupsDataValues.push(value);
    }
  });

  // Bar chart data for Rollups Name
  const barRollupsData = {
    labels: filteredRollupsLabels,
    datasets: [
      {
        label: "Total Transactions by Rollups Name",
        data: filteredRollupsDataValues,
        backgroundColor: filteredRollupsLabels.map(
          (label) => colorMap[label] || "#4185F4"
        ), // Apply platform colors
        borderColor: filteredRollupsLabels.map(
          (label) => colorMap[label] || "#4185F4"
        ),
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for RaaS Provider
  const pieRaasData = {
    labels: raasLabels,
    datasets: [
      {
        label: "Total Transactions by RaaS Provider",
        data: raasDataValues,
        backgroundColor: raasBackgroundColors, // Apply the mapped colors
        hoverOffset: 4,
      },
    ],
  };

  // Bar chart data for RaaS Provider
  const barRaasData = {
    labels: raasLabels,
    datasets: [
      {
        label: "Total Transactions by RaaS Provider",
        data: raasDataValues,
        backgroundColor: raasBackgroundColors,
        borderColor: raasBackgroundColors,
        borderWidth: 1,
      },
    ],
  };

  // Add options for pie chart to show percentage distribution
  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce(
              (acc, val) => acc + val,
              0
            );
            const percentage = ((context.raw / total) * 100).toFixed(2);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
  };

  return (
    <div className="chart-toggle-container">
      {/* Dropdown for selecting between RaaS and Rollups data */}
      <div className="chart-toggle-dropdown">
        <label htmlFor="dataType">Select Data Type: </label>
        <select id="dataType" value={dataType} onChange={handleDataTypeChange}>
          <option value="raas">Total Transactions by RaaS Provider</option>
          <option value="rollups">Total Transactions by Rollups Name</option>
        </select>
      </div>

      {/* Show Pie/Bar chart selector only if RaaS is selected */}
      {dataType === "raas" && (
        <div className="chart-toggle-dropdown">
          <label htmlFor="chartType">Select Chart Type: </label>
          <select
            id="chartType"
            value={chartType}
            onChange={handleChartTypeChange}
          >
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      )}

      {/* Show filters only for Rollups chart */}
      {dataType === "rollups" && (
        <div className="rollup-filters">
          <label htmlFor="minTx">Min Transactions: </label>
          <input
            type="number"
            id="minTx"
            value={minTx === Infinity ? "" : minTx}
            onChange={(e) =>
              setMinTx(e.target.value ? parseInt(e.target.value) : 0)
            }
          />
          <label htmlFor="maxTx">Max Transactions: </label>
          <input
            type="number"
            id="maxTx"
            value={maxTx === Infinity ? "" : maxTx}
            onChange={(e) =>
              setMaxTx(e.target.value ? parseInt(e.target.value) : Infinity)
            }
          />
        </div>
      )}

      <div className="chart-wrapper">
        {/* Show RaaS chart (Pie or Bar) */}
        {dataType === "raas" && (
          <>
            {chartType === "pie" ? (
              <Pie data={pieRaasData} options={pieOptions} />
            ) : (
              <Bar data={barRaasData} />
            )}
          </>
        )}

        {/* Show Rollups chart (only Bar) */}
        {dataType === "rollups" && <Bar data={barRollupsData} />}
      </div>
    </div>
  );
};

export default ChartToggle;
