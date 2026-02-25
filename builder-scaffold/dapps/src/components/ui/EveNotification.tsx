import React, { useEffect } from 'react';

interface EveNotificationProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function EveNotification({ message, duration = 5000, onClose }: EveNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

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
        padding: '2rem 2rem 4rem 2rem',  // Еще больше нижний padding
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

        {/* Message */}
        <p style={{
          margin: 0,
          color: 'var(--text-primary)',
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        {/* Close button at bottom center - еще ниже */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            bottom: '1.5rem',  // Увеличил отступ
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '0.25rem 2rem',
            fontFamily: 'Rajdhani, sans-serif',
            borderTop: '1px solid var(--border-color)',
            width: '80%'
          }}
        >
          CLOSE
        </button>
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
