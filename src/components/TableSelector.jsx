import React from 'react';

const TableSelector = ({ tipoActual, onChange, onAdd, canAdd }) => {
    // Paleta de colores idéntica a la de la Tabla para coherencia total
    const colores = {
        productos: {
            primario: '#4c51bf',
            fondo: '#ebf4ff',
        },
        existencia: {
            primario: '#3182ce', // Azul
            fondo: '#ebf8ff',
        },
        entrada: {
            primario: '#38a169', // Verde
            fondo: '#e6fffa',
        },
        salida: {
            primario: '#e53e3e', // Rojo
            fondo: '#fff5f5',
        }
    };

    const opciones = [
        { id: 'productos', label: 'Productos' },
        { id: 'existencia', label: 'Existencias' },
        { id: 'entrada', label: 'Entradas' },
        { id: 'salida', label: 'Salidas' }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between', // Separa las pestañas del botón de agregar
            alignItems: 'flex-end',
            width: '100%',
            borderBottom: `2px solid ${colores[tipoActual].primario}`,
            paddingBottom: 0,
            transition: 'border-color 0.3s ease',
            paddingBottom:1
        }}>
            {/* Contenedor de Pestañas */}
            <div style={{ display: 'flex', gap: '2px' }}>
                {opciones.map((opcion) => {
                    const esActivo = tipoActual === opcion.id;
                    const colorTema = colores[opcion.id].primario;

                    return (
                        <button
                            key={opcion.id}
                            onClick={() => onChange(opcion.id)}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                border: '1px solid #dee2e6',
                                borderBottom: 'none',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.2s ease',
                                backgroundColor: esActivo ? colorTema : '#f8f9fa',
                                color: esActivo ? '#fff' : '#718096',
                                outline: 'none',
                                transform: esActivo ? 'translateY(0)' : 'translateY(2px)',
                                boxShadow: esActivo ? '0 -2px 10px rgba(0,0,0,0.1)' : 'none',
                                zIndex: esActivo ? 2 : 1
                            }}
                        >
                            {opcion.label}
                        </button>
                    );
                })}
            </div>

            {/* Botón Nuevo Registro al final de la línea */}
            {canAdd && (
                <button
                    onClick={onAdd}
                    style={{
                        marginBottom: '1px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: colores[tipoActual].primario,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'opacity 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <span style={{ fontSize: '16px' }}>+</span> Nuevo Registro
                </button>
            )}
        </div>
    );
};

export default TableSelector;