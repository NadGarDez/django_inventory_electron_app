import React from 'react';

const FeedbackModal = ({ isOpen, onClose, type, title, subtitle }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
                width: '90%', maxWidth: '400px', textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    fontSize: '50px', marginBottom: '20px',
                    color: isSuccess ? '#48bb78' : '#f56565'
                }}>
                    {isSuccess ? '✓' : '✕'}
                </div>

                <h2 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>{title}</h2>
                <p style={{ margin: '0 0 25px 0', color: '#718096', lineHeight: '1.5' }}>
                    {subtitle}
                </p>

                <button 
                    onClick={onClose}
                    style={{
                        padding: '10px 25px', borderRadius: '6px', border: 'none',
                        backgroundColor: isSuccess ? '#48bb78' : '#f56565',
                        color: 'white', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;