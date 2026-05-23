import React from 'react';
import Sidebar from './Sidebar';
import './PageLayout.css';

const PageLayout = ({ children, title }) => {
  return (
    <div className="page-layout">
      <Sidebar />
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
