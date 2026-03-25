'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

const BORDER_COLORS = {
  success: 'border-l-fw-green',
  warning: 'border-l-fw-amber',
  error: 'border-l-fw-red',
  info: 'border-l-fw-cyan',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-fw-surface border border-fw-border ${BORDER_COLORS[toast.type]} border-l-4 rounded-lg px-4 py-3 shadow-lg flex items-start gap-3 animate-slide-in`}
          >
            <p className="text-sm text-fw-text flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-fw-text-muted hover:text-fw-text"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
