import React from 'react';
import { List, FileText, BarChart, Filter } from 'lucide-react';

const Header = ({ currentView, navigateTo }) => {
  // Define navigation items with corresponding views and icons
  const navItems = [
    { 
      view: 'list', 
      label: 'Resume List', 
      icon: List 
    },
    { 
      view: 'stats', 
      label: 'Stats Dashboard', 
      icon: BarChart 
    },
    { 
      view: 'filter', 
      label: 'Resume Filter', 
      icon: Filter 
    }
  ];

  return (
    <header className="app-header">
      <nav className="main-navigation">
        <div className="logo">
          Resume Analyzer
        </div>
        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => navigateTo(item.view)}
              className={`nav-item ${currentView === item.view ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;