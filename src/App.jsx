import React, { useState, useEffect } from 'react';
import ResumeList from './components/ResumeList';
import ResumeDetail from './components/ResumeDetail';
import FilterPanel from './components/FilterPanel';
import StatsDashboard from './components/StatsDashboard';
import Header from './components/Header';
import './App.css';
import ResumeFilter from './pages/ResumeFilter';

function App() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'stats', 'filter'
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch all resumes or filtered by status
  const fetchResumes = async (status = 'All') => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/resumes';
      if (status !== 'All') {
        url = `http://localhost:5000/api/resumes/status/${status}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setResumes(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch resumes');
        setResumes([]);
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again later.');
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        console.error('Failed to fetch stats:', data.error);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch resume details
  const fetchResumeDetail = async (analysisId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/resume/${analysisId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedResume(data.data);
        setCurrentView('detail');
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch resume details');
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchResumes();
    fetchStats();
  }, []);

  // Handle status filter change
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    fetchResumes(status);
  };

  // Handle view navigation
  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'list') {
      setSelectedResume(null);
    }
    if (view === 'stats') {
      fetchStats();
    }
  };

  return (
    <div className="app">
      <Header 
        currentView={currentView} 
        navigateTo={navigateTo} 
      />
      
      <main className="main-content">
        {currentView === 'list' && (
          <>
            <FilterPanel 
              statusFilter={statusFilter} 
              onFilterChange={handleFilterChange}
            />
            
            {loading ? (
              <div className="loading">Loading resumes...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <ResumeList 
                resumes={resumes} 
                onSelectResume={fetchResumeDetail} 
              />
            )}
          </>
        )}
        
        {currentView === 'detail' && selectedResume && (
          <ResumeDetail 
            resume={selectedResume} 
            onBack={() => navigateTo('list')}
          />
        )}
        
        {currentView === 'stats' && stats && (
          <StatsDashboard stats={stats} />
        )}

        {currentView === 'filter' && (
          <ResumeFilter />
        )}
      </main>
    </div>
  );
}

export default App;