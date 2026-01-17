import React, { useState } from 'react';

const RowForm = ({ tipo, onSave, isLoading, columnas }) => {

    const [formData, setFormData] = useState({});

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleClear = () => {
        setFormData({});
        // Opcional: podrías agregar lógica para limpiar los inputs nativos si fuera necesario
    };

    return (
        <tr style={{
            backgroundColor: '#fffdf0', // Color crema suave para diferenciar que es edición
            filter: isLoading ? 'blur(2px)' : 'none',
            pointerEvents: isLoading ? 'none' : 'auto',
            transition: 'all 0.3s ease'
        }}>
            {/* Índice de fila (Vacío o con un símbolo +) */}
            <td style={{
                textAlign: 'center',
                backgroundColor: '#fefcbf',
                border: '1px solid #ecc94b',
                fontWeight: 'bold',
                color: '#b7791f'
            }}>
                {isLoading ? '...' : '+'}
            </td>

            {columnas.map((col) => (
                <td key={col.key} style={{ border: '1px solid #ecc94b', padding: '4px' }}>
                    {col.key === 'acciones' ? (
                        /* Renderizado especial para la columna de acciones */
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                                onClick={() => onSave(formData)}
                                style={{ ...btnAccionStyle, backgroundColor: '#78beb2ff', color: 'white' }}
                                title="Guardar Registro"
                            >
                                💾
                            </button>
                            <button
                                onClick={() => setFormData({})}
                                style={{ ...btnAccionStyle, backgroundColor: '#fab8b8ff', color: 'white' }}
                                title="Limpiar campos"
                            >
                                🗑️
                            </button>
                        </div>
                    ) : (
                        /* Renderizado normal para campos de datos */
                        <input
                            type="text"
                            placeholder={col.label}
                            value={formData[col.key] || ''}
                            style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                fontSize: '13px',
                                padding: '5px'
                            }}
                            onChange={(e) => handleChange(col.key, e.target.value)}
                        />
                    )}
                </td>
            ))}
        </tr>
    );
};



// Estilos unificados
const btnAccionStyle = {
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
};

export default RowForm;