import React from 'react';
import DataRow from './DataRow';
import { formatCurrencyDisplay } from '../utils/formatters';

const Table = ({ data, tipo, editar, eliminar, resumen, exchangeRate, showUsdConversion }) => {
    const temas = {
        productos: { headerBg: '#c3dafe', headerText: '#2c5282', accent: '#4c51bf', rowIdxBg: '#ebf4ff' },
        entrada: { headerBg: '#a4fdebff', headerText: '#234e52', accent: '#38a169', rowIdxBg: '#f0fff4' },
        salida: { headerBg: '#fca3a3ff', headerText: '#742a2a', accent: '#e53e3e', rowIdxBg: '#fff5f5' },
        existencia: { headerBg: '#a5defdff', headerText: '#2a4365', accent: '#3182ce', rowIdxBg: '#ebf8ff' }
    };

    const estilo = temas[tipo] || temas.existencia;

    const configurarColumnas = () => {
        if (tipo === 'productos') {
            return [
                { key: 'sku', label: 'SKU' },
                { key: 'nombre', label: 'Producto' },
                { key: 'precio_compra_actual', label: 'Precio compra', format: 'currency' },
                { key: 'precio_venta_actual', label: 'Precio venta', format: 'currency' },
                { key: 'producto_timestamp', label: 'Actualizado en' },
                { key: 'acciones', label: 'Acciones' }
            ];
        }

        if (tipo === 'existencia') {
            return [
                { key: 'sku', label: 'SKU' },
                { key: 'nombre', label: 'Producto' },
                { key: 'cantidad', label: 'Stock' },
                { key: 'valor_inventario_compra', label: 'Costo total compra', format: 'currency' },
                { key: 'valor_inventario_venta', label: 'Costo total venta', format: 'currency' },
                { key: 'ultima_actualizacion', label: 'Última actualización' }
            ];
        }

        return [
            { key: 'fecha', label: 'Fecha y hora' },
            { key: 'producto', label: 'ID del producto' },
            { key: 'nombre_producto', label: 'Nbr. del producto' },
            { key: 'cantidad', label: 'Cant.' },
            { key: 'precio_unitario_historico', label: 'Precio unitario', format: 'currency' },
            { key: 'valor_movimiento', label: 'Valor movimiento', format: 'currency' }
        ];
    };

    const columnas = configurarColumnas();
    const mostrarFilaTotales = (tipo === 'entrada' || tipo === 'salida') && resumen;

    return (
        <div style={{ fontFamily: 'sans-serif', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '980px', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                <thead>
                    <tr>
                        <th style={{
                            width: '45px', position: 'sticky', top: 0, left: 0,
                            backgroundColor: estilo.accent, color: 'white', zIndex: 3,
                            border: `1px solid ${estilo.accent}`, fontSize: '10px'
                        }}>ID</th>

                        {columnas.map((col) => (
                            <th key={col.key} style={{
                                position: 'sticky', top: 0, backgroundColor: estilo.headerBg,
                                color: estilo.headerText, zIndex: 2, border: '1px solid #dee2e6',
                                padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700'
                            }}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <DataRow
                            key={row.id || index}
                            row={row}
                            index={index}
                            columnas={columnas}
                            estilo={estilo}
                            exchangeRate={exchangeRate}
                            showUsdConversion={showUsdConversion}
                            onEdit={(row) => editar(row)}
                            onDelete={(id) => eliminar(id)}
                        />
                    ))}
                    {mostrarFilaTotales && (
                        <tr>
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
                                Σ
                            </td>

                            {columnas.map((col) => {
                                if (col.key === 'fecha') {
                                    return <td key={col.key} style={summaryLabelStyle}>Total</td>;
                                }

                                if (col.key === 'cantidad') {
                                    return <td key={col.key} style={summaryValueStyle}>{resumen.total_unidades ?? 0}</td>;
                                }

                                if (col.key === 'valor_movimiento') {
                                    return (
                                        <td key={col.key} style={summaryValueStyle}>
                                            {formatCurrencyDisplay(resumen.total_movimientos, { exchangeRate, showUsdConversion })}
                                        </td>
                                    );
                                }

                                return <td key={col.key} style={summaryEmptyStyle}> </td>;
                            })}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const summaryBaseStyle = {
    border: '1px solid #dee2e6',
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
    fontWeight: 700,
    whiteSpace: 'nowrap'
};

const summaryLabelStyle = {
    ...summaryBaseStyle,
    color: '#2d3748'
};

const summaryValueStyle = {
    ...summaryBaseStyle,
    color: '#1a202c',
    textAlign: 'right'
};

const summaryEmptyStyle = {
    ...summaryBaseStyle,
    color: 'transparent'
};

export default Table;