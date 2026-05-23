import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { billService } from '../../services/services';
import { useAuth } from '../../context/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/constants';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const fetchFn = user?.role === 'ADMIN' ? billService.getAllBills : billService.getOpenRequests;
      const res = await fetchFn();
      setBills(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = filter === 'ALL' ? bills :
    bills.filter(b => b.status === filter);

  const statusCounts = bills.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const title = user?.role === 'ADMIN' ? 'All Bills' : 'My Open Requests';

  return (
    <PageLayout title={title}>
      <div className="dashboard">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon"><i className="fas fa-file-invoice"></i></div>
            <div className="stat-info">
              <div className="stat-value">{bills.length}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>
          <div className="stat-card submitted">
            <div className="stat-icon"><i className="fas fa-paper-plane"></i></div>
            <div className="stat-info">
              <div className="stat-value">{statusCounts['SUBMITTED'] || 0}</div>
              <div className="stat-label">Submitted</div>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
            <div className="stat-info">
              <div className="stat-value">{(statusCounts['APPROVED_BY_MANAGER'] || 0) + (statusCounts['APPROVED_BY_FINANCE'] || 0)}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          <div className="stat-card closed">
            <div className="stat-icon"><i className="fas fa-lock"></i></div>
            <div className="stat-info">
              <div className="stat-value">{statusCounts['CLOSED'] || 0}</div>
              <div className="stat-label">Closed</div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <div className="filter-tabs">
            {['ALL', 'DRAFT', 'SUBMITTED', 'APPROVED_BY_MANAGER', 'REJECTED_BY_MANAGER', 'CLOSED'].map(s => (
              <button
                key={s}
                className={`filter-tab ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          {(user?.role === 'EMPLOYEE' || user?.role === 'ADMIN') && (
            <Link to="/bills/create" className="btn-primary">
              <i className="fas fa-plus"></i> New Bill
            </Link>
          )}
        </div>

        {/* Bills Table */}
        {loading ? (
          <div className="loading-box"><i className="fas fa-spinner fa-spin"></i> Loading...</div>
        ) : filteredBills.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No bills found</p>
            {user?.role !== 'ADMIN' && (
              <Link to="/bills/create" className="btn-primary">Create your first bill</Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="bills-table">
              <thead>
                <tr>
                  <th>Bill No.</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Manager</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map(bill => (
                  <tr key={bill.id}>
                    <td><span className="bill-num">{bill.billNumber}</span></td>
                    <td>{bill.title}</td>
                    <td><span className="bill-type">{bill.billType?.replace(/_/g, ' ')}</span></td>
                    <td><strong>{formatCurrency(bill.amount)}</strong></td>
                    <td><StatusBadge status={bill.status} /></td>
                    <td>{bill.assignedManagerName || '-'}</td>
                    <td>{formatDate(bill.createdAt)}</td>
                    <td>
                      <Link to={`/bills/${bill.id}`} className="btn-view">View</Link>
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

export default Dashboard;
