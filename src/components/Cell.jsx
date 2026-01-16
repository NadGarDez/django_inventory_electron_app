import React from 'react';

const Cell = ({ value, label }) => {
  // Por ahora solo imprimimos el texto
  return (
    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
      {value}
    </td>
  );
};

export default Cell;