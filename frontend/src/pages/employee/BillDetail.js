import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billService } from '../../services/services';
import PageLayout from '../../components/layout/PageLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/constants';
import { toast } from 'react-toastify';
import './BillDetail.css';

const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billService.getBillById(id)
      .then(res => setBill(res.data.data))
      .catch(() => toast.error('Failed to load bill'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLayout title="Bill Details"><div className="loading-box"><i className="fas fa-spinner fa-spin"></i> Loading...</div></PageLayout>;
  if (!bill) return <PageLayout title="Bill Details"><div className="loading-box">Bill not found</div></PageLayout>;

  return (
    <PageLayout title="Bill Details">
      <div className="bill-detail">
        <div className="detail-header">
          <div>
            <div className="bill-num-large">{bill.billNumber}</div>
            <h2>{bill.title}</h2>
          </div>
          <div className="header-right">
            <StatusBadge status={bill.status} />
            <button className="btn-back" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h3><i className="fas fa-info-circle"></i> Bill Information</h3>
            <div className="detail-rows">
              <div className="detail-row">
                <span>Bill Number</span><strong>{bill.billNumber}</strong>
              </div>
              <div className="detail-row">
                <span>Bill Type</span><strong>{bill.billType?.replace(/_/g, ' ')}</strong>
              </div>
              <div className="detail-row">
                <span>Amount</span><strong className="amount">{formatCurrency(bill.amount)}</strong>
              </div>
              <div className="detail-row">
                <span>Status</span><StatusBadge status={bill.status} />
              </div>
              <div className="detail-row">
                <span>Description</span><span>{bill.description || '-'}</span>
              </div>
              <div className="detail-row">
                <span>Created</span><span>{formatDate(bill.createdAt)}</span>
              </div>
              {bill.closedAt && (
                <div className="detail-row">
                  <span>Closed</span><span>{formatDate(bill.closedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-card">
            <h3><i className="fas fa-users"></i> People</h3>
            <div className="detail-rows">
              <div className="detail-row">
                <span>Employee</span><strong>{bill.createdByName}</strong>
              </div>
              <div className="detail-row">
                <span>Department</span><span>{bill.createdByDept}</span>
              </div>
              <div className="detail-row">
                <span>Manager</span><strong>{bill.assignedManagerName || '-'}</strong>
              </div>
              {bill.financeManagerName && (
                <div className="detail-row">
                  <span>Finance Manager</span><strong>{bill.financeManagerName}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline / Comments */}
        <div className="timeline-card">
          <h3><i className="fas fa-history"></i> Activity Timeline</h3>
          {bill.comments?.length === 0 ? (
            <p className="no-comments">No activity yet</p>
          ) : (
            <div className="timeline">
              {bill.comments?.map(c => (
                <div key={c.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{c.commentedByName}</strong>
                      <span className="timeline-action">{c.action?.replace(/_/g, ' ')}</span>
                      <span className="timeline-date">{formatDate(c.createdAt)}</span>
                    </div>
                    <p>{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default BillDetail;
