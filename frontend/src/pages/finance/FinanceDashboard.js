import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { billService } from '../../services/services';
import PageLayout from '../../components/layout/PageLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/constants';
import { toast } from 'react-toastify';
import '../employee/Dashboard.css';

const FinanceDashboard = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billService.getFinancePending()
      .then(res => setBills(res.data.data || []))
      .catch(() => toast.error('Failed to load bills'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout title="Finance Queue">
      <div>
        {loading ? (
          <div className="loading-box"><i className="fas fa-spinner fa-spin"></i> Loading...</div>
        ) : bills.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-check-double"></i>
            <p>No bills pending finance review</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="bills-table">
              <thead>
                <tr>
                  <th>Bill No.</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Manager Approved</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id}>
                    <td><span className="bill-num">{bill.billNumber}</span></td>
                    <td><strong>{bill.createdByName}</strong></td>
                    <td>{bill.createdByDept}</td>
                    <td>{bill.title}</td>
                    <td><span className="bill-type">{bill.billType?.replace(/_/g, ' ')}</span></td>
                    <td><strong>{formatCurrency(bill.amount)}</strong></td>
                    <td><StatusBadge status={bill.status} /></td>
                    <td>{formatDate(bill.updatedAt)}</td>
                    <td>
                      <Link to={`/finance/bills/${bill.id}`} className="btn-view">Process</Link>
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

export default FinanceDashboard;
