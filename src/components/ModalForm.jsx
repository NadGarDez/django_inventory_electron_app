import React, { useState, useEffect } from 'react';

const ModalForm = ({ isOpen, onClose, tipo, productos, onSave, registroAEditar }) => {

    // 1. Estado inicial vacío (Esquema base de Django)
    const initialState = {
        nombre: '',
        sku: '',
        producto_id: '',
        tipo_transaccion: tipo === 'entrada' ? 'ENTRADA' : 'SALIDA',
        cantidad: 1,
        observacion: ''
    };

    const [formData, setFormData] = useState(initialState);

    // 2. Sincronización de datos: Si llega registroAEditar, se carga. Si no, se limpia.
    useEffect(() => {
        if (registroAEditar) {
            setFormData({ ...registroAEditar });
        } else {
            setFormData({
                ...initialState,
                tipo_transaccion: tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'
            });
        }
    }, [registroAEditar, isOpen, tipo]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviamos el objeto completo. Main.js decidirá por el ID si es POST o PUT.
        onSave(formData);
    };

    const esProducto = tipo === 'existencia';
    const esEdicion = !!formData.id; // Determinamos el modo por la existencia del ID
    const colorPrimario = esProducto ? '#3182ce' : (tipo === 'entrada' ? '#38a169' : '#e53e3e');

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{ ...headerStyle, backgroundColor: colorPrimario }}>
                    <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>
                        {esEdicion ? '✏️ Editar' : '➕ Nuevo'} {esProducto ? 'Producto' : 'Movimiento'}
                    </h3>
                    <button onClick={onClose} style={closeBtnStyle}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                    {esProducto ? (
                        /* MODELO PRODUCTO */
                        <>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Nombre del Producto</label>
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
                                    disabled={esEdicion} // El SKU no se suele editar
                                />
                            </div>
                        </>
                    ) : (
                        /* MODELO TRANSACCIÓN */
                        <>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Producto</label>
                                <select 
                                    name="producto_id" 
                                    value={formData.producto_id || formData.producto || ''} 
                                    style={inputStyle} 
                                    required 
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un producto...</option>
                                    {productos.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
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
                                    />
                                </div>
                                <div style={{ ...groupStyle, flex: 2 }}>
                                    <label style={labelStyle}>Tipo</label>
                                    <input 
                                        value={formData.tipo_transaccion || ''} 
                                        disabled 
                                        style={{ ...inputStyle, backgroundColor: '#f7fafc', color: '#718096' }} 
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={btnCancelStyle}>Cancelar</button>
                        <button type="submit" style={{ ...btnSaveStyle, backgroundColor: colorPrimario }}>
                            {esEdicion ? 'Actualizar Cambios' : 'Crear Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Estilos rápidos para el modal
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'white', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' };
const headerStyle = { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };
const groupStyle = { marginBottom: '16px' };
const closeBtnStyle = { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' };
const btnCancelStyle = { padding: '10px 16px', border: 'none', background: '#edf2f7', borderRadius: '6px', cursor: 'pointer', color: '#4a5568', fontWeight: '600' };
const btnSaveStyle = { padding: '10px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white', fontWeight: '600' };

export default ModalForm;