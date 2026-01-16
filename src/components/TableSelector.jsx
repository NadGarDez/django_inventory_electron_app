import React from 'react';

const TableSelector = ({ tipoActual, onChange }) => {
    // Paleta de colores idéntica a la de la Tabla para coherencia total
    const colores = {
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
        { id: 'existencia', label: 'Existencias' },
        { id: 'entrada', label: 'Entradas' },
        { id: 'salida', label: 'Salidas' }
    ];

    return (
        <div style={{
            display: 'flex',
            gap: '2px',
            width: '100%',
            borderBottom: `2px solid ${colores[tipoActual].primario}`, // La línea base cambia de color
            paddingBottom: 1,
            transition: 'border-color 0.3s ease'
        }}>
            {opciones.map((opcion) => {
                const esActivo = tipoActual === opcion.id;
                const colorTema = colores[opcion.id].primario;
                const fondoTema = colores[opcion.id].fondo;

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
                            borderBottom: `2px solid transparent`,
                            borderRadius: '8px 8px 0 0',

                            transition: 'all 0.2s ease',

                            // Lógica de colores dinámica
                            backgroundColor: esActivo ? colorTema : '#f8f9fa',
                            color: esActivo ? '#fff' : '#718096',
                            outline: 'none',

                            // Efecto de elevación al estar activo
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
    );
};

export default TableSelector;