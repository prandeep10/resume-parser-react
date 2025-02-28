import React from 'react';

const ResumeList = ({ resumes, onSelectResume }) => {
  // Helper to get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'Processing': return 'status-processing';
      case 'Failed': return 'status-failed';
      default: return '';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Render skills
  const renderSkills = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return 'None';
    }

    return (
      <div>
        {skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
        {skills.length > 3 && <span className="skill-tag">+{skills.length - 3}</span>}
      </div>
    );
  };

  return (
    <div className="resume-list">
      <div className="resume-list-header">
        <div>Filename</div>
        <div>Status</div>
        <div>Date</div>
        <div>Experience</div>
        <div>Skills</div>
      </div>
      
      {resumes.length === 0 ? (
        <div className="resume-list-empty">No resumes found matching your criteria.</div>
      ) : (
        resumes.map((resume) => (
          <div 
            key={resume.analysis_id} 
            className="resume-list-item"
            onClick={() => onSelectResume(resume.analysis_id)}
          >
            <div>{resume.filename}</div>
            <div>
              <span className={`status-badge ${getStatusClass(resume.status)}`}>
                {resume.status}
              </span>
            </div>
            <div>{formatDate(resume.process_date)}</div>
            <div>{resume.experience_level || 'N/A'}</div>
            <div>{renderSkills(resume.technical_skills)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResumeList;