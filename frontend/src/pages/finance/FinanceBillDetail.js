import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billService } from '../../services/services';
import PageLayout from '../../components/layout/PageLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate, STATUS_LABELS } from '../../utils/constants';
import { toast } from 'react-toastify';
import '../employee/BillDetail.css';
import '../manager/ManagerBillDetail.css';

const FinanceBillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    billService.getBillById(id)
      .then(res => setBill(res.data.data))
      .catch(() => toast.error('Failed to load bill'));
  }, [id]);

  const handleAction = async (action) => {
    if (!comment.trim()) { toast.error('Comment is required'); return; }
    setActionLoading(action);
    try {
      let res;
      if (action === 'approve') {
        res = await billService.approveBillByFinance(id, { comment });
        toast.success('Bill approved by finance!');
      } else if (action === 'reject') {
        res = await billService.rejectBillByFinance(id, { comment });
        toast.success('Bill rejected. Employee notified.');
      } else {
        res = await billService.closeBill(id, { comment });
        toast.success('Bill completed! Amount credited to employee.');
      }
      setBill(res.data.data);
      setComment('');
      setTimeout(() => navigate('/finance/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (!bill) return (
    <PageLayout title="Process Bill">
      <div className="loading-box"><i className="fas fa-spinner fa-spin"></i> Loading...</div>
    </PageLayout>
  );

  const canApprove = bill.status === 'APPROVED_BY_MANAGER';
  const canClose = bill.status === 'APPROVED_BY_FINANCE';

  return (
    <PageLayout title="Process Bill">
      <div className="manager-bill-detail">
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
            <h3><i className="fas fa-file-invoice"></i> Bill Information</h3>
            <div className="detail-rows">
              <div className="detail-row"><span>Bill Number</span><strong>{bill.billNumber}</strong></div>
              <div className="detail-row"><span>Type</span><strong>{bill.billType?.replace(/_/g, ' ')}</strong></div>
              <div className="detail-row"><span>Amount</span><strong className="amount">{formatCurrency(bill.amount)}</strong></div>
              <div className="detail-row"><span>Status</span><StatusBadge status={bill.status} /></div>
              <div className="detail-row"><span>Description</span><span>{bill.description || '-'}</span></div>
            </div>
          </div>
          <div className="detail-card">
            <h3><i className="fas fa-user"></i> Employee Details</h3>
            <div className="detail-rows">
              <div className="detail-row"><span>Employee Name</span><strong>{bill.createdByName}</strong></div>
              <div className="detail-row"><span>Department</span><span>{bill.createdByDept}</span></div>
              <div className="detail-row"><span>Email</span><span>{bill.createdByEmail}</span></div>
              <div className="detail-row"><span>Manager</span><strong>{bill.assignedManagerName || '-'}</strong></div>
            </div>
          </div>
        </div>

        {bill.comments?.length > 0 && (
          <div className="timeline-card timeline-card-spaced">
            <h3><i className="fas fa-history"></i> Activity</h3>
            <div className="timeline">
              {bill.comments.map(c => (
                <div key={c.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{c.commentedByName}</strong>
                      <span className="timeline-action">{STATUS_LABELS[c.action]?.label || c.action?.replace(/_/g, ' ')}</span>
                      <span className="timeline-date">{formatDate(c.createdAt)}</span>
                    </div>
                    <p>{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(canApprove || canClose) && (
          <div className="action-card">
            <h3><i className="fas fa-coins"></i> Finance Action</h3>
            <p className="action-note">
              {canApprove ? 'Review and approve or reject this bill.' : 'Credit the amount and close this bill.'}
            </p>
            <textarea
              placeholder="Enter comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
            />
            <div className="action-buttons">
              {canApprove && (
                <>
                  <button className="btn-reject" onClick={() => handleAction('reject')} disabled={actionLoading !== null}>
                    {actionLoading === 'reject'
                      ? <><i className="fas fa-spinner fa-spin"></i> Rejecting...</>
                      : <><i className="fas fa-times-circle"></i> Reject</>
                    }
                  </button>
                  <button className="btn-approve" onClick={() => handleAction('approve')} disabled={actionLoading !== null}>
                    {actionLoading === 'approve'
                      ? <><i className="fas fa-spinner fa-spin"></i> Approving...</>
                      : <><i className="fas fa-check-circle"></i> Approve</>
                    }
                  </button>
                </>
              )}
              {canClose && (
                <button className="btn-close-bill" onClick={() => handleAction('close')} disabled={actionLoading !== null}>
                  {actionLoading === 'close'
                    ? <><i className="fas fa-spinner fa-spin"></i> Closing...</>
                    : <><i className="fas fa-lock"></i> Credit &amp; Close Bill</>
                  }
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FinanceBillDetail;
