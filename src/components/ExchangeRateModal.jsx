import React, { useEffect, useState } from 'react';

const ExchangeRateModal = ({ isOpen, onClose, exchangeRate, onSave }) => {
    const [localRate, setLocalRate] = useState(String(exchangeRate));
    const [error, setError] = useState('');

    useEffect(() => {
        setLocalRate(String(exchangeRate));
        setError('');
    }, [exchangeRate, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextRate = Number(localRate);

        if (!Number.isFinite(nextRate) || nextRate <= 0) {
            setError('La tasa debe ser un número mayor que cero.');
            return;
        }

        onSave(nextRate);
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Editar tasa local</h3>
                    <button onClick={onClose} style={closeBtnStyle}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                    <p style={{ margin: '0 0 16px', color: '#4a5568', fontSize: '14px', lineHeight: 1.5 }}>
                        Define cuántos bolívares equivalen a 1 USD. Este valor solo afecta la visualización local del frontend.
                    </p>

                    <div style={groupStyle}>
                        <label style={labelStyle}>VES por 1 USD</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={localRate}
                            onChange={(event) => {
                                setLocalRate(event.target.value);
                                if (error) setError('');
                            }}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ marginBottom: '16px', color: '#c53030', fontSize: '13px', fontWeight: 600 }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose} style={btnCancelStyle}>Cancelar</button>
                        <button type="submit" style={btnSaveStyle}>Guardar tasa</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 };
const modalStyle = { backgroundColor: 'white', borderRadius: '12px', width: '380px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' };
const headerStyle = { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b6cb0' };
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };
const groupStyle = { marginBottom: '16px' };
const closeBtnStyle = { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' };
const btnCancelStyle = { padding: '10px 16px', border: 'none', background: '#edf2f7', borderRadius: '6px', cursor: 'pointer', color: '#4a5568', fontWeight: '600' };
const btnSaveStyle = { padding: '10px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white', fontWeight: '600', backgroundColor: '#2b6cb0' };

export default ExchangeRateModal;