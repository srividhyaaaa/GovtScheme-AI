function Modal({ open, title, children, actions, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions ? <div className="modal-actions">{actions}</div> : null}
      </div>
    </div>
  );
}

export default Modal;
