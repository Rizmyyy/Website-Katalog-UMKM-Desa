export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title || 'Konfirmasi'}</h3>
        <p className="modal-body">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} id="btn-confirm-cancel">
            Batal
          </button>
          <button className="btn btn-danger" onClick={onConfirm} id="btn-confirm-yes">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
