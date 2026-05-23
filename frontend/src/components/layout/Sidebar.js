import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const employeeLinks = [
    { path: '/dashboard', label: 'My Bills', icon: 'fa-folder-open' },
    { path: '/bills/create', label: 'Create Bill', icon: 'fa-plus-circle' },
  ];

  const managerLinks = [
    { path: '/manager/dashboard', label: 'Pending Approvals', icon: 'fa-clipboard-check' },
    { path: '/dashboard', label: 'My Bills', icon: 'fa-folder-open' },
  ];

  const financeLinks = [
    { path: '/finance/dashboard', label: 'Finance Review Queue', icon: 'fa-coins' },
    { path: '/finance/close-queue', label: 'Credit & Close Queue', icon: 'fa-lock' },
    { path: '/dashboard', label: 'My Bills', icon: 'fa-folder-open' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Manage Users', icon: 'fa-users-cog' },
    { path: '/admin/users/create', label: 'Create User', icon: 'fa-user-plus' },
    { path: '/dashboard', label: 'All Bills', icon: 'fa-list' },
    { path: '/manager/dashboard', label: 'Manager View', icon: 'fa-clipboard-check' },
    { path: '/finance/dashboard', label: 'Finance Review', icon: 'fa-coins' },
    { path: '/finance/close-queue', label: 'Credit & Close', icon: 'fa-lock' },
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
          <div className="brand-icon"><i className="fas fa-receipt"></i></div>
          {!collapsed && <span className="brand-name">Easy Reimburse</span>}
        </div>
        <button className="collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
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
            <div className="user-role">{user?.role?.replace(/_/g, ' ')}</div>
          </div>
        )}
      </div>

      {!collapsed && <div className="nav-label">Navigation</div>}

      <nav className="sidebar-nav">
        {getLinks().map((link) => (
          <Link
            key={link.path + link.label}
            to={link.path}
            className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
            title={collapsed ? link.label : undefined}
          >
            <i className={`fas ${link.icon}`}></i>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
          <i className="fas fa-sign-out-alt"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
