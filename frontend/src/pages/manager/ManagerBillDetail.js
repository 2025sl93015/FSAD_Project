import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billService } from '../../services/services';
import PageLayout from '../../components/layout/PageLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/constants';
import { toast } from 'react-toastify';
import './ManagerBillDetail.css';

const ManagerBillDetail = () => {
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
    if (!comment.trim()) {
      toast.error('Comment is required');
      return;
    }
    setActionLoading(action);
    try {
      let res;
      if (action === 'approve') {
        res = await billService.approveBillByManager(id, { comment });
        toast.success('Bill approved and sent to Finance!');
      } else {
        res = await billService.rejectBillByManager(id, { comment });
        toast.success('Bill rejected. Employee has been notified.');
      }
      setBill(res.data.data);
      setComment('');
      setTimeout(() => navigate('/manager/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (!bill) return <PageLayout title="Review Bill"><div className="loading-box"><i className="fas fa-spinner fa-spin"></i> Loading...</div></PageLayout>;

  const isPending = bill.status === 'SUBMITTED';

  return (
    <PageLayout title="Review Bill">
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
              <div className="detail-row"><span>Submitted</span><span>{formatDate(bill.createdAt)}</span></div>
            </div>
          </div>

          <div className="detail-card">
            <h3><i className="fas fa-user"></i> Employee Details</h3>
            <div className="detail-rows">
              <div className="detail-row"><span>Employee Name</span><strong>{bill.createdByName}</strong></div>
              <div className="detail-row"><span>Department</span><span>{bill.createdByDept}</span></div>
              <div className="detail-row"><span>Email</span><span>{bill.createdByEmail}</span></div>
            </div>
          </div>
        </div>

        {/* Previous Comments */}
        {bill.comments?.length > 0 && (
          <div className="timeline-card" style={{marginBottom: '20px'}}>
            <h3><i className="fas fa-history"></i> Activity</h3>
            <div className="timeline">
              {bill.comments.map(c => (
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
          </div>
        )}

        {isPending && (
          <div className="action-card">
            <h3><i className="fas fa-gavel"></i> Take Action</h3>
            <p className="action-note">Your comment is mandatory for both approval and rejection.</p>
            <textarea
              placeholder="Enter your comment / reason..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
            />
            <div className="action-buttons">
              <button
                className="btn-reject"
                onClick={() => handleAction('reject')}
                disabled={actionLoading !== null}
              >
                {actionLoading === 'reject'
                  ? <><i className="fas fa-spinner fa-spin"></i> Rejecting...</>
                  : <><i className="fas fa-times-circle"></i> Reject Bill</>
                }
              </button>
              <button
                className="btn-approve"
                onClick={() => handleAction('approve')}
                disabled={actionLoading !== null}
              >
                {actionLoading === 'approve'
                  ? <><i className="fas fa-spinner fa-spin"></i> Approving...</>
                  : <><i className="fas fa-check-circle"></i> Approve Bill</>
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ManagerBillDetail;
