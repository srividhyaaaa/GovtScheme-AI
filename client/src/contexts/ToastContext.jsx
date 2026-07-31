import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = "info", duration = 4000 }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, title, message, type }]);
    window.setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="status" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <div>
              {toast.title ? <strong>{toast.title}</strong> : null}
              {toast.message ? <p>{toast.message}</p> : null}
            </div>
            <button type="button" className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export { ToastProvider, useToast };
