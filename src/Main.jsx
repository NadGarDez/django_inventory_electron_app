import React, { useState } from 'react';
import Table from './components/Table';
import TableSelector from './components/TableSelector';
import ModalForm from './components/ModalForm'; // Importamos el modal

const datosEstaticos = {
    existencia: [
        { id: 1, sku: 'PROD-001', nombre: 'Laptop Gamer', cantidad_actual: 15, precio: 1200 },
        { id: 2, sku: 'PROD-002', nombre: 'Monitor 24"', cantidad_actual: 30, precio: 200 },
        { id: 3, sku: 'PROD-003', nombre: 'Teclado Mecánico', cantidad_actual: 50, precio: 80 },
    ],
    entrada: [
        { id: 101, fecha: '2026-01-15', producto_nombre: 'Laptop Gamer', cantidad: 5, usuario: 'Admin' },
    ],
    salida: [
        { id: 201, fecha: '2026-01-16', producto_nombre: 'Monitor 24"', cantidad: 2, usuario: 'Vendedor 1' },
    ]
};

const Main = () => {
    const [tipoActual, setTipoActual] = useState('existencia');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [estaCargando, setEstaCargando] = useState(false);

    const [activeRegistro, setActiveRegistro] = useState(null);

    const handleSave = async (datos) => {
        setEstaCargando(true);

        if (datos.id) {
            // CASO EDICIÓN (PUT/PATCH)
            console.log(`Actualizando registro ${datos.id} en Django...`, datos);
        } else {
            // CASO CREACIÓN (POST)
            console.log("Creando nuevo registro en Django...", datos);
        }
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
        } finally {
            setEstaCargando(false);
        }
    };


    const editar = (row) => {
        setActiveRegistro(row);
        setMostrarModal(true);
    }


    const crear = () => {
        setActiveRegistro(null);
        setMostrarModal(true);
    }

    const eliminar = (id) => {
        console.log("Eliminar ID:", id);
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '100vh', backgroundColor: '#1a202c', overflow: 'hidden'
        }}>
            {/* COMPONENTE MODAL */}
            <ModalForm
                isOpen={mostrarModal}
                onClose={() => setMostrarModal(false)}
                tipo={tipoActual}
                onSave={handleSave}
                isLoading={estaCargando}
                // Pasamos la lista de productos para el Select de transacciones
                productos={datosEstaticos.existencia}
                registroAEditar={activeRegistro}
            />

            <div style={{
                width: '80%', maxWidth: '1100px', maxHeight: '85vh',
                backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
            }}>

                {/* Encabezado */}
                <div style={{ flexShrink: 0, marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#2d3748', fontSize: '24px' }}>Inventario</h2>
                    <p style={{ margin: '5px 0 0', color: '#718096', fontSize: '14px' }}>
                        Gestión de stock y movimientos (Modelos Django)
                    </p>
                </div>

                {/* Selector con botón de "Nuevo" integrado */}
                <div style={{ flexShrink: 0 }}>
                    <TableSelector
                        tipoActual={tipoActual}
                        onChange={setTipoActual}
                        onAdd={crear}
                    />
                </div>

                {/* Contenedor de la Tabla con scroll */}
                <div style={{
                    flexGrow: 1, overflowY: 'auto', marginTop: '20px',
                    border: '1px solid #edf2f7', borderRadius: '4px'
                }}>
                    <Table
                        data={datosEstaticos[tipoActual]}
                        tipo={tipoActual}
                        editar={editar}
                        eliminar={eliminar}
                    />
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #edf2f7',
                    display: 'flex', justifyContent: 'space-between', color: '#a0aec0', fontSize: '12px'
                }}>
                    <span>Módulo: {tipoActual.toUpperCase()}</span>
                    <span>{datosEstaticos[tipoActual].length} registros encontrados</span>
                </div>
            </div>
        </div>
    );
};

export default Main;