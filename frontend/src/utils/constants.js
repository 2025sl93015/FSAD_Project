export const STATUS_LABELS = {
  DRAFT: { label: 'Draft', color: '#6c757d', bg: '#f8f9fa' },
  SUBMITTED: { label: 'Submitted', color: '#1a73e8', bg: '#e8f0fe' },
  APPROVED_BY_MANAGER: { label: 'Manager Approved', color: '#34a853', bg: '#e6f4ea' },
  REJECTED_BY_MANAGER: { label: 'Manager Rejected', color: '#ea4335', bg: '#fce8e6' },
  APPROVED_BY_FINANCE: { label: 'Finance Approved', color: '#1e8e3e', bg: '#ceead6' },
  REJECTED_BY_FINANCE: { label: 'Finance Rejected', color: '#c5221f', bg: '#fcd0cd' },
  CLOSED: { label: 'Completed', color: '#137333', bg: '#c2e7cf' },
};

export const BILL_TYPES = [
  'TRAVEL', 'MEDICAL', 'FOOD', 'ACCOMMODATION',
  'TRAINING', 'OFFICE_SUPPLIES', 'COMMUNICATION', 'ENTERTAINMENT', 'OTHER'
];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
