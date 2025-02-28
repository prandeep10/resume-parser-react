import React from 'react';

const StatsDashboard = ({ stats }) => {
  // Get total count of resumes
  const getTotalCount = () => {
    if (!stats || !stats.total_by_status || !Array.isArray(stats.total_by_status)) {
      return 0;
    }
    
    return stats.total_by_status.reduce((sum, item) => sum + item.count, 0);
  };

  // Get count by status
  const getCountByStatus = (status) => {
    if (!stats || !stats.total_by_status || !Array.isArray(stats.total_by_status)) {
      return 0;
    }
    
    const statusItem = stats.total_by_status.find(item => item.status === status);
    return statusItem ? statusItem.count : 0;
  };

  return (
    <div className="stats-dashboard">
      {/* Summary Statistics */}
      <div className="stats-card">
        <h3>Summary Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{getTotalCount()}</div>
            <div className="stat-label">Total Resumes</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{stats.recent_count}</div>
            <div className="stat-label">Last 30 Days</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{getCountByStatus('Completed')}</div>
            <div className="stat-label">Completed</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{getCountByStatus('Failed')}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      </div>
      
      {/* Top Skills */}
      <div className="stats-card">
        <h3>Top Skills</h3>
        {!stats.top_skills || !Array.isArray(stats.top_skills) || stats.top_skills.length === 0 ? (
          <p>No skill data available</p>
        ) : (
          <ul className="top-skills-list">
            {stats.top_skills.map((skill, index) => (
              <li key={index} className="top-skills-item">
                <span className="skill-name">{skill.skill}</span>
                <span className="skill-count">{skill.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Status Distribution */}
      <div className="stats-card">
        <h3>Status Distribution</h3>
        {!stats.total_by_status || !Array.isArray(stats.total_by_status) || stats.total_by_status.length === 0 ? (
          <p>No status data available</p>
        ) : (
          <div className="status-distribution">
            {stats.total_by_status.map((status, index) => {
              // Calculate percentage for bar width
              const total = getTotalCount();
              const percentage = total > 0 ? (status.count / total) * 100 : 0;
              
              // Determine bar color based on status
              let barColor = '#3498db'; // Default blue
              if (status.status === 'Completed') barColor = '#2ecc71'; // Green
              if (status.status === 'Failed') barColor = '#e74c3c'; // Red
              if (status.status === 'Processing') barColor = '#f39c12'; // Orange
              
              return (
                <div key={index} className="status-bar-container">
                  <div className="status-bar-label">
                    <span>{status.status}</span>
                    <span>{status.count}</span>
                  </div>
                  <div className="status-bar-background">
                    <div 
                      className="status-bar-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: barColor
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Skill Trends */}
      <div className="stats-card">
        <h3>Experience Levels</h3>
        <p className="placeholder-message">
          This feature requires additional data aggregation. Coming soon.
        </p>
      </div>
    </div>
  );
};

export default StatsDashboard;