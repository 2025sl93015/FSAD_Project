import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billService, userService } from '../../services/services';
import { useAuth } from '../../context/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { BILL_TYPES } from '../../utils/constants';
import { toast } from 'react-toastify';
import './CreateBill.css';

const CreateBill = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    billType: '',
    amount: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userService.getProfile().then(res => setProfile(res.data.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.billType || !form.amount) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      const billBlob = new Blob([JSON.stringify({
        ...form,
        amount: parseFloat(form.amount)
      })], { type: 'application/json' });
      formData.append('bill', billBlob);
      if (attachment) formData.append('attachment', attachment);

      const res = await billService.createBill(formData);
      const bill = res.data.data;
      toast.success('Bill created successfully!');

      // Auto-submit
      await billService.submitBill(bill.id);
      toast.success('Bill submitted for manager approval!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Create New Bill">
      <div className="create-bill-page">
        <div className="bill-form-card">
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-user"></i> Employee Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Employee Name</label>
                <div className="info-value">{profile?.fullName || user?.fullName}</div>
              </div>
              <div className="info-item">
                <label>Department</label>
                <div className="info-value">{profile?.department || '-'}</div>
              </div>
              <div className="info-item">
                <label>Manager</label>
                <div className="info-value">{profile?.managerName || 'Not Assigned'}</div>
              </div>
              <div className="info-item">
                <label>Role</label>
                <div className="info-value">{user?.role}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title"><i className="fas fa-file-invoice"></i> Bill Details</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Bill Title <span className="required">*</span></label>
                  <input
                    name="title"
                    placeholder="e.g., Business trip to Mumbai"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bill Type <span className="required">*</span></label>
                  <select name="billType" value={form.billType} onChange={handleChange} required>
                    <option value="">Select bill type</option>
                    {BILL_TYPES.map(t => (
                      <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (INR) <span className="required">*</span></label>
                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Attachment</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setAttachment(e.target.files[0])}
                  />
                  <small>PDF, JPG, PNG - Max 10MB</small>
                </div>
              </div>

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe the purpose of this reimbursement..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-times"></i> Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading
                  ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</>
                  : <><i className="fas fa-paper-plane"></i> Create &amp; Submit Bill</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateBill;
