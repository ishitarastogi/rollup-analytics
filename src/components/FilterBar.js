// src/components/FilterBar.js
import React from "react";
import "./FilterBar.css";

const FilterBar = () => {
  return (
    <div className="filter-bar">
      <select name="rollups">
        <option value="">All Rollups (125)</option>
        {/* Add more rollup options here */}
      </select>

      <select name="frameworks">
        <option value="">All Frameworks (7)</option>
        {/* Add more framework options here */}
      </select>

      <select name="das">
        <option value="">All DAs (7)</option>
        {/* Add more DA options here */}
      </select>

      <select name="layers">
        <option value="">All Layers (3)</option>
        {/* Add more layer options here */}
      </select>

      <select name="verticals">
        <option value="">All Verticals (13)</option>
        {/* Add more vertical options here */}
      </select>

      <select name="raasProviders">
        <option value="">All RaaS Providers (5)</option>
        {/* Add more RaaS provider options here */}
      </select>

      <div className="date-range">
        <button>1W</button>
        <button>1M</button>
        <button>3M</button>
        <button>1Y</button>
      </div>
    </div>
  );
};

export default FilterBar;
