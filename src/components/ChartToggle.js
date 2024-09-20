// ChartToggle.js
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FaDownload } from "react-icons/fa"; // Import the download icon
import "./ChartToggle.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

const ChartToggle = ({ raasData, rollupsData, sheetData }) => {
  const [chartType, setChartType] = useState("pie");
  const [dataType, setDataType] = useState("raas");
  const [minTx, setMinTx] = useState(0);
  const [maxTx, setMaxTx] = useState(Infinity);
  const chartRef = useRef(null);

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

  const createGradient = (ctx, chartArea, color) => {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    return gradient;
  };

  const barRollupsData = {
    labels: filteredRollupsLabels,
    datasets: [
      {
        label: "Total Transactions by Rollups Name",
        data: filteredRollupsDataValues,
        backgroundColor: function (context) {
          const { chart, dataIndex } = context;
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          const color = filteredRollupsColors[dataIndex];

          if (!chartArea) {
            // Chart hasn't been drawn yet
            return color;
          }

          return createGradient(ctx, chartArea, color);
        },
        borderColor: filteredRollupsColors,
        borderWidth: 2,
        barThickness: 4,
        hoverBackgroundColor: filteredRollupsColors.map((color) =>
          color.replace("1)", "0.8)")
        ),
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
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const barRaasData = {
    labels: filteredRaasLabels,
    datasets: [
      {
        label: "Total Transactions by RaaS Provider",
        data: filteredRaasDataValues,
        backgroundColor: function (context) {
          const { chart, dataIndex } = context;
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          const color = filteredRaasBackgroundColors[dataIndex];

          if (!chartArea) {
            // Chart hasn't been drawn yet
            return color;
          }

          return createGradient(ctx, chartArea, color);
        },
        borderColor: filteredRaasBackgroundColors,
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
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
        font: {
          weight: "bold",
          size: 14,
        },
        textShadowBlur: 6,
        textShadowColor: "rgba(0, 0, 0, 0.7)",
      },
    },
    layout: {
      padding: 10, // Adjusted padding for compact design
    },
    cutout: "60%", // Increased the cutout for a compact pie chart
    radius: "80%", // Decreased the radius to make the pie chart smaller
    maintainAspectRatio: false, // Ensures the chart uses the full container space
  };

  const barOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
        barPercentage: 0.8, // Reduced bar spacing for a tighter fit
        categoryPercentage: 0.6, // Adjusted to make bars thicker
      },
      y: {
        ticks: {
          color: "#fff",
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
    maintainAspectRatio: false, // Ensures the chart uses the full container space
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
  };

  const downloadChart = () => {
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const url = chartInstance.toBase64Image();
      const link = document.createElement("a");
      link.href = url;
      link.download = "chart.png";
      link.click();
    }
  };

  return (
    <div className="chart-toggle-container">
      <div className="chart-header">
        <div className="dropdowns-container">
          <div className="chart-toggle-dropdown">
            <label htmlFor="dataType">Select Data Type: </label>
            <select
              id="dataType"
              value={dataType}
              onChange={handleDataTypeChange}
            >
              <option value="raas">Total Transactions by RaaS Provider</option>
              <option value="rollups">
                Total Transactions by Rollups Name
              </option>
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
        </div>

        <button onClick={downloadChart} className="download-icon">
          <FaDownload />
        </button>
      </div>

      <div className="chart-wrapper">
        {dataType === "raas" && (
          <>
            {chartType === "pie" ? (
              <Pie data={pieRaasData} options={pieOptions} ref={chartRef} />
            ) : (
              <Bar data={barRaasData} options={barOptions} ref={chartRef} />
            )}
          </>
        )}

        {dataType === "rollups" && (
          <Bar data={barRollupsData} options={barOptions} ref={chartRef} />
        )}
      </div>
    </div>
  );
};

export default ChartToggle;
