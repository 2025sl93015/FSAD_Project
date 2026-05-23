import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminService } from '../../services/services';
import PageLayout from '../../components/layout/PageLayout';
import { toast } from 'react-toastify';
import '../employee/CreateBill.css';

const ROLES = ['EMPLOYEE', 'MANAGER', 'FINANCE_MANAGER', 'ADMIN'];

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', fullName: '', email: '',
    department: '', role: 'EMPLOYEE', managerId: ''
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      adminService.getUserById(id),
      adminService.getManagers()
    ]).then(([userRes, mgrsRes]) => {
      const u = userRes.data.data;
      setForm({
        username: u.username,
        password: '',
        fullName: u.fullName,
        email: u.email,
        department: u.department,
        role: u.role,
        managerId: u.managerId || ''
      });
      setManagers(mgrsRes.data.data || []);
    }).catch(() => toast.error('Failed to load user'));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, managerId: form.managerId ? parseInt(form.managerId) : null };
      await adminService.updateUser(id, payload);
      toast.success('User updated successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Edit User">
      <div className="form-page-wrapper">
        <div className="bill-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title"><i className="fas fa-user-edit"></i> Edit User</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input name="username" value={form.username} disabled className="input-disabled" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>New Password <small className="label-hint">(leave blank to keep)</small></label>
                  <input name="password" type="password" placeholder="Enter new password" value={form.password} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department <span className="required">*</span></label>
                  <input name="department" value={form.department} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Role <span className="required">*</span></label>
                  <select name="role" value={form.role} onChange={handleChange} required>
                    {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>

              {form.role === 'EMPLOYEE' && (
                <div className="form-group">
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
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default EditUser;
