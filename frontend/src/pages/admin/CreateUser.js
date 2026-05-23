import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/services';
import PageLayout from '../../components/layout/PageLayout';
import { toast } from 'react-toastify';
import '../employee/CreateBill.css';

const ROLES = ['EMPLOYEE', 'MANAGER', 'FINANCE_MANAGER', 'ADMIN'];

const CreateUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', fullName: '', email: '',
    department: '', role: 'EMPLOYEE', managerId: ''
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminService.getManagers().then(res => setManagers(res.data.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, managerId: form.managerId ? parseInt(form.managerId) : null };
      await adminService.createUser(payload);
      toast.success('User created successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Create New User">
      <div style={{maxWidth: '600px'}}>
        <div className="bill-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title"><i className="fas fa-user-plus"></i> User Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input name="fullName" placeholder="John Doe" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Username <span className="required">*</span></label>
                  <input name="username" placeholder="johndoe" value={form.username} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input name="email" type="email" placeholder="john@company.com" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password <span className="required">*</span></label>
                  <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department <span className="required">*</span></label>
                  <input name="department" placeholder="e.g., Engineering" value={form.department} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Role <span className="required">*</span></label>
                  <select name="role" value={form.role} onChange={handleChange} required>
                    {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>

              {form.role === 'EMPLOYEE' && (
                <div className="form-group" style={{marginTop: '4px'}}>
                  <label>Assign Manager</label>
                  <select name="managerId" value={form.managerId} onChange={handleChange}>
                    <option value="">-- Select Manager --</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.fullName} ({m.department})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/dashboard')}>
                <i className="fas fa-times"></i> Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : <><i className="fas fa-user-plus"></i> Create User</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateUser;
