import React from 'react';
import Cell from './Cell';

// Estilos unificados para botones
const btnAccionStyle = {
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
};

const colores = {
    eliminar: '#e53e3e',
    editar: '#3182ce'
};

const DataRow = ({ row, index, columnas, estilo, onEdit, onDelete , alCrear}) => {
    return (
        <tr className="table-row">
            {/* Índice lateral estilo Excel */}
            <td style={{
                backgroundColor: estilo.rowIdxBg,
                border: `1px solid ${estilo.accent}44`,
                textAlign: 'center',
                fontSize: '11px',
                color: estilo.accent,
                fontWeight: 'bold',
                position: 'sticky',
                left: 0,
                zIndex: 1,
                minWidth: '45px'
            }}>
                {index + 1}
            </td>

            {columnas.map((col) => (
                col.key === 'acciones' ? (
                    <td key={`${row.id || index}-acciones`} style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                                onClick={() => onEdit(row.id)}
                                style={{ ...btnAccionStyle, backgroundColor: '#afe3ffff', color: colores.editar }}
                                title="Editar"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => onDelete(row.id)}
                                style={{ ...btnAccionStyle, backgroundColor: '#fab8b8ff', color: colores.eliminar }}
                                title="Eliminar"
                            >
                                🗑️
                            </button>
                        </div>
                    </td>
                ) : (
                    <Cell
                        key={`${row.id || index}-${col.key}`}
                        value={row[col.key]}
                    />
                )
            ))}
        </tr>
    );
};

export default DataRow;