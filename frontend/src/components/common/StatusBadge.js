import React from 'react';
import { STATUS_LABELS } from '../../utils/constants';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const config = STATUS_LABELS[status] || { label: status, color: '#333', bg: '#eee' };
  return (
    <span className="status-badge" style={{ color: config.color, backgroundColor: config.bg }}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
