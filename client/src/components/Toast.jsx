import React, { createContext, useContext, useState, useCallback } from 'react';

// ─── Context ─────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

// ─── Toast Item ───────────────────────────────────────────────────────────────
const icons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#388e3c"/>
      <path d="M5.5 10.5L8.5 13.5L14.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#d32f2f"/>
      <path d="M7 7L13 13M13 7L7 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#2874f0"/>
      <path d="M10 9v5M10 7v.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#ff9f00"/>
      <path d="M5 7h1l1.5 5h6l1-3.5H7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="14.5" r="0.75" fill="white"/>
      <circle cx="13" cy="14.5" r="0.75" fill="white"/>
    </svg>
  )
};

const borderColors = {
  success: '#388e3c',
  error: '#d32f2f',
  info: '#2874f0',
  cart: '#ff9f00'
};

function ToastItem({ toast, onRemove }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        background: 'white',
        borderLeft: `4px solid ${borderColors[toast.type] || '#2874f0'}`,
        borderRadius: '2px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        padding: '14px 16px',
        minWidth: '300px',
        maxWidth: '380px',
        animation: 'slideInToast 0.3s ease-out',
        position: 'relative',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>{icons[toast.type] || icons.info}</div>
      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#212121', marginBottom: '2px' }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: '1.4' }}>{toast.message}</div>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#878787', fontSize: '18px', lineHeight: 1,
          padding: '0 0 0 8px', flexShrink: 0
        }}
      >×</button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', { title, duration = 3000 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, opts) => show(msg, 'success', opts),
    error: (msg, opts) => show(msg, 'error', opts),
    info: (msg, opts) => show(msg, 'info', opts),
    cart: (msg, opts) => show(msg, 'cart', opts),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-end',
        }}
      >
        <style>{`
          @keyframes slideInToast {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
