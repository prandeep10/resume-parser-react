import React from 'react';

const ResumeDetail = ({ resume, onBack }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Render skills list
  const renderSkills = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return <p>None specified</p>;
    }

    return (
      <div className="skills-container">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
    );
  };

  // Handle null or empty values
  const displayValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <p>Not available</p>;
    }
    return <p>{value}</p>;
  };

  return (
    <div className="resume-detail">
      <div className="detail-header">
        <div className="detail-title">
          <h2>{resume.filename}</h2>
          <div className="detail-meta">
            <span>ID: {resume.analysis_id}</span>
            <span>Status: {resume.status}</span>
            <span>Processed: {formatDate(resume.process_date)}</span>
          </div>
        </div>
        <button className="back-button" onClick={onBack}>
          Back to List
        </button>
      </div>
      
      {resume.status === 'Failed' ? (
        <div className="error-section">
          <h3>Processing Error</h3>
          <p>{resume.error_message || 'Unknown error occurred during processing'}</p>
        </div>
      ) : (
        <div className="detail-sections">
          {/* Core Analysis Section */}
          <div className="detail-section">
            <h3>Core Analysis</h3>
            
            <div className="detail-item">
              <h4>Experience Level</h4>
              {displayValue(resume.experience_level)}
            </div>
            
            <div className="detail-item">
              <h4>Technical Skills</h4>
              {renderSkills(resume.technical_skills)}
            </div>
            
            <div className="detail-item">
              <h4>Soft Skills</h4>
              {renderSkills(resume.soft_skills)}
            </div>
            
            <div className="detail-item">
              <h4>Domain Skills</h4>
              {renderSkills(resume.domain_skills)}
            </div>
            
            <div className="detail-item">
              <h4>Career Progression</h4>
              {displayValue(resume.career_progression)}
            </div>
            
            <div className="detail-item">
              <h4>Education-Career Alignment</h4>
              {displayValue(resume.education_career_alignment)}
            </div>
          </div>
          
          {/* Content Quality Section */}
          <div className="detail-section">
            <h3>Content Quality</h3>
            
            <div className="detail-item">
              <h4>Action Verb Usage</h4>
              {displayValue(resume.action_verb_usage)}
            </div>
            
            <div className="detail-item">
              <h4>Achievement vs. Responsibility</h4>
              {displayValue(resume.achievement_ratio)}
            </div>
            
            <div className="detail-item">
              <h4>Quantifiable Results</h4>
              {displayValue(resume.quantifiable_results)}
            </div>
            
            <div className="detail-item">
              <h4>Writing Style</h4>
              {displayValue(resume.writing_style)}
            </div>
          </div>
          
          {/* Gap Analysis Section */}
          <div className="detail-section">
            <h3>Gap Analysis</h3>
            
            <div className="detail-item">
              <h4>Skills Gap</h4>
              {displayValue(resume.skills_gap)}
            </div>
            
            <div className="detail-item">
              <h4>Industry Transition</h4>
              {displayValue(resume.industry_transition)}
            </div>
            
            <div className="detail-item">
              <h4>Missing Credentials</h4>
              {displayValue(resume.missing_credentials)}
            </div>
            
            <div className="detail-item">
              <h4>Timeline Gaps</h4>
              {displayValue(resume.timeline_gaps)}
            </div>
          </div>
          
          {/* Career Development Section */}
          <div className="detail-section">
            <h3>Career Development</h3>
            
            <div className="detail-item">
              <h4>Skill Development Paths</h4>
              {displayValue(resume.skill_development_paths)}
            </div>
            
            <div className="detail-item">
              <h4>Career Trajectory</h4>
              {displayValue(resume.career_trajectory)}
            </div>
            
            <div className="detail-item">
              <h4>Growth Opportunities</h4>
              {displayValue(resume.growth_opportunities)}
            </div>
            
            <div className="detail-item">
              <h4>Recommended Certifications</h4>
              {renderSkills(resume.recommended_certifications)}
            </div>
          </div>
          
          {/* Application Optimization Section */}
          <div className="detail-section">
            <h3>Application Optimization</h3>
            
            <div className="detail-item">
              <h4>ATS Compatibility Score</h4>
              <p>{resume.ats_compatibility_score || 0}%</p>
            </div>
            
            <div className="detail-item">
              <h4>Job Match Percentage</h4>
              <p>{resume.job_match_percentage || 0}%</p>
            </div>
            
            <div className="detail-item">
              <h4>Resume Recommendations</h4>
              {displayValue(resume.resume_recommendations)}
            </div>
            
            <div className="detail-item">
              <h4>Cover Letter Suggestions</h4>
              {displayValue(resume.cover_letter_suggestions)}
            </div>
          </div>
        </div>
      )}
      
      {/* Original Resume Content */}
      {resume.original_content && (
        <div className="detail-section">
          <h3>Original Resume Content</h3>
          <div className="resume-content">
            {resume.original_content}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeDetail;