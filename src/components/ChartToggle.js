import React, { useState, useRef } from "react";
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
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the data labels plugin
import "./ChartToggle.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels // Register the data labels plugin
);

const ChartToggle = ({ raasData, rollupsData, sheetData }) => {
  const [chartType, setChartType] = useState("pie");
  const [dataType, setDataType] = useState("raas");
  const [minTx, setMinTx] = useState(0);
  const [maxTx, setMaxTx] = useState(Infinity);

  const chartRef = useRef(null); // Ref to access chart instance

  const colorMap = {
    Gelato: "#ff3b57",
    Conduit: "#46BDC6",
    Alchemy: "#4185F4",
    Caldera: "#EC6731",
    Altlayer: "#B28AFE",
  };

  let filteredRollupsLabels = [];
  let filteredRollupsDataValues = [];
  let filteredRollupsColors = [];

  Object.entries(rollupsData).forEach(([label, value]) => {
    if (value >= minTx && value <= maxTx) {
      filteredRollupsLabels.push(label);
      filteredRollupsDataValues.push(value);

      const rollup = sheetData.find((row) => row.name === label);
      const rollupRaas = rollup ? rollup.raas : null;
      filteredRollupsColors.push(colorMap[rollupRaas] || "#4185F4");
    }
  });

  let aggregatedRaasData = {};
  filteredRollupsLabels.forEach((label, index) => {
    const rollup = sheetData.find((row) => row.name === label);
    const rollupRaas = rollup ? rollup.raas : null;

    if (rollupRaas) {
      if (!aggregatedRaasData[rollupRaas]) {
        aggregatedRaasData[rollupRaas] = 0;
      }
      aggregatedRaasData[rollupRaas] += filteredRollupsDataValues[index];
    }
  });

  const filteredRaasLabels = Object.keys(aggregatedRaasData);
  const filteredRaasDataValues = Object.values(aggregatedRaasData);
  const filteredRaasBackgroundColors = filteredRaasLabels.map(
    (label) => colorMap[label] || "#000000"
  );

  const barRollupsData = {
    labels: filteredRollupsLabels,
    datasets: [
      {
        label: "Total Transactions by Rollups Name",
        data: filteredRollupsDataValues,
        backgroundColor: filteredRollupsColors,
        borderColor: filteredRollupsColors,
        borderWidth: 1,
      },
    ],
  };

  const pieRaasData = {
    labels: filteredRaasLabels,
    datasets: [
      {
        label: "Total Transactions by RaaS Provider",
        data: filteredRaasDataValues,
        backgroundColor: filteredRaasBackgroundColors,
        hoverOffset: 4,
      },
    ],
  };

  const barRaasData = {
    labels: filteredRaasLabels,
    datasets: [
      {
        label: "Total Transactions by RaaS Provider",
        data: filteredRaasDataValues,
        backgroundColor: filteredRaasBackgroundColors,
        borderColor: filteredRaasBackgroundColors,
        borderWidth: 1,
      },
    ],
  };

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
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (acc, val) => acc + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: "#fff",
        anchor: "end",
        align: "start",
        offset: 0,
      },
    },
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
  };

  const downloadChart = () => {
    const chartInstance = chartRef.current;
    const url = chartInstance.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = "chart.png";
    link.click();
  };

  return (
    <div className="chart-toggle-container">
      <div className="chart-toggle-dropdown">
        <label htmlFor="dataType">Select Data Type: </label>
        <select id="dataType" value={dataType} onChange={handleDataTypeChange}>
          <option value="raas">Total Transactions by RaaS Provider</option>
          <option value="rollups">Total Transactions by Rollups Name</option>
        </select>
      </div>

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
        {dataType === "raas" && (
          <>
            {chartType === "pie" ? (
              <Pie data={pieRaasData} options={pieOptions} ref={chartRef} />
            ) : (
              <Bar data={barRaasData} ref={chartRef} />
            )}
          </>
        )}

        {dataType === "rollups" && <Bar data={barRollupsData} ref={chartRef} />}
      </div>

      {/* Add the download button */}
      <button onClick={downloadChart} className="download-btn">
        Download Chart
      </button>
    </div>
  );
};

export default ChartToggle;
