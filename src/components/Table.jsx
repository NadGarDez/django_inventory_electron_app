import React, { useState } from 'react';
import RowForm from './RowForm';
import DataRow from './DataRow';

const Table = ({ data, tipo, mostrarFormulario=false, alCrear, cancel }) => {
    const [estaCargando, setEstaCargando] = useState(false);

    const temas = {
        entrada: { headerBg: '#a4fdebff', headerText: '#234e52', accent: '#38a169', rowIdxBg: '#f0fff4' },
        salida: { headerBg: '#fca3a3ff', headerText: '#742a2a', accent: '#e53e3e', rowIdxBg: '#fff5f5' },
        existencia: { headerBg: '#a5defdff', headerText: '#2a4365', accent: '#3182ce', rowIdxBg: '#ebf8ff' }
    };

    const estilo = temas[tipo] || temas.existencia;

    const configurarColumnas = () => {
        let cols = (tipo === 'existencia') 
            ? [{ key: 'sku', label: 'SKU' }, { key: 'nombre', label: 'Producto' }, { key: 'cantidad_actual', label: 'Stock' }, { key: 'precio', label: 'Precio' }]
            : [{ key: 'fecha', label: 'Fecha' }, { key: 'producto_nombre', label: 'Producto' }, { key: 'cantidad', label: 'Cant.' }, { key: 'usuario', label: 'User' }];
        
        return [...cols, { key: 'acciones', label: 'Acciones' }];
    };

    const columnas = configurarColumnas();

    const handleGuardar = async (nuevoRegistro) => {
        setEstaCargando(true);
        setTimeout(() => {
            alCrear(nuevoRegistro);
            setEstaCargando(false);
        }, 1500);
    };

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            

            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
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
                    {/* Renderizado Condicional */}
                    {mostrarFormulario && (
                        <RowForm
                            tipo={tipo}
                            onSave={handleGuardar}
                            onCancel={cancel}
                            isLoading={estaCargando}
                            columnas={columnas}
                        />
                    )}

                    {data.map((row, index) => (
                        <DataRow
                            key={row.id || index}
                            row={row}
                            index={index}
                            columnas={columnas}
                            estilo={estilo}
                            onEdit={(id) => console.log("Editando", id)}
                            onDelete={(id) => console.log("Borrando", id)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Estilos compartidos
const btnAccionStyle = {
    cursor: 'pointer', border: 'none', borderRadius: '4px',
    padding: '6px 10px', fontSize: '14px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

export default Table;