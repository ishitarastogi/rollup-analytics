// FilterBar.js
import React from "react";
import { FaColumns } from "react-icons/fa";
import "./FilterBar.css";

const FilterBar = ({ filters, setFilters, uniqueOptions, setShowSettings }) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      rollups: "",
      frameworks: "",
      das: "",
      verticals: "",
      raasProviders: "",
      l2OrL3: "",
      dateRange: "All",
    });
  };

  if (!uniqueOptions) {
    return null; // Avoid rendering if uniqueOptions is not ready
  }

  return (
    <div className="filter-bar">
      <select name="rollups" onChange={handleFilterChange}>
        <option value="">All Rollups</option>
        {uniqueOptions.rollups?.map((rollup, index) => (
          <option key={index} value={rollup}>
            {rollup}
          </option>
        ))}
      </select>

      <select
        name="frameworks"
        onChange={handleFilterChange}
        title="Filter by Frameworks"
      >
        <option value="">All Frameworks</option>
        {uniqueOptions.frameworks?.map((framework, index) => (
          <option key={index} value={framework}>
            {framework}
          </option>
        ))}
      </select>

      <select name="das" onChange={handleFilterChange} title="Filter by DAs">
        <option value="">All DAs</option>
        {uniqueOptions.das?.map((da, index) => (
          <option key={index} value={da}>
            {da}
          </option>
        ))}
      </select>

      <select
        name="verticals"
        onChange={handleFilterChange}
        title="Filter by Verticals"
      >
        <option value="">All Verticals</option>
        {uniqueOptions.verticals?.map((vertical, index) => (
          <option key={index} value={vertical}>
            {vertical}
          </option>
        ))}
      </select>

      <select
        name="raasProviders"
        onChange={handleFilterChange}
        title="Filter by RaaS Providers"
      >
        <option value="">All RaaS Providers</option>
        {uniqueOptions.raasProviders?.map((provider, index) => (
          <option key={index} value={provider}>
            {provider}
          </option>
        ))}
      </select>

      {/* L2/L3 Filter */}
      <select
        name="l2OrL3"
        onChange={handleFilterChange}
        title="Filter by L2/L3"
      >
        <option value="">All L2/L3</option>
        {uniqueOptions.l2OrL3?.map((l2OrL3, index) => (
          <option key={index} value={l2OrL3}>
            {l2OrL3}
          </option>
        ))}
      </select>

      <div className="date-range">
        <button
          className={filters.dateRange === "All" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "All" })}
          title="Show all dates"
        >
          All
        </button>
        <button
          className={filters.dateRange === "1W" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1W" })}
          title="Last 1 Week"
        >
          1W
        </button>
        <button
          className={filters.dateRange === "1M" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1M" })}
          title="Last 1 Month"
        >
          1M
        </button>
        <button
          className={filters.dateRange === "3M" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "3M" })}
          title="Last 3 Months"
        >
          3M
        </button>
        <button
          className={filters.dateRange === "1Y" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1Y" })}
          title="Last 1 Year"
        >
          1Y
        </button>
      </div>

      <div className="filter-actions">
        <button
          className="reset-button"
          onClick={resetFilters}
          title="Reset Filters"
        >
          Reset Filters
        </button>

        <button
          className="columns-button"
          onClick={() => setShowSettings(true)}
          title="Show/Hide Columns"
        >
          <FaColumns /> Columns
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
