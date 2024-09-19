import React from "react";
import "./FilterBar.css";

const FilterBar = ({ filters, setFilters, uniqueOptions }) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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

      <select name="frameworks" onChange={handleFilterChange}>
        <option value="">All Frameworks</option>
        {uniqueOptions.frameworks?.map((framework, index) => (
          <option key={index} value={framework}>
            {framework}
          </option>
        ))}
      </select>

      <select name="das" onChange={handleFilterChange}>
        <option value="">All DAs</option>
        {uniqueOptions.das?.map((da, index) => (
          <option key={index} value={da}>
            {da}
          </option>
        ))}
      </select>

      <select name="verticals" onChange={handleFilterChange}>
        <option value="">All Verticals</option>
        {uniqueOptions.verticals?.map((vertical, index) => (
          <option key={index} value={vertical}>
            {vertical}
          </option>
        ))}
      </select>

      <select name="raasProviders" onChange={handleFilterChange}>
        <option value="">All RaaS Providers</option>
        {uniqueOptions.raasProviders?.map((provider, index) => (
          <option key={index} value={provider}>
            {provider}
          </option>
        ))}
      </select>

      {/* L2/L3 Filter */}
      <select name="l2OrL3" onChange={handleFilterChange}>
        <option value="">All L2/L3</option>
        {uniqueOptions.l2OrL3?.map((l2OrL3, index) => (
          <option key={index} value={l2OrL3}>
            {l2OrL3}
          </option>
        ))}
      </select>

      <div className="date-range">
        <button
          className={filters.dateRange === "1W" ? "selected" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1W" })}
        >
          1W
        </button>
        <button
          className={filters.dateRange === "1M" ? "selected" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1M" })}
        >
          1M
        </button>
        <button
          className={filters.dateRange === "3M" ? "selected" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "3M" })}
        >
          3M
        </button>
        <button
          className={filters.dateRange === "1Y" ? "selected" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1Y" })}
        >
          1Y
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
