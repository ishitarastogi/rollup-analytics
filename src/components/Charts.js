// src/components/Charts.js
import React from "react";
import "./Charts.css";

const Charts = () => {
  return (
    <div className="charts-section">
      <div className="chart-container">
        <h3>TPS</h3>
        {/* Insert chart component here */}
      </div>
      <div className="chart-container">
        <h3>TVL</h3>
        {/* Insert chart component here */}
      </div>
      <div className="chart-container">
        <h3>Total Transactions</h3>
        {/* Insert chart component here */}
      </div>
      <div className="chart-container">
        <h3>Daily Transactions</h3>
        {/* Insert chart component here */}
      </div>
      {/* Add more charts as needed */}
    </div>
  );
};

export default Charts;
