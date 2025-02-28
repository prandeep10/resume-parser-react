import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import './ResumeFilter.css';

const ResumeFilter = () => {
  // State for original and filtered data
  const [originalResumes, setOriginalResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('');
  const [selectedTechnicalSkills, setSelectedTechnicalSkills] = useState([]);
  const [selectedDomainSkills, setSelectedDomainSkills] = useState([]);
  const [atsScoreRange, setAtsScoreRange] = useState([0, 100]);
  const [jobMatchRange, setJobMatchRange] = useState([0, 100]);
  const [status, setStatus] = useState('');

  // Fetch resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.131.243:5000/api/resumes');
        const result = await response.json();
        
        if (result.success) {
          setOriginalResumes(result.data);
          setFilteredResumes(result.data);
        } else {
          setError(result.error || 'Failed to fetch resumes');
        }
      } catch (err) {
        setError('Error fetching resumes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Memoized unique skills and experience levels
  const uniqueTechnicalSkills = useMemo(() => {
    return [...new Set(originalResumes.flatMap(resume => resume.technical_skills))];
  }, [originalResumes]);

  const uniqueDomainSkills = useMemo(() => {
    return [...new Set(originalResumes.flatMap(resume => resume.domain_skills))];
  }, [originalResumes]);

  const uniqueExperienceLevels = useMemo(() => {
    return [...new Set(originalResumes.map(resume => resume.experience_level))];
  }, [originalResumes]);

  // Filtering logic
  const applyFilters = () => {
    let result = [...originalResumes];

    // Keyword search (across multiple fields)
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(resume => 
        resume.filename.toLowerCase().includes(lowercasedTerm) ||
        resume.technical_skills.some(skill => 
          skill.toLowerCase().includes(lowercasedTerm)
        ) ||
        resume.domain_skills.some(skill => 
          skill.toLowerCase().includes(lowercasedTerm)
        )
      );
    }

    // Experience Level Filter
    if (selectedExperienceLevel) {
      result = result.filter(resume => 
        resume.experience_level === selectedExperienceLevel
      );
    }

    // Technical Skills Filter
    if (selectedTechnicalSkills.length > 0) {
      result = result.filter(resume => 
        selectedTechnicalSkills.every(skill => 
          resume.technical_skills.includes(skill)
        )
      );
    }

    // Domain Skills Filter
    if (selectedDomainSkills.length > 0) {
      result = result.filter(resume => 
        selectedDomainSkills.every(skill => 
          resume.domain_skills.includes(skill)
        )
      );
    }

    // ATS Score Range Filter
    result = result.filter(resume => 
      resume.ats_compatibility_score >= atsScoreRange[0] &&
      resume.ats_compatibility_score <= atsScoreRange[1]
    );

    // Job Match Range Filter
    result = result.filter(resume => 
      resume.job_match_percentage >= jobMatchRange[0] &&
      resume.job_match_percentage <= jobMatchRange[1]
    );

    // Status Filter
    if (status) {
      result = result.filter(resume => resume.status === status);
    }

    setFilteredResumes(result);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedExperienceLevel('');
    setSelectedTechnicalSkills([]);
    setSelectedDomainSkills([]);
    setAtsScoreRange([0, 100]);
    setJobMatchRange([0, 100]);
    setStatus('');
    setFilteredResumes(originalResumes);
  };

  // Toggle technical skill selection
  const toggleTechnicalSkill = (skill) => {
    setSelectedTechnicalSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Toggle domain skill selection
  const toggleDomainSkill = (skill) => {
    setSelectedDomainSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Render method
  return (
    <div className="resume-filter-container">
      <div className="filter-header">
        <h1>Resume Filter</h1>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Resumes...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="filter-content">
          {/* Search Bar */}
          <div className="search-container">
            <input 
              type="text"
              placeholder="Search resumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" />
          </div>

          {/* Filters Row */}
          <div className="filters-row">
            {/* Experience Level Filter */}
            <div className="filter-group">
              <label>Experience Level</label>
              <select 
                value={selectedExperienceLevel}
                onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                className="filter-select"
              >
                <option value="">All Levels</option>
                {uniqueExperienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* ATS Score Range */}
            <div className="filter-group range-filter">
              <label>ATS Compatibility Score</label>
              <div className="range-container">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={atsScoreRange[0]}
                  onChange={(e) => setAtsScoreRange([Number(e.target.value), atsScoreRange[1]])}
                />
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={atsScoreRange[1]}
                  onChange={(e) => setAtsScoreRange([atsScoreRange[0], Number(e.target.value)])}
                />
              </div>
              <div className="range-labels">
                <span>{atsScoreRange[0]}</span>
                <span>{atsScoreRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Technical Skills Multiselect */}
          <div className="skills-section">
            <h3>Technical Skills</h3>
            <div className="skills-grid">
              {uniqueTechnicalSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleTechnicalSkill(skill)}
                  className={`skill-tag ${
                    selectedTechnicalSkills.includes(skill) ? 'selected' : ''
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Skills Multiselect */}
          <div className="skills-section">
            <h3>Domain Skills</h3>
            <div className="skills-grid">
              {uniqueDomainSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleDomainSkill(skill)}
                  className={`skill-tag ${
                    selectedDomainSkills.includes(skill) ? 'selected' : ''
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="actions-container">
            <div className="action-buttons">
              <button 
                onClick={applyFilters}
                className="btn btn-primary"
              >
                <Filter className="btn-icon" /> Apply Filters
              </button>
              <button 
                onClick={resetFilters}
                className="btn btn-secondary"
              >
                <X className="btn-icon" /> Reset
              </button>
            </div>
            <div className="results-count">
              {filteredResumes.length} Resume{filteredResumes.length !== 1 ? 's' : ''} Found
            </div>
          </div>

          {/* Filtered Resumes List */}
          <div className="resumes-list">
            <h2>Filtered Resumes</h2>
            {filteredResumes.map(resume => (
              <div 
                key={resume.analysis_id} 
                className="resume-item"
              >
                <h3>{resume.filename}</h3>
                <div className="resume-details">
                  <p>Experience: {resume.experience_level}</p>
                  <p>ATS Score: {resume.ats_compatibility_score}</p>
                  <p>Status: {resume.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeFilter;