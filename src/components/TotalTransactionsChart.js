import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchGoogleSheetData } from "../services/fetchGoogleSheetData";
import Chart from "chart.js/auto";

const TotalTransactionsChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const prepareChartData = async () => {
      try {
        const sheetData = await fetchGoogleSheetData();

        // Create an object to accumulate the total transactions per chain for each RaaS provider
        const transactionsByRaasAndChain = {
          Gelato: {},
          Conduit: {},
          Alchemy: {},
          Caldera: {},
          Altlayer: {},
        };

        // Loop through the sheet data to fill transactions for each chain under their respective RaaS provider
        sheetData.forEach((row) => {
          const raasProvider = row.raas; // RaaS provider name
          const chainName = row.name; // Chain name
          const totalTransactions = parseInt(row.totalTransactions || 0); // Ensure the transaction value is numeric

          // If the RaaS provider and chain exist, sum up the transactions
          if (raasProvider && transactionsByRaasAndChain[raasProvider]) {
            if (!transactionsByRaasAndChain[raasProvider][chainName]) {
              transactionsByRaasAndChain[raasProvider][chainName] = 0;
            }
            transactionsByRaasAndChain[raasProvider][chainName] +=
              totalTransactions;
          }
        });

        // Prepare the labels and datasets for the chart
        const allChains = Object.keys([
          ...new Set(sheetData.map((row) => row.name)),
        ]);

        const datasets = Object.keys(transactionsByRaasAndChain).map(
          (raasProvider, index) => {
            return {
              label: raasProvider,
              data: allChains.map(
                (chain) => transactionsByRaasAndChain[raasProvider][chain] || 0
              ),
              backgroundColor: [
                "#ff3b57",
                "#EC6731",
                "#46BDC6",
                "#4185F4",
                "#B28AFE",
              ][index], // Assign colors for each RaaS provider
              borderColor: [
                "#ff3b57",
                "#EC6731",
                "#46BDC6",
                "#4185F4",
                "#B28AFE",
              ][index],
              borderWidth: 1,
            };
          }
        );

        const data = {
          labels: allChains, // X-axis labels representing chains
          datasets: datasets,
        };

        setChartData(data);
      } catch (error) {
        console.error("Error preparing chart data:", error);
      }
    };

    prepareChartData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Total Transactions by Chains (Grouped by RaaS Providers)</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Total Transactions by Chains (Grouped by RaaS Providers)",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default TotalTransactionsChart;
