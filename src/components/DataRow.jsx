import React, { useMemo } from 'react';
import Cell from './Cell';
import { formatDateTime } from '../utils/formatters';

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

const DataRow = ({ row, index, columnas, estilo, onEdit, onDelete, exchangeRate, showUsdConversion }) => {
    const formattedRow = useMemo(() => {
        return {
            ...row,
            fecha: formatDateTime(row.fecha),
            ultima_actualizacion: formatDateTime(row.ultima_actualizacion),
            producto_timestamp: formatDateTime(row.producto_timestamp),
            cantidad: row.cantidad ?? row.stock_actual ?? 0,
            stock_actual: row.stock_actual ?? row.cantidad ?? 0,
            nombre_producto: row.nombre_producto ?? row.nombre ?? '',
            producto: row.producto ?? '',
            precio_compra_actual: row.precio_compra_actual ?? '0.00',
            precio_venta_actual: row.precio_venta_actual ?? '0.00',
            valor_inventario_compra: row.valor_inventario_compra ?? '0.00',
            valor_inventario_venta: row.valor_inventario_venta ?? '0.00',
            precio_unitario_historico: row.precio_unitario_historico ?? '0.00',
            valor_movimiento: row.valor_movimiento ?? '0.00'
        };
    }, [row]);

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
                                onClick={() => onEdit(row)}
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
                        key={`${formattedRow.id || index}-${col.key}`}
                        value={formattedRow[col.key]}
                        format={col.format}
                        exchangeRate={exchangeRate}
                        showUsdConversion={showUsdConversion}
                    />
                )
            ))}
        </tr>
    );
};

export default DataRow;