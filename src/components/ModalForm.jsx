import React, { useEffect, useState } from 'react';
import { formatCurrencyDisplay } from '../utils/formatters';

const ModalForm = ({ isOpen, onClose, tipo, productos, onSave, registroAEditar, exchangeRate, showUsdConversion }) => {
    const initialState = {
        nombre: '',
        sku: '',
        precio_compra_actual: '0.00',
        precio_venta_actual: '0.00',
        producto: '',
        tipo: tipo === 'entrada' ? 'ENTRADA' : 'SALIDA',
        cantidad: 1,
        observacion: ''
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (registroAEditar) {
            setFormData({
                ...initialState,
                ...registroAEditar,
                producto: registroAEditar.producto ?? '',
                tipo: registroAEditar.tipo ?? (tipo === 'entrada' ? 'ENTRADA' : 'SALIDA')
            });
        } else {
            setFormData({
                ...initialState,
                tipo: tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'
            });
        }
    }, [registroAEditar, isOpen, tipo]);

    if (!isOpen) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData);
    };

    const esProducto = tipo === 'productos';
    const esEdicion = !!formData.id;
    const colorPrimario = esProducto ? '#3182ce' : (tipo === 'entrada' ? '#38a169' : '#e53e3e');
    const productoSeleccionado = productos.find((producto) => String(producto.id) === String(formData.producto));
    const precioReferencia = tipo === 'entrada'
        ? productoSeleccionado?.precio_compra_actual
        : productoSeleccionado?.precio_venta_actual;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{ ...headerStyle, backgroundColor: colorPrimario }}>
                    <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>
                        {esEdicion ? 'Editar' : 'Nuevo'} {esProducto ? 'Producto' : 'Movimiento'}
                    </h3>
                    <button onClick={onClose} style={closeBtnStyle}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                    {esProducto ? (
                        <>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Nombre del producto</label>
                                <input
                                    name="nombre"
                                    value={formData.nombre || ''}
                                    style={inputStyle}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={groupStyle}>
                                <label style={labelStyle}>SKU</label>
                                <input
                                    name="sku"
                                    value={formData.sku || ''}
                                    style={inputStyle}
                                    required
                                    onChange={handleChange}
                                    disabled={esEdicion}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ ...groupStyle, flex: 1 }}>
                                    <label style={labelStyle}>Precio compra</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="precio_compra_actual"
                                        value={formData.precio_compra_actual || ''}
                                        style={inputStyle}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div style={{ ...groupStyle, flex: 1 }}>
                                    <label style={labelStyle}>Precio venta</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="precio_venta_actual"
                                        value={formData.precio_venta_actual || ''}
                                        style={inputStyle}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Producto</label>
                                <select
                                    name="producto"
                                    value={formData.producto || ''}
                                    style={inputStyle}
                                    required
                                    onChange={handleChange}
                                    disabled={esEdicion}
                                >
                                    <option value="">Seleccione un producto...</option>
                                    {productos.map((producto) => (
                                        <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Precio de referencia</label>
                                <input
                                    value={productoSeleccionado ? formatCurrencyDisplay(precioReferencia, { exchangeRate, showUsdConversion }) : 'Seleccione un producto'}
                                    disabled
                                    style={{ ...inputStyle, backgroundColor: '#f7fafc', color: '#4a5568' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ ...groupStyle, flex: 1 }}>
                                    <label style={labelStyle}>Cantidad</label>
                                    <input
                                        type="number"
                                        name="cantidad"
                                        value={formData.cantidad || ''}
                                        style={inputStyle}
                                        required
                                        min="1"
                                        onChange={handleChange}
                                        disabled={esEdicion}
                                    />
                                </div>
                                <div style={{ ...groupStyle, flex: 2 }}>
                                    <label style={labelStyle}>Tipo</label>
                                    <input
                                        value={formData.tipo || ''}
                                        disabled
                                        style={{ ...inputStyle, backgroundColor: '#f7fafc', color: '#718096' }}
                                    />
                                </div>
                            </div>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Observación</label>
                                <textarea
                                    name="observacion"
                                    value={formData.observacion || ''}
                                    style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                                    onChange={handleChange}
                                    disabled={esEdicion}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={btnCancelStyle}>Cancelar</button>
                        <button type="submit" style={{ ...btnSaveStyle, backgroundColor: colorPrimario }}>
                            {esEdicion ? 'Actualizar cambios' : 'Crear registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'white', borderRadius: '12px', width: '460px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' };
const headerStyle = { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };
const groupStyle = { marginBottom: '16px' };
const closeBtnStyle = { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' };
const btnCancelStyle = { padding: '10px 16px', border: 'none', background: '#edf2f7', borderRadius: '6px', cursor: 'pointer', color: '#4a5568', fontWeight: '600' };
const btnSaveStyle = { padding: '10px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white', fontWeight: '600' };

export default ModalForm;