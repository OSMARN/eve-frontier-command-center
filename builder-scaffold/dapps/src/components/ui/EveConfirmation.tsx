import React from 'react';

interface EveConfirmationProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EveConfirmation({ message, onConfirm, onCancel }: EveConfirmationProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2000,
      minWidth: '300px',
      maxWidth: '400px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        textAlign: 'center'
      }}>
        {/* EVE-style corner decorations */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '12px',
          height: '12px',
          borderTop: '2px solid #FF4700',
          borderLeft: '2px solid #FF4700'
        }} />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '12px',
          height: '12px',
          borderTop: '2px solid #FF4700',
          borderRight: '2px solid #FF4700'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '12px',
          height: '12px',
          borderBottom: '2px solid #FF4700',
          borderLeft: '2px solid #FF4700'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '12px',
          height: '12px',
          borderBottom: '2px solid #FF4700',
          borderRight: '2px solid #FF4700'
        }} />

        {/* Message with line breaks */}
        <div style={{
          margin: '1rem 0 2rem 0',
          color: 'var(--text-primary)',
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '1rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-line',
          textAlign: 'left',
          backgroundColor: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid var(--border-color)'
        }}>
          {message}
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={onCancel}
            className="eve-button-secondary"
            style={{
              padding: '0.5rem 2rem',
              fontSize: '0.9rem'
            }}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="eve-button"
            style={{
              padding: '0.5rem 2rem',
              fontSize: '0.9rem'
            }}
          >
            CONFIRM
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
}
