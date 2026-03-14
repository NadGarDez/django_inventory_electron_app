import React from 'react';
import { formatCurrencyDisplay } from '../utils/formatters';

const formatValue = (value, format, exchangeRate, showUsdConversion) => {
  if (value === null || value === undefined || value === '') return '—';

  if (format === 'currency') {
    return formatCurrencyDisplay(value, { exchangeRate, showUsdConversion });
  }

  return value;
};

const Cell = ({ value, format, exchangeRate, showUsdConversion }) => {
  return (
    <td style={{ border: '1px solid #dee2e6', padding: '8px 10px', textAlign: format === 'currency' ? 'right' : 'left', whiteSpace: 'nowrap' }}>
      {formatValue(value, format, exchangeRate, showUsdConversion)}
    </td>
  );
};

export default Cell;