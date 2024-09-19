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

const ChartToggle = ({ raasData }) => {
  const [chartType, setChartType] = useState("pie");

  // Mapping the correct color to each RaaS provider
  const colorMap = {
    Gelato: "#ff3b57",
    Conduit: "#46BDC6",
    Alchemy: "#4185F4",
    Caldera: "#EC6731",
    Altlayer: "#B28AFE",
  };

  // Preparing the data for the charts
  const labels = Object.keys(raasData);
  const dataValues = Object.values(raasData);

  // Dynamically assign the correct color to each RaaS provider
  const backgroundColors = labels.map((label) => colorMap[label] || "#000000");

  // Console log to check the exact RaaS-to-Color mapping
  useEffect(() => {
    labels.forEach((label, index) => {
      console.log(`RaaS Provider: ${label}, Color: ${backgroundColors[index]}`);
    });
  }, [labels, backgroundColors]);

  // Pie chart data
  const pieData = {
    labels: labels,
    datasets: [
      {
        label: "Total Transactions",
        data: dataValues,
        backgroundColor: backgroundColors, // Apply the mapped colors
        hoverOffset: 4,
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels: labels,
    datasets: [
      {
        label: "Total Transactions",
        data: dataValues,
        backgroundColor: backgroundColors, // Apply the mapped colors
        borderColor: backgroundColors,
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

  return (
    <div className="chart-toggle-container">
      {/* Dropdown for selecting chart type */}
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

      <div
        className={
          chartType === "pie" ? "pie-chart-wrapper" : "bar-chart-wrapper"
        }
      >
        {chartType === "pie" ? (
          <Pie data={pieData} options={pieOptions} />
        ) : (
          <Bar data={barData} />
        )}
      </div>
    </div>
  );
};

export default ChartToggle;
