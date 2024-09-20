import React from "react";
import Table from "./components/Table";
// import Charts from "./components/Charts";

import "./App.css";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Rollup Terminal</h1>
      </header>

      {/* Main Table */}
      <Table />
      {/* <Charts /> */}

      {/* Charts Section */}
    </div>
  );
}

export default App;
