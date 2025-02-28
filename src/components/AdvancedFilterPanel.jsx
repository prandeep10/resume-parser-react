import React, { useState, useEffect } from 'react';
import { Input, Select, DatePicker, Slider, Switch, Button, Tag, Divider, Row, Col, Collapse } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const AdvancedFilterPanel = ({ originalData, onFilteredDataChange }) => {
  // State for all filter parameters
  const [filters, setFilters] = useState({
    status: [],
    filename: '',
    dateRange: [],
    experienceLevel: [],
    technicalSkills: [],
    softSkills: [],
    atsScoreRange: [0, 100],
    jobMatchRange: [0, 100],
    careerTrajectory: []
  });

  // State for available options
  const [filterOptions, setFilterOptions] = useState({
    experienceLevels: [],
    technicalSkills: [],
    softSkills: [],
    careerTrajectories: []
  });

  // State for which filter sections are expanded
  const [expandedSections, setExpandedSections] = useState(['status', 'basic', 'skills']);

  // Extract all possible options from original data
  useEffect(() => {
    if (!originalData || !originalData.length) return;

    const options = {
      experienceLevels: new Set(),
      technicalSkills: new Set(),
      softSkills: new Set(),
      careerTrajectories: new Set()
    };

    originalData.forEach(resume => {
      // Experience levels
      if (resume.experience_level) {
        options.experienceLevels.add(resume.experience_level);
      }

      // Technical skills
      if (Array.isArray(resume.technical_skills)) {
        resume.technical_skills.forEach(skill => options.technicalSkills.add(skill));
      }

      // Soft skills
      if (Array.isArray(resume.soft_skills)) {
        resume.soft_skills.forEach(skill => options.softSkills.add(skill));
      }

      // Career trajectories
      if (resume.career_trajectory) {
        options.careerTrajectories.add(resume.career_trajectory);
      }
    });

    // Convert sets to sorted arrays
    setFilterOptions({
      experienceLevels: Array.from(options.experienceLevels).sort(),
      technicalSkills: Array.from(options.technicalSkills).sort(),
      softSkills: Array.from(options.softSkills).sort(),
      careerTrajectories: Array.from(options.careerTrajectories).sort()
    });
  }, [originalData]);

  // Apply filters whenever they change
  useEffect(() => {
    if (!originalData) return;

    const applyFilters = () => {
      const filtered = originalData.filter(resume => {
        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(resume.status)) {
          return false;
        }

        // Filename filter (case-insensitive partial match)
        if (filters.filename && !resume.filename.toLowerCase().includes(filters.filename.toLowerCase())) {
          return false;
        }

        // Date range filter
        if (filters.dateRange && filters.dateRange.length === 2) {
          const processDate = moment(resume.process_date);
          if (
            !processDate.isValid() ||
            processDate.isBefore(filters.dateRange[0], 'day') ||
            processDate.isAfter(filters.dateRange[1], 'day')
          ) {
            return false;
          }
        }

        // Experience level filter
        if (
          filters.experienceLevel.length > 0 &&
          !filters.experienceLevel.includes(resume.experience_level)
        ) {
          return false;
        }

        // Technical skills filter (must have ALL selected skills)
        if (filters.technicalSkills.length > 0) {
          if (!Array.isArray(resume.technical_skills)) return false;
          const matches = filters.technicalSkills.every(skill => 
            resume.technical_skills.includes(skill)
          );
          if (!matches) return false;
        }

        // Soft skills filter (must have ALL selected skills)
        if (filters.softSkills.length > 0) {
          if (!Array.isArray(resume.soft_skills)) return false;
          const matches = filters.softSkills.every(skill => 
            resume.soft_skills.includes(skill)
          );
          if (!matches) return false;
        }

        // ATS score range filter
        if (
          resume.ats_compatibility_score < filters.atsScoreRange[0] ||
          resume.ats_compatibility_score > filters.atsScoreRange[1]
        ) {
          return false;
        }

        // Job match range filter
        if (
          resume.job_match_percentage < filters.jobMatchRange[0] ||
          resume.job_match_percentage > filters.jobMatchRange[1]
        ) {
          return false;
        }

        // Career trajectory filter
        if (
          filters.careerTrajectory.length > 0 &&
          !filters.careerTrajectory.includes(resume.career_trajectory)
        ) {
          return false;
        }

        // All filters passed
        return true;
      });

      // Return filtered data to parent component
      onFilteredDataChange(filtered);
    };

    // Add a small delay to avoid excessive filtering during typing
    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, originalData, onFilteredDataChange]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: [],
      filename: '',
      dateRange: [],
      experienceLevel: [],
      technicalSkills: [],
      softSkills: [],
      atsScoreRange: [0, 100],
      jobMatchRange: [0, 100],
      careerTrajectory: []
    });
  };

  // Active filter count for the filter button
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status.length) count++;
    if (filters.filename) count++;
    if (filters.dateRange.length) count++;
    if (filters.experienceLevel.length) count++;
    if (filters.technicalSkills.length) count++;
    if (filters.softSkills.length) count++;
    if (filters.atsScoreRange[0] > 0 || filters.atsScoreRange[1] < 100) count++;
    if (filters.jobMatchRange[0] > 0 || filters.jobMatchRange[1] < 100) count++;
    if (filters.careerTrajectory.length) count++;
    return count;
  };

  return (
    <div className="advanced-filter-panel">
      <div className="filter-header">
        <h3>
          <FilterOutlined /> Advanced Filters
          {getActiveFilterCount() > 0 && (
            <Tag color="blue" className="filter-count-tag">
              {getActiveFilterCount()}
            </Tag>
          )}
        </h3>
        {getActiveFilterCount() > 0 && (
          <Button 
            icon={<ClearOutlined />} 
            onClick={resetFilters}
            type="link"
          >
            Clear All
          </Button>
        )}
      </div>

      <Collapse 
        defaultActiveKey={expandedSections}
        onChange={setExpandedSections}
        ghost
        className="filter-collapse"
      >
        {/* Status Filter */}
        <Panel header="Status" key="status">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select statuses"
            value={filters.status}
            onChange={value => handleFilterChange('status', value)}
            allowClear
          >
            <Option value="Completed">Completed</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Failed">Failed</Option>
          </Select>
        </Panel>

        {/* Basic Filters */}
        <Panel header="Basic Filters" key="basic">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="filter-item">
                <label>Filename:</label>
                <Input
                  placeholder="Search by filename"
                  value={filters.filename}
                  onChange={e => handleFilterChange('filename', e.target.value)}
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="filter-item">
                <label>Process Date Range:</label>
                <RangePicker
                  style={{ width: '100%' }}
                  value={filters.dateRange}
                  onChange={value => handleFilterChange('dateRange', value)}
                  allowClear
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="filter-item">
                <label>Experience Level:</label>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Select experience levels"
                  value={filters.experienceLevel}
                  onChange={value => handleFilterChange('experienceLevel', value)}
                  allowClear
                >
                  {filterOptions.experienceLevels.map(level => (
                    <Option key={level} value={level}>
                      {level}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </Panel>

        {/* Skills Filters */}
        <Panel header="Skills" key="skills">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="filter-item">
                <label>Technical Skills:</label>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Filter by technical skills"
                  value={filters.technicalSkills}
                  onChange={value => handleFilterChange('technicalSkills', value)}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {filterOptions.technicalSkills.map(skill => (
                    <Option key={skill} value={skill}>
                      {skill}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={24}>
              <div className="filter-item">
                <label>Soft Skills:</label>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Filter by soft skills"
                  value={filters.softSkills}
                  onChange={value => handleFilterChange('softSkills', value)}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {filterOptions.softSkills.map(skill => (
                    <Option key={skill} value={skill}>
                      {skill}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </Panel>

        {/* Scores Filter */}
        <Panel header="Scores" key="scores">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="filter-item">
                <label>ATS Compatibility Score: {filters.atsScoreRange[0]}% - {filters.atsScoreRange[1]}%</label>
                <Slider
                  range
                  min={0}
                  max={100}
                  value={filters.atsScoreRange}
                  onChange={value => handleFilterChange('atsScoreRange', value)}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="filter-item">
                <label>Job Match Percentage: {filters.jobMatchRange[0]}% - {filters.jobMatchRange[1]}%</label>
                <Slider
                  range
                  min={0}
                  max={100}
                  value={filters.jobMatchRange}
                  onChange={value => handleFilterChange('jobMatchRange', value)}
                />
              </div>
            </Col>
          </Row>
        </Panel>

        {/* Career Filters */}
        <Panel header="Career" key="career">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="filter-item">
                <label>Career Trajectory:</label>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Select career trajectories"
                  value={filters.careerTrajectory}
                  onChange={value => handleFilterChange('careerTrajectory', value)}
                  allowClear
                >
                  {filterOptions.careerTrajectories.map(trajectory => (
                    <Option key={trajectory} value={trajectory}>
                      {trajectory}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>

      <div className="active-filters">
        {getActiveFilterCount() > 0 && (
          <>
            <Divider>Active Filters</Divider>
            <div className="filter-tags">
              {filters.status.length > 0 && (
                <Tag closable onClose={() => handleFilterChange('status', [])}>
                  Status: {filters.status.join(', ')}
                </Tag>
              )}
              
              {filters.filename && (
                <Tag closable onClose={() => handleFilterChange('filename', '')}>
                  Filename: {filters.filename}
                </Tag>
              )}
              
              {filters.dateRange.length === 2 && (
                <Tag closable onClose={() => handleFilterChange('dateRange', [])}>
                  Date: {moment(filters.dateRange[0]).format('MMM DD, YYYY')} - {moment(filters.dateRange[1]).format('MMM DD, YYYY')}
                </Tag>
              )}
              
              {filters.experienceLevel.length > 0 && (
                <Tag closable onClose={() => handleFilterChange('experienceLevel', [])}>
                  Experience: {filters.experienceLevel.join(', ')}
                </Tag>
              )}
              
              {filters.technicalSkills.map(skill => (
                <Tag 
                  key={skill} 
                  closable 
                  onClose={() => handleFilterChange('technicalSkills', filters.technicalSkills.filter(s => s !== skill))}
                >
                  Tech: {skill}
                </Tag>
              ))}
              
              {filters.softSkills.map(skill => (
                <Tag 
                  key={skill} 
                  closable 
                  onClose={() => handleFilterChange('softSkills', filters.softSkills.filter(s => s !== skill))}
                >
                  Soft: {skill}
                </Tag>
              ))}
              
              {(filters.atsScoreRange[0] > 0 || filters.atsScoreRange[1] < 100) && (
                <Tag closable onClose={() => handleFilterChange('atsScoreRange', [0, 100])}>
                  ATS: {filters.atsScoreRange[0]}% - {filters.atsScoreRange[1]}%
                </Tag>
              )}
              
              {(filters.jobMatchRange[0] > 0 || filters.jobMatchRange[1] < 100) && (
                <Tag closable onClose={() => handleFilterChange('jobMatchRange', [0, 100])}>
                  Match: {filters.jobMatchRange[0]}% - {filters.jobMatchRange[1]}%
                </Tag>
              )}
              
              {filters.careerTrajectory.length > 0 && (
                <Tag closable onClose={() => handleFilterChange('careerTrajectory', [])}>
                  Career: {filters.careerTrajectory.join(', ')}
                </Tag>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;