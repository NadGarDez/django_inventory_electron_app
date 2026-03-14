import React from 'react';
import { formatCurrency } from '../utils/formatters';

const formatValue = (value, format) => {
  if (value === null || value === undefined || value === '') return '—';

  if (format === 'currency') {
    return formatCurrency(value);
  }

  return value;
};

const Cell = ({ value, format }) => {
  return (
    <td style={{ border: '1px solid #dee2e6', padding: '8px 10px', textAlign: format === 'currency' ? 'right' : 'left', whiteSpace: 'nowrap' }}>
      {formatValue(value, format)}
    </td>
  );
};

export default Cell;