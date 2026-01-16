import React from 'react';
import Cell from './Cell';

const Table = ({ data, tipo }) => {
  // Definición de la paleta de colores según el tipo
  const temas = {
    entrada: {
      headerBg: '#a4fdebff', // Verde muy claro
      headerText: '#234e52', // Verde oscuro
      accent: '#38a169',     // Verde principal (bordes/índice)
      rowIdxBg: '#f0fff4'    // Fondo índice verde
    },
    salida: {
      headerBg: '#fca3a3ff', // Rojo muy claro
      headerText: '#742a2a', // Rojo oscuro
      accent: '#e53e3e',     // Rojo principal
      rowIdxBg: '#fff5f5'    // Fondo índice rojo
    },
    existencia: {
      headerBg: '#a5defdff', // Azul/Índigo claro
      headerText: '#2a4365', // Azul oscuro
      accent: '#3182ce',     // Azul principal
      rowIdxBg: '#ebf8ff'    // Fondo índice azul
    }
  };

  const estilo = temas[tipo] || temas.existencia;

  const configurarColumnas = () => {
    if (tipo === 'existencia') return [
      { key: 'sku', label: 'SKU' },
      { key: 'nombre', label: 'Producto' },
      { key: 'cantidad_actual', label: 'Stock' },
      { key: 'precio', label: 'Precio' }
    ];
    return [
      { key: 'fecha', label: 'Fecha' },
      { key: 'producto_nombre', label: 'Producto' },
      { key: 'cantidad', label: 'Cant.' },
      { key: 'usuario', label: 'User' }
    ];
  };

  const columnas = configurarColumnas();

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
      <thead>
        <tr>
          {/* Índice de esquina con el color de acento del tema */}
          <th style={{ 
            width: '45px', 
            position: 'sticky', 
            top: 0, 
            left: 0, 
            backgroundColor: estilo.accent, 
            color: 'white',
            zIndex: 3, 
            border: `1px solid ${estilo.accent}`,
            fontSize: '10px'
          }}>ID</th>
          
          {columnas.map((col) => (
            <th key={col.key} style={{ 
              position: 'sticky', 
              top: 0, 
              backgroundColor: estilo.headerBg, 
              color: estilo.headerText,
              zIndex: 2, 
              border: '1px solid #dee2e6', 
              padding: '12px', 
              textAlign: 'left',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id || index} className="table-row">
            {/* El ID lateral de Excel ahora tiene el tono del tema */}
            <td style={{ 
              backgroundColor: estilo.rowIdxBg, 
              border: `1px solid ${estilo.accent}44`, // 44 es transparencia
              textAlign: 'center', 
              fontSize: '11px', 
              color: estilo.accent,
              fontWeight: 'bold',
              position: 'sticky',
              left: 0,
              zIndex: 1
            }}>
              {index + 1}
            </td>

            {columnas.map((col) => (
              <Cell 
                key={`${row.id}-${col.key}`} 
                value={row[col.key]} 
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;