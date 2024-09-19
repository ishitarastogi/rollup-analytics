import React from "react";
import { Bar, Pie } from "react-chartjs-2";

const TotalAddressesChart = ({ chartType }) => {
  const data = {
    labels: ["RaaS Provider 1", "RaaS Provider 2", "RaaS Provider 3"],
    datasets: [
      {
        data: [500, 300, 200],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
        text: "Total Addresses by RaaS Providers",
      },
    },
  };

  return chartType === "pie" ? (
    <Pie data={data} options={options} />
  ) : (
    <Bar data={data} options={options} />
  );
};

export default TotalAddressesChart;
