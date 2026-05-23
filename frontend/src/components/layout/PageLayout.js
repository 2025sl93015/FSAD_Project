import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './PageLayout.css';

const PageLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`page-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="main-content">
        <header className="page-header">
          <h1>{title}</h1>
        </header>
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
