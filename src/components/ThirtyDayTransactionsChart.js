import React from "react";
import { Bar, Pie } from "react-chartjs-2";

const ThirtyDayTransactionsChart = ({ chartType }) => {
  const data = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: "Transactions",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "30-Day Transaction Count",
      },
    },
  };

  return chartType === "pie" ? (
    <Pie data={data} options={options} />
  ) : (
    <Bar data={data} options={options} />
  );
};

export default ThirtyDayTransactionsChart;
