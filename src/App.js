// src/App.js
import React from "react";
import FilterBar from "./components/FilterBar";
import Table from "./components/Table";
import Charts from "./components/Charts";
import "./App.css"; // Global styles

function App() {
  return (
    <div className="app">
      {/* Header or Navigation Bar */}
      <header>
        <h1>Rollups Terminal</h1>
      </header>

      {/* Filter Bar */}
      <FilterBar />

      {/* Main Table */}
      <Table />

      {/* Charts Section */}
      <Charts />
    </div>
  );
}

export default App;
