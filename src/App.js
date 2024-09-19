// src/App.js
import React from "react";
import Table from "./components/Table";
import Charts from "./components/Charts";
import Filter from "./components/FilterBar";

import "./App.css"; // Global styles

function App() {
  return (
    <div className="app">
      {/* Header or Navigation Bar */}
      <header>
        <h1>Rollup Terminal</h1>
      </header>

      {/* Filter Bar */}
      <Filter />
      {/* Main Table */}
      <Table />

      {/* Charts Section */}
      <Charts />
    </div>
  );
}

export default App;
