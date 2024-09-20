import React from "react";
import { FaColumns } from "react-icons/fa";
import "./FilterBar.css";

const FilterBar = ({
  filters,
  setFilters,
  setSortConfig,
  uniqueOptions,
  resetFiltersAndSorting,
  setShowSettings,
}) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    resetFiltersAndSorting(); // Reset both filters and sorting
  };

  return (
    <div className="filter-bar">
      {/* Controlled Dropdown for Rollups */}
      <select
        name="rollups"
        value={filters.rollups}
        onChange={handleFilterChange}
      >
        <option value="">All Rollups</option>
        {uniqueOptions.rollups?.map((rollup, index) => (
          <option key={index} value={rollup}>
            {rollup}
          </option>
        ))}
      </select>

      {/* Controlled Dropdown for Frameworks */}
      <select
        name="frameworks"
        value={filters.frameworks}
        onChange={handleFilterChange}
      >
        <option value="">All Frameworks</option>
        {uniqueOptions.frameworks?.map((framework, index) => (
          <option key={index} value={framework}>
            {framework}
          </option>
        ))}
      </select>

      {/* Controlled Dropdown for DAs */}
      <select name="das" value={filters.das} onChange={handleFilterChange}>
        <option value="">All DAs</option>
        {uniqueOptions.das?.map((da, index) => (
          <option key={index} value={da}>
            {da}
          </option>
        ))}
      </select>

      {/* Controlled Dropdown for Verticals */}
      <select
        name="verticals"
        value={filters.verticals}
        onChange={handleFilterChange}
      >
        <option value="">All Verticals</option>
        {uniqueOptions.verticals?.map((vertical, index) => (
          <option key={index} value={vertical}>
            {vertical}
          </option>
        ))}
      </select>

      {/* Controlled Dropdown for RaaS Providers */}
      <select
        name="raasProviders"
        value={filters.raasProviders}
        onChange={handleFilterChange}
      >
        <option value="">All RaaS Providers</option>
        {uniqueOptions.raasProviders?.map((provider, index) => (
          <option key={index} value={provider}>
            {provider}
          </option>
        ))}
      </select>

      {/* Controlled Dropdown for L2/L3 */}
      <select
        name="l2OrL3"
        value={filters.l2OrL3}
        onChange={handleFilterChange}
      >
        <option value="">All L2/L3</option>
        {uniqueOptions.l2OrL3?.map((l2OrL3, index) => (
          <option key={index} value={l2OrL3}>
            {l2OrL3}
          </option>
        ))}
      </select>

      {/* Date Range Buttons */}
      <div className="date-range">
        <button
          className={filters.dateRange === "All" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "All" })}
        >
          All
        </button>
        <button
          className={filters.dateRange === "1W" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1W" })}
        >
          1W
        </button>
        <button
          className={filters.dateRange === "1M" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1M" })}
        >
          1M
        </button>
        <button
          className={filters.dateRange === "3M" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "3M" })}
        >
          3M
        </button>
        <button
          className={filters.dateRange === "1Y" ? "active" : ""}
          onClick={() => setFilters({ ...filters, dateRange: "1Y" })}
        >
          1Y
        </button>
      </div>

      {/* Filter Action Buttons */}
      <div className="filter-actions">
        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
        <button
          className="columns-button"
          onClick={() => setShowSettings(true)}
        >
          <FaColumns /> Columns
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
