import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import TableSelector from './components/TableSelector';
import ModalForm from './components/ModalForm';
import { productosAPI , transaccionesAPI, existenciasAPI} from './api/api';
import FeedbackModal from './components/FeedBackModal';

const normalizeListResponse = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
};

const normalizeProducto = (item) => ({
    ...item,
    producto_timestamp:
        item?.updated_at ??
        item?.ultima_actualizacion ??
        item?.created_at ??
        item?.fecha ??
        ''
});

const normalizeExistencia = (item) => ({
    ...item,
    cantidad: item?.cantidad ?? item?.stock_actual ?? 0,
    ultima_actualizacion:
        item?.ultima_actualizacion ??
        item?.updated_at ??
        item?.created_at ??
        item?.fecha ??
        ''
});

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
    const [tipoActual, setTipoActual] = useState('productos');
    const [datos, setDatos] = useState([]);
    const [productosParaSelect, setProductosParaSelect] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [estaCargando, setEstaCargando] = useState(false);
    const [activeRegistro, setActiveRegistro] = useState(null);

    const [feedback, setFeedback] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        subtitle: ''
    });

    const closeFeedback = () => setFeedback({ ...feedback, isOpen: false });

    const cargarDatos = async () => {
        setEstaCargando(true);
        try {
            if (tipoActual === 'productos') {
                const resultado = await productosAPI.listar();
                const productos = normalizeListResponse(resultado).map(normalizeProducto);
                setDatos(productos);
                setProductosParaSelect(productos);
            } else if (tipoActual === 'existencia') {
                const resultado = await existenciasAPI.listar();
                const existencias = normalizeListResponse(resultado).map(normalizeExistencia);
                setDatos(existencias);
            } else if (tipoActual === 'entrada' || tipoActual === 'salida') {
                const [resultado, productos] = await Promise.all([
                    transaccionesAPI.listar(tipoActual.toUpperCase()),
                    productosAPI.listar()
                ]);
                setDatos(normalizeListResponse(resultado));
                setProductosParaSelect(normalizeListResponse(productos).map(normalizeProducto));
            }
        } catch (error) {
            setFeedback({
                isOpen: true,
                type: 'error',
                title: 'Error de Lectura',
                subtitle: `No se pudieron obtener los datos de ${tipoActual}. Verifique la API.`
            });
        } finally {
            setEstaCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [tipoActual]);

    // 3. Manejar Guardado (Muestra ÉXITO o ERROR)
    const handleSave = async (datosForm) => {
        setEstaCargando(true);
        try {
            if (tipoActual === 'existencia') {
                setMostrarModal(false);
                return;
            }

            if (datosForm.id) {
                if (tipoActual === 'productos') {
                    const payloadProducto = {
                        nombre: datosForm.nombre,
                        sku: datosForm.sku
                    };
                    await productosAPI.actualizar(datosForm.id, payloadProducto);
                }
            } else {
                if (tipoActual === 'productos') {
                    const payloadProducto = {
                        nombre: datosForm.nombre,
                        sku: datosForm.sku
                    };
                    await productosAPI.crear(payloadProducto);
                } else {
                    await transaccionesAPI.registrar(formatTransactionData(datosForm));
                }
            }
            
            setMostrarModal(false);
            await cargarDatos(); 

            setFeedback({
                isOpen: true,
                type: 'success',
                title: '¡Guardado Correctamente!',
                subtitle: 'La operación se sincronizó correctamente.'
            });

        } catch (error) {
            setFeedback({
                isOpen: true,
                type: 'error',
                title: 'Error al Procesar',
                subtitle: 'Hubo un problema al intentar guardar los cambios en la base de datos.'
            });
        } finally {
            setEstaCargando(false);
        }
    };

    const eliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este registro?")) {
            try {
                if (tipoActual === 'productos') {
                    await productosAPI.eliminar(id);
                    cargarDatos();
                    setFeedback({
                        isOpen: true,
                        type: 'success',
                        title: 'Registro Eliminado',
                        subtitle: 'El ítem ha sido borrado definitivamente.'
                    });
                }
            } catch (error) {
                setFeedback({
                    isOpen: true,
                    type: 'error',
                    title: 'Error de Eliminación',
                    subtitle: 'No se tiene permisos o el registro no existe.'
                });
            }
        }
    };

    const editar = (row) => { setActiveRegistro(row); setMostrarModal(true); };
    const crear = () => { setActiveRegistro(null); setMostrarModal(true); };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '100vh', backgroundColor: '#1a202c', overflow: 'hidden'
        }}>
            {/* COMPONENTE DE FEEDBACK CONFIGURABLE */}
            <FeedbackModal 
                isOpen={feedback.isOpen}
                onClose={closeFeedback}
                type={feedback.type}
                title={feedback.title}
                subtitle={feedback.subtitle}
            />

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
                width: '80%', maxWidth: '1100px', maxHeight: '85vh',
                backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
            }}>
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
                    canAdd={tipoActual !== 'existencia'}
                />

                <div style={{
                    flexGrow: 1, overflowY: 'auto', marginTop: '20px',
                    border: '1px solid #edf2f7', borderRadius: '4px', position: 'relative'
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
                    <Table data={datos} tipo={tipoActual} editar={editar} eliminar={eliminar} />
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