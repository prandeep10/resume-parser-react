import React from 'react';

const FilterPanel = ({ statusFilter, onFilterChange }) => {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label htmlFor="status-filter">Status:</label>
        <select 
          id="status-filter" 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Processing">Processing</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;