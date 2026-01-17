import React, { useState } from 'react';
import Table from './components/Table';
import TableSelector from './components/TableSelector';

const datosEstaticos = {
    existencia: [
        { id: 1, sku: 'PROD-001', nombre: 'Laptop Gamer', cantidad_actual: 15, precio: 1200 },
        { id: 2, sku: 'PROD-002', nombre: 'Monitor 24"', cantidad_actual: 30, precio: 200 },
        { id: 3, sku: 'PROD-003', nombre: 'Teclado Mecánico', cantidad_actual: 50, precio: 80 },
    ],
    entrada: [
        { id: 101, fecha: '2026-01-15', producto_nombre: 'Laptop Gamer', cantidad: 5, usuario: 'Admin', observaciones: 'Compra proveedor A' },
    ],
    salida: [
        { id: 201, fecha: '2026-01-16', producto_nombre: 'Monitor 24"', cantidad: 2, usuario: 'Vendedor 1', observaciones: 'Venta cliente final' },
    ]
};


const Main = () => {
    const [tipoActual, setTipoActual] = useState('existencia');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const alCrear = (registro) => {
        console.log("Registro guardado:", registro);
        setMostrarFormulario(false);
    }
   
    const cancel = () => {
        console.log("Acción cancelada");
        setMostrarFormulario(false);
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',          // Altura fija total
            backgroundColor: '#1a202c',
            overflow: 'hidden'        // Evita que el body haga scroll
        }}>
            <div style={{
                width: '80%',
                maxWidth: '1000px',
                maxHeight: '80vh',          // El contenedor blanco tiene altura fija
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                display: 'flex',         // Flexbox para organizar el interior
                flexDirection: 'column'
            }}>

                {/* Encabezado fijo */}
                <div style={{ flexShrink: 0, marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#2d3748', fontSize: '24px' }}>Inventario</h2>
                    <p style={{ margin: '5px 0 0', color: '#718096', fontSize: '14px' }}>
                        Gestión de stock y movimientos
                    </p>
                </div>

                {/* Selector fijo */}
                <div style={{ flexShrink: 0 }}>
                    <TableSelector tipoActual={tipoActual} onChange={setTipoActual} />
                </div>

                {/* Contenedor de la Tabla que SI hace scroll */}
                <div style={{
                    flexGrow: 1,           // Toma todo el espacio disponible
                    overflowY: 'auto',     // Habilita scroll vertical solo aquí
                    marginTop: '20px',
                    border: '1px solid #edf2f7'
                }}>
                    <Table data={datosEstaticos[tipoActual]} tipo={tipoActual} alCrear={alCrear} cancel={cancel} mostrarFormulario={mostrarFormulario} />
                </div>

                {/* Footer fijo */}
                <div style={{
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid #edf2f7',
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#a0aec0',
                    fontSize: '12px'
                }}>
                    <span>Estado: Conectado</span>
                    <span>{datosEstaticos[tipoActual].length} filas cargadas</span>
                </div>
            </div>
        </div>
    );
};

export default Main;