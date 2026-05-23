import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const employeeLinks = [
    { path: '/dashboard', label: 'My Open Requests', icon: 'fa-folder-open' },
    { path: '/bills/create', label: 'Create Bill', icon: 'fa-plus-circle' },
  ];

  const managerLinks = [
    { path: '/manager/dashboard', label: 'Pending Approvals', icon: 'fa-clipboard-check' },
    { path: '/dashboard', label: 'My Requests', icon: 'fa-folder-open' },
  ];

  const financeLinks = [
    { path: '/finance/dashboard', label: 'Finance Queue', icon: 'fa-coins' },
    { path: '/dashboard', label: 'My Requests', icon: 'fa-folder-open' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Manage Users', icon: 'fa-users-cog' },
    { path: '/admin/users/create', label: 'Create User', icon: 'fa-user-plus' },
    { path: '/dashboard', label: 'All Bills', icon: 'fa-list' },
    { path: '/manager/dashboard', label: 'Manager View', icon: 'fa-clipboard-check' },
    { path: '/finance/dashboard', label: 'Finance View', icon: 'fa-coins' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'MANAGER': return managerLinks;
      case 'FINANCE_MANAGER': return financeLinks;
      case 'ADMIN': return adminLinks;
      default: return employeeLinks;
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <i className="fas fa-receipt"></i>
          {!collapsed && <span>ReimburseApp</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <div className="user-info">
            <div className="user-name">{user?.fullName}</div>
            <div className="user-role">{user?.role?.replace('_', ' ')}</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {getLinks().map((link) => (
          <Link
            key={link.path + link.label}
            to={link.path}
            className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
          >
            <i className={`fas ${link.icon}`}></i>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
