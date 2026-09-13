import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  product,
  isDeleting = false,
}) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación de Producto"
      size="sm"
    >
      <div className="delete-confirm-body">
        <div className="delete-icon-wrapper">
          <AlertTriangle size={36} className="text-danger" />
        </div>
        <p>
          ¿Deseas remover definitivamente el producto{' '}
          <strong>"{product.name}"</strong> del catálogo?
        </p>
        <p className="text-muted small">
          Esta acción ejecutará una solicitud <code>DELETE /producto/{product.id}</code> en el backend REST y actualizará el estado de la aplicación de forma inmutable.
        </p>

        <div className="modal-actions mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Eliminar del Catálogo
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
