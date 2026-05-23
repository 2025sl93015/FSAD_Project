import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/services';
import PageLayout from '../../components/layout/PageLayout';
import { toast } from 'react-toastify';
import '../employee/Dashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    adminService.getAllUsers()
      .then(res => setUsers(res.data.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await adminService.deactivateUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active: false } : u));
      toast.success('User deactivated');
    } catch (err) {
      toast.error('Failed to deactivate user');
    }
  };

  const filtered = filterRole === 'ALL' ? users : users.filter(u => u.role === filterRole);

  const roleColors = {
    ADMIN: '#9c27b0', MANAGER: '#1a73e8', FINANCE_MANAGER: '#34a853', EMPLOYEE: '#5f6368'
  };

  return (
    <PageLayout title="User Management">
      <div className="admin-page">
        <div className="admin-stats">
          {['ADMIN', 'MANAGER', 'FINANCE_MANAGER', 'EMPLOYEE'].map(role => (
            <div key={role} className="admin-stat-card" style={{ borderLeftColor: roleColors[role] }}>
              <div className="admin-stat-value">{users.filter(u => u.role === role).length}</div>
              <div className="admin-stat-label">{role.replace('_', ' ')}</div>
            </div>
          ))}
        </div>

        <div className="action-bar">
          <div className="filter-tabs">
            {['ALL', 'EMPLOYEE', 'MANAGER', 'FINANCE_MANAGER', 'ADMIN'].map(r => (
              <button key={r} className={`filter-tab ${filterRole === r ? 'active' : ''}`}
                onClick={() => setFilterRole(r)}>
                {r === 'ALL' ? 'All' : r.replace('_', ' ')}
              </button>
            ))}
          </div>
          <Link to="/admin/users/create" className="btn-primary">
            <i className="fas fa-user-plus"></i> Create User
          </Link>
        </div>

        {loading ? (
          <div className="loading-box"><i className="fas fa-spinner fa-spin"></i> Loading...</div>
        ) : (
          <div className="table-container">
            <table className="bills-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.fullName}</strong></td>
                    <td><span className="bill-num">{u.username}</span></td>
                    <td>{u.email}</td>
                    <td>{u.department}</td>
                    <td>
                      <span className="role-badge" style={{ background: roleColors[u.role] + '20', color: roleColors[u.role] }}>
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{u.managerName || '-'}</td>
                    <td>
                      <span className={`status-dot ${u.active ? 'active' : 'inactive'}`}>
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/admin/users/${u.id}/edit`} className="btn-edit">Edit</Link>
                        {u.active && (
                          <button className="btn-deactivate" onClick={() => handleDeactivate(u.id)}>
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
