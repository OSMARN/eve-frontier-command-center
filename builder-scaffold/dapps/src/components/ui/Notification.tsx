import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Notification({ type, title, message, duration = 5000, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getColors = () => {
    switch(type) {
      case 'success':
        return {
          bg: 'var(--status-online)',
          border: '#00cc77',
          icon: '✓'
        };
      case 'error':
        return {
          bg: 'var(--status-danger)',
          border: '#cc3333',
          icon: '✗'
        };
      case 'warning':
        return {
          bg: 'var(--status-warning)',
          border: '#cc8800',
          icon: '⚠'
        };
      case 'info':
        return {
          bg: 'var(--accent-secondary)',
          border: '#0099cc',
          icon: 'ℹ'
        };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 2000,
      minWidth: '320px',
      maxWidth: '400px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: `2px solid ${colors.bg}`,
        borderRadius: '4px',
        padding: '1rem',
        boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px ${colors.border}`,
        position: 'relative'
      }}>
        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.1)'
        }}>
          <div style={{
            height: '100%',
            width: '100%',
            backgroundColor: colors.bg,
            animation: `progress ${duration}ms linear`
          }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0 0.3rem'
          }}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: colors.bg,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: 'black',
            fontWeight: 'bold'
          }}>
            {colors.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ 
              margin: '0 0 0.3rem 0', 
              color: colors.bg,
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '1rem'
            }}>
              {title}
            </h4>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              {message}
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
