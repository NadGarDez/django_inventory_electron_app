import React, { useEffect, useState } from 'react';
import Table from './components/Table';
import TableSelector from './components/TableSelector';
import ModalForm from './components/ModalForm';
import ExchangeRateModal from './components/ExchangeRateModal';
import { productosAPI, transaccionesAPI, existenciasAPI } from './api/api';
import FeedbackModal from './components/FeedBackModal';
import { formatCurrencyDisplay, toNumber } from './utils/formatters';
import companyLogo from './assets/company-logo.png';

const DEFAULT_EXCHANGE_RATE = 446.88;
const EXCHANGE_RATE_STORAGE_KEY = 'inventario.exchangeRate';

const getStoredExchangeRate = () => {
    if (typeof window === 'undefined') {
        return DEFAULT_EXCHANGE_RATE;
    }

    const storedValue = window.localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY);
    const parsedValue = Number(storedValue);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : DEFAULT_EXCHANGE_RATE;
};

const normalizeListResponse = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
};

const normalizeProducto = (item) => ({
    ...item,
    stock_actual: item?.stock_actual ?? 0,
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
    valor_inventario_compra: item?.valor_inventario_compra ?? '0.00',
    valor_inventario_venta: item?.valor_inventario_venta ?? '0.00',
    ultima_actualizacion:
        item?.ultima_actualizacion ??
        item?.updated_at ??
        item?.created_at ??
        item?.fecha ??
        ''
});

const formatTransactionData = (rawTransaction) => ({
    producto: rawTransaction.producto,
    cantidad: rawTransaction.cantidad,
    tipo: rawTransaction.tipo,
    observacion: rawTransaction.observacion ?? ''
});

const buildResumenTarjetas = (tipoActual, resumen, exchangeRate, showUsdConversion) => {
    if (!resumen) {
        return [];
    }

    if (tipoActual === 'existencia') {
        return [
            { label: 'Total productos', value: resumen.total_productos ?? 0, accent: '#4c51bf' },
            { label: 'Total unidades', value: resumen.total_unidades ?? 0, accent: '#3182ce' },
            {
                label: 'Total compra',
                value: formatCurrencyDisplay(resumen.valor_total_inventario_compra, { exchangeRate, showUsdConversion }),
                accent: '#2f855a'
            },
            {
                label: 'Total venta',
                value: formatCurrencyDisplay(resumen.valor_total_inventario_venta, { exchangeRate, showUsdConversion }),
                accent: '#c05621'
            }
        ];
    }

    if (tipoActual === 'entrada' || tipoActual === 'salida') {
        return [
            {
                label: tipoActual === 'entrada' ? 'Total entradas' : 'Total salidas',
                value: formatCurrencyDisplay(resumen.total_movimientos, { exchangeRate, showUsdConversion }),
                accent: tipoActual === 'entrada' ? '#2f855a' : '#c53030'
            },
            { label: 'Cantidad acumulada', value: resumen.total_unidades ?? 0, accent: '#4c51bf' }
        ];
    }

    return [];
};

const Main = () => {
    const [tipoActual, setTipoActual] = useState('productos');
    const [datos, setDatos] = useState([]);
    const [productosParaSelect, setProductosParaSelect] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [estaCargando, setEstaCargando] = useState(false);
    const [activeRegistro, setActiveRegistro] = useState(null);
    const [resumenActual, setResumenActual] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(() => getStoredExchangeRate());
    const [showUsdConversion, setShowUsdConversion] = useState(false);
    const [mostrarModalTasa, setMostrarModalTasa] = useState(false);
    const [feedback, setFeedback] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        subtitle: ''
    });

    const closeFeedback = () => setFeedback((prev) => ({ ...prev, isOpen: false }));

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, String(exchangeRate));
        }
    }, [exchangeRate]);

    const cargarDatos = async () => {
        setEstaCargando(true);
        try {
            if (tipoActual === 'productos') {
                const resultado = await productosAPI.listar();
                const productos = normalizeListResponse(resultado).map(normalizeProducto);
                setDatos(productos);
                setProductosParaSelect(productos);
                setResumenActual(null);
            } else if (tipoActual === 'existencia') {
                const [resultado, resumen] = await Promise.all([
                    existenciasAPI.listar(),
                    existenciasAPI.resumen()
                ]);
                const existencias = normalizeListResponse(resultado).map(normalizeExistencia);
                setDatos(existencias);
                setResumenActual(resumen);
            } else {
                const [resultado, productos] = await Promise.all([
                    transaccionesAPI.listar(tipoActual.toUpperCase()),
                    productosAPI.listar()
                ]);
                const transacciones = normalizeListResponse(resultado);
                const productosNormalizados = normalizeListResponse(productos).map(normalizeProducto);
                setDatos(transacciones);
                setProductosParaSelect(productosNormalizados);
                setResumenActual({
                    total_movimientos: transacciones.reduce((total, item) => total + toNumber(item?.valor_movimiento), 0),
                    total_unidades: transacciones.reduce((total, item) => total + toNumber(item?.cantidad), 0)
                });
            }
        } catch (error) {
            setFeedback({
                isOpen: true,
                type: 'error',
                title: 'Error de lectura',
                subtitle: `No se pudieron obtener los datos de ${tipoActual}. Verifique la API.`
            });
        } finally {
            setEstaCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [tipoActual]);

    const handleSave = async (datosForm) => {
        setEstaCargando(true);
        try {
            if (tipoActual === 'existencia') {
                setMostrarModal(false);
                return;
            }

            if (datosForm.id && tipoActual === 'productos') {
                await productosAPI.actualizar(datosForm.id, {
                    nombre: datosForm.nombre,
                    sku: datosForm.sku,
                    precio_compra_actual: datosForm.precio_compra_actual,
                    precio_venta_actual: datosForm.precio_venta_actual
                });
            } else if (tipoActual === 'productos') {
                await productosAPI.crear({
                    nombre: datosForm.nombre,
                    sku: datosForm.sku,
                    precio_compra_actual: datosForm.precio_compra_actual,
                    precio_venta_actual: datosForm.precio_venta_actual
                });
            } else {
                await transaccionesAPI.registrar(formatTransactionData(datosForm));
            }

            setMostrarModal(false);
            await cargarDatos();
            setFeedback({
                isOpen: true,
                type: 'success',
                title: 'Guardado correctamente',
                subtitle: 'La operación se sincronizó correctamente.'
            });
        } catch (error) {
            setFeedback({
                isOpen: true,
                type: 'error',
                title: 'Error al procesar',
                subtitle: 'Hubo un problema al intentar guardar los cambios en la base de datos.'
            });
        } finally {
            setEstaCargando(false);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este registro?')) {
            return;
        }

        try {
            if (tipoActual === 'productos') {
                await productosAPI.eliminar(id);
                await cargarDatos();
                setFeedback({
                    isOpen: true,
                    type: 'success',
                    title: 'Registro eliminado',
                    subtitle: 'El ítem ha sido borrado definitivamente.'
                });
            }
        } catch (error) {
            setFeedback({
                isOpen: true,
                type: 'error',
                title: 'Error de eliminación',
                subtitle: 'No se tienen permisos o el registro no existe.'
            });
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

    const guardarTasa = (nextExchangeRate) => {
        setExchangeRate(nextExchangeRate);
        setMostrarModalTasa(false);
        setFeedback({
            isOpen: true,
            type: 'success',
            title: 'Tasa actualizada',
            subtitle: `La tasa local quedó en ${nextExchangeRate.toFixed(2)} VES por USD.`
        });
    };

    const tarjetasResumen = buildResumenTarjetas(tipoActual, resumenActual, exchangeRate, showUsdConversion);
    const currentCurrencyMode = showUsdConversion ? 'USD + VES' : 'VES';

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#1a202c',
            overflow: 'hidden'
        }}>
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
                exchangeRate={exchangeRate}
                showUsdConversion={showUsdConversion}
            />

            <ExchangeRateModal
                isOpen={mostrarModalTasa}
                onClose={() => setMostrarModalTasa(false)}
                exchangeRate={exchangeRate}
                onSave={guardarTasa}
            />

            <div style={{
                width: '88%',
                maxWidth: '1380px',
                maxHeight: '88vh',
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    flexShrink: 0,
                    marginBottom: '22px',
                    padding: '8px 0 14px',
                    borderBottom: '1px solid #edf2f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '22px', textAlign: 'left' }}>
                        <div style={{
                            width: '112px',
                            height: '112px',
                            borderRadius: '26px',
                            overflow: 'hidden',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 16px 30px rgba(15, 23, 42, 0.10)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <img
                                src={companyLogo}
                                alt="Logo de La Gran Esquina Paramaconi"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{
                                margin: 0,
                                color: '#1a202c',
                                fontSize: '40px',
                                lineHeight: 1,
                                fontWeight: 900,
                                letterSpacing: '-0.05em'
                            }}>
                                La Gran Esquina Paramaconi
                            </h2>
                            <p style={{
                                margin: '10px 0 0',
                                color: '#4a5568',
                                fontSize: '17px',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase'
                            }}>
                                Sistema de inventario
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>

                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '7px 14px',
                            backgroundColor: '#f7fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '999px',
                            color: '#2d3748',
                            fontSize: '12px',
                            fontWeight: 600,
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)'
                        }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#38a169',
                                boxShadow: '0 0 0 3px rgba(56, 161, 105, 0.10)'
                            }} />
                            <span>Conectado a Django API en {tipoActual.toUpperCase()}</span>
                            <span style={{ color: '#a0aec0' }}>|</span>
                            <span style={{ color: '#2b6cb0' }}>Modo: {currentCurrencyMode}</span>
                            <span style={{ color: '#a0aec0' }}>|</span>
                            <label style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '7px',
                                cursor: 'pointer',
                                color: '#4a5568',
                                userSelect: 'none'
                            }}>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em'
                                }}>
                                    USD
                                </span>
                                <span style={{
                                    position: 'relative',
                                    width: '34px',
                                    height: '18px',
                                    borderRadius: '999px',
                                    backgroundColor: showUsdConversion ? '#2b6cb0' : '#cbd5e0',
                                    transition: 'background-color 0.2s ease'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={showUsdConversion}
                                        onChange={(event) => setShowUsdConversion(event.target.checked)}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: showUsdConversion ? '18px' : '2px',
                                        width: '14px',
                                        height: '14px',
                                        borderRadius: '50%',
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.2)',
                                        transition: 'left 0.2s ease'
                                    }} />
                                </span>
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMostrarModalTasa(true)}
                            style={{
                                border: '1px solid #bee3f8',
                                backgroundColor: '#ebf8ff',
                                color: '#2b6cb0',
                                borderRadius: '999px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)'
                            }}
                        >
                            1 USD = {exchangeRate.toFixed(2)} VES
                        </button>
                    </div>
                </div>

                <TableSelector
                    tipoActual={tipoActual}
                    onChange={setTipoActual}
                    onAdd={crear}
                    canAdd={tipoActual !== 'existencia'}
                />

                {tarjetasResumen.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '12px',
                        marginTop: '18px'
                    }}>
                        {tarjetasResumen.map((card) => (
                            <div
                                key={card.label}
                                style={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderLeft: `4px solid ${card.accent || '#4c51bf'}`,
                                    borderRadius: '10px',
                                    padding: '14px 16px'
                                }}
                            >
                                <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: 700 }}>
                                    {card.label}
                                </div>
                                <div style={{ fontSize: '20px', color: '#1a202c', fontWeight: 700, marginTop: '6px' }}>
                                    {card.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{
                    flexGrow: 1,
                    overflow: 'auto',
                    marginTop: '20px',
                    border: '1px solid #edf2f7',
                    borderRadius: '4px',
                    position: 'relative'
                }}>
                    {estaCargando && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1
                        }}>
                            Cargando...
                        </div>
                    )}
                    <Table
                        data={datos}
                        tipo={tipoActual}
                        editar={editar}
                        eliminar={eliminar}
                        resumen={resumenActual}
                        exchangeRate={exchangeRate}
                        showUsdConversion={showUsdConversion}
                    />
                </div>

                <div style={{
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid #edf2f7',
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#a0aec0',
                    fontSize: '12px'
                }}>
                    <span>Status: Conectado</span>
                    <span>Registros mostrados: {datos.length}</span>
                </div>
            </div>
        </div>
    );
};

export default Main;