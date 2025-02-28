import React, { useState } from 'react';
import { Table, Tag, Button, Tooltip, Space, Input } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const ResumeTable = ({ resumes, onSelectResume, loading, onRefresh }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});

  // Handle table change
  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  // Reset sorting
  const clearSorting = () => {
    setSortedInfo({});
  };

  // Get column search props
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button 
            onClick={() => handleReset(clearFilters)} 
            size="small" 
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <span style={{ 
          backgroundColor: '#ffc069', 
          padding: '0 2px', 
          display: searchText && text && text.toString().toLowerCase().includes(searchText.toLowerCase()) ? 'inline' : 'none'
        }}>
          {text}
        </span>
      ) : (
        text
      ),
  });

  // Handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // Handle reset
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  // Columns configuration
  const columns = [
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      sorter: (a, b) => a.filename.localeCompare(b.filename),
      sortOrder: sortedInfo.columnKey === 'filename' && sortedInfo.order,
      render: (text, record) => (
        <div className="filename-cell" onClick={() => onSelectResume(record.analysis_id)}>
          {text}
        </div>
      ),
      ...getColumnSearchProps('filename'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
      render: status => {
        let color = 'default';
        if (status === 'Completed') color = 'success';
        if (status === 'Processing') color = 'processing';
        if (status === 'Failed') color = 'error';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'Processing', value: 'Processing' },
        { text: 'Failed', value: 'Failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Process Date',
      dataIndex: 'process_date',
      key: 'process_date',
      sorter: (a, b) => moment(a.process_date).valueOf() - moment(b.process_date).valueOf(),
      sortOrder: sortedInfo.columnKey === 'process_date' && sortedInfo.order,
      render: date => date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
    },
    {
      title: 'Experience Level',
      dataIndex: 'experience_level',
      key: 'experience_level',
      sorter: (a, b) => {
        if (!a.experience_level) return -1;
        if (!b.experience_level) return 1;
        return a.experience_level.localeCompare(b.experience_level);
      },
      sortOrder: sortedInfo.columnKey === 'experience_level' && sortedInfo.order,
      render: level => level || 'N/A',
    },
    {
      title: 'Skills',
      dataIndex: 'technical_skills',
      key: 'technical_skills',
      render: (skills) => {
        if (!skills || !Array.isArray(skills) || skills.length === 0) {
          return <span>None</span>;
        }
        
        return (
          <>
            {skills.slice(0, 3).map(skill => (
              <Tag key={skill} color="blue" style={{ marginBottom: '4px' }}>
                {skill}
              </Tag>
            ))}
            {skills.length > 3 && (
              <Tag color="blue">+{skills.length - 3}</Tag>
            )}
          </>
        );
      },
    },
    {
      title: 'ATS Score',
      dataIndex: 'ats_compatibility_score',
      key: 'ats_compatibility_score',
      sorter: (a, b) => (a.ats_compatibility_score || 0) - (b.ats_compatibility_score || 0),
      sortOrder: sortedInfo.columnKey === 'ats_compatibility_score' && sortedInfo.order,
      render: score => {
        if (score === null || score === undefined) return 'N/A';
        
        let color = '#cf1322'; // red
        if (score >= 80) color = '#3f8600'; // green
        else if (score >= 60) color = '#faad14'; // yellow
        
        return <span style={{ color }}>{score}%</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => onSelectResume(record.analysis_id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="resume-table-container">
      <div className="table-header">
        <h2>Resume List ({resumes.length})</h2>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={onRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button onClick={clearSorting}>Clear Sorting</Button>
        </Space>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={resumes.map(resume => ({ ...resume, key: resume.analysis_id }))} 
        onChange={handleTableChange}
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
        rowClassName={record => record.status === 'Failed' ? 'failed-row' : ''}
        onRow={record => ({
          onClick: () => onSelectResume(record.analysis_id),
          style: { cursor: 'pointer' }
        })}
      />
    </div>
  );
};

export default ResumeTable;