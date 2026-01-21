import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import TableSelector from './components/TableSelector';
import ModalForm from './components/ModalForm';
// Importamos nuestras funciones de API
// import { productosAPI, transaccionesAPI, existenciasAPI } from './api'; 
import { productosAPI , transaccionesAPI, existenciasAPI} from './api/api';


const formatTransactionData = (rawTransaction) => {
    return {
        id: rawTransaction.id ?? '',
        producto: rawTransaction.producto_id,
        cantidad: rawTransaction.cantidad,
        tipo: rawTransaction.tipo_transaccion,
        fecha: rawTransaction.fecha ?? '',
    };
};

const Main = () => {
    const [tipoActual, setTipoActual] = useState('existencia');
    const [datos, setDatos] = useState([]); // Estado para los datos de la API
    const [productosParaSelect, setProductosParaSelect] = useState([]); // Para el modal
    const [mostrarModal, setMostrarModal] = useState(false);
    const [estaCargando, setEstaCargando] = useState(false);
    const [activeRegistro, setActiveRegistro] = useState(null);

    // 1. Función para cargar datos desde Django
    const cargarDatos = async () => {
        setEstaCargando(true);
        try {
            let resultado;
            if (tipoActual === 'existencia') {
                resultado = await existenciasAPI.listar();
                // Aprovechamos para actualizar la lista de productos para los selects de los modales
                setProductosParaSelect(resultado); 
            } else if (tipoActual === 'entrada' || tipoActual === 'salida') {
                // Si tu API de transacciones devuelve todo junto, filtramos por tipo
                resultado = await transaccionesAPI.listar(tipoActual.toUpperCase());
                // console.log(tipoActual)
                // resultado = transacciones.filter(t => t.tipo === tipoActual.toUpperCase());
            }

            
            setDatos(resultado || []);
        } catch (error) {
            console.error("Error cargando datos de Django:", error);
            alert("Error al conectar con el servidor");
        } finally {
            setEstaCargando(false);
        }
    };

    // 2. Ejecutar carga cada vez que cambie el tipo (pestaña)
    useEffect(() => {
        cargarDatos();
    }, [tipoActual]);

    // 3. Manejar Guardado (Crear/Editar)
    const handleSave = async (datosForm) => {
        setEstaCargando(true);
        try {
            if (datosForm.id) {
                // EDICIÓN
                if (tipoActual === 'existencia') {
                    await productosAPI.actualizar(datosForm.id, datosForm);
                }
                // Las transacciones normalmente no se editan, pero podrías añadir la lógica aquí
            } else {
                // CREACIÓN
                if (tipoActual === 'existencia') {
                    console.log("Creando producto con datos:", datosForm);
                    const result = await productosAPI.crear(datosForm);
                    console.log("Producto creado:", result);
                } else {
                    const formattedTransaction = formatTransactionData(datosForm);
                    const result = await transaccionesAPI.registrar({
                        ...formattedTransaction,
                    });
                    console.log("Transacción registrada:", result);
                }
            }
            setMostrarModal(false);
            cargarDatos(); // Refrescar la tabla
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("No se pudo guardar el registro");
        } finally {
            setEstaCargando(false);
        }
    };

    // 4. Eliminar
    const eliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este registro?")) {
            try {
                if (tipoActual === 'existencia') {
                    await productosAPI.eliminar(id);
                    cargarDatos();
                }
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    const editar = (row) => {
        setActiveRegistro(row);
        setMostrarModal(true);
    };

    const crear = () => {
        setActiveRegistro(null);
        setMostrarModal(true);
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '100vh', backgroundColor: '#1a202c', overflow: 'hidden'
        }}>
            <ModalForm
                isOpen={mostrarModal}
                onClose={() => setMostrarModal(false)}
                tipo={tipoActual}
                onSave={handleSave}
                isLoading={estaCargando}
                productos={productosParaSelect}
                registroAEditar={activeRegistro}
            />

            <div style={{
                width: '90%', maxWidth: '1100px', maxHeight: '85vh',
                backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ flexShrink: 0, marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#2d3748', fontSize: '24px' }}>Sistema de Inventario</h2>
                    <p style={{ margin: '5px 0 0', color: '#718096', fontSize: '14px' }}>
                        Conectado a Django API en {tipoActual.toUpperCase()}
                    </p>
                </div>

                <TableSelector
                    tipoActual={tipoActual}
                    onChange={setTipoActual}
                    onAdd={crear}
                />

                {/* Tabla con datos de la API */}
                <div style={{
                    flexGrow: 1, overflowY: 'auto', marginTop: '20px',
                    border: '1px solid #edf2f7', borderRadius: '4px',
                    position: 'relative'
                }}>
                    {estaCargando && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex',
                            justifyContent: 'center', alignItems: 'center', zIndex: 1
                        }}>
                            Cargando...
                        </div>
                    )}
                    <Table
                        data={datos}
                        tipo={tipoActual}
                        editar={editar}
                        eliminar={eliminar}
                    />
                </div>

                <div style={{
                    marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #edf2f7',
                    display: 'flex', justifyContent: 'space-between', color: '#a0aec0', fontSize: '12px'
                }}>
                    <span>Status: Conectado</span>
                    <span>{datos.length} registros en base de datos</span>
                </div>
            </div>
        </div>
    );
};

export default Main;