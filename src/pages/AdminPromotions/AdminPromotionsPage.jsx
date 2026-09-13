import React, { useState, useEffect } from 'react';
import { Tag, PlusCircle, CheckCircle2, XCircle, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import promotionService from '../../features/promotions/services/promotionService.js';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';

export const AdminPromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '10',
    minPurchase: '0',
    bannerTitle: '',
    bannerDescription: '',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    active: true,
  });

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await promotionService.getAll();
      setPromotions(data);
    } catch (err) {
      toast.error('Error al consultar promociones', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleToggleActive = async (promo) => {
    try {
      const updated = await promotionService.update(promo.id, {
        ...promo,
        active: !promo.active,
      });
      setPromotions((prev) =>
        prev.map((p) => (p.id === promo.id ? { ...p, active: updated.active } : p))
      );
      toast.success(`Campaña ${updated.active ? 'activada' : 'desactivada'} correctamente`);
    } catch (err) {
      toast.error('Error al actualizar campaña', { description: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta promoción?')) {
      try {
        await promotionService.delete(id);
        setPromotions((prev) => prev.filter((p) => p.id !== id));
        toast.success('Promoción eliminada');
      } catch (err) {
        toast.error('Error al eliminar', { description: err.message });
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const created = await promotionService.create({
        ...formData,
        discountValue: Number(formData.discountValue),
        minPurchase: Number(formData.minPurchase),
      });
      setPromotions((prev) => [created, ...prev]);
      setIsModalOpen(false);
      toast.success('Nueva promoción creada exitosamente');
    } catch (err) {
      toast.error('Error al guardar promoción', { description: err.message });
    }
  };

  return (
    <div className="admin-promotions-page py-6">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <span className="badge badge-primary text-xs mb-1">Marketing y Descuentos</span>
            <h1 className="page-title">Gestión de Promociones Comerciales</h1>
            <p className="page-subtitle">
              Configura descuentos por días especiales, tiers por volumen y campañas de banners.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle size={16} />
            <span>Nueva Promoción</span>
          </button>
        </div>

        {loading ? (
          <LoadingState type="spinner" message="Cargando promociones activas..." />
        ) : (
          <div className="admin-table-card">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Campaña</th>
                  <th>Tipo / Valor</th>
                  <th>Compra Mínima</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id}>
                    <td>
                      <strong>{promo.name}</strong>
                      <small className="d-block text-muted">{promo.description}</small>
                    </td>
                    <td>
                      <span className="badge badge-neutral text-xs">
                        {promo.discountType === 'percentage'
                          ? `${promo.discountValue}% OFF`
                          : `$${promo.discountValue} COP`}
                      </span>
                    </td>
                    <td>
                      {promo.minPurchase > 0
                        ? `$${promo.minPurchase.toLocaleString('es-CO')}`
                        : 'Sin mínimo'}
                    </td>
                    <td>
                      {promo.active ? (
                        <span className="badge badge-success text-xs d-inline-flex align-items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Activa</span>
                        </span>
                      ) : (
                        <span className="badge badge-neutral text-xs d-inline-flex align-items-center gap-1">
                          <XCircle size={12} />
                          <span>Inactiva</span>
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleToggleActive(promo)}
                        >
                          {promo.active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(promo.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Creación */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Crear Nueva Promoción Comercial"
          size="md"
        >
          <form onSubmit={handleSave} className="promo-form">
            <div className="form-group mb-3">
              <label className="form-label">Nombre de la Campaña</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Ej: Jueves de Campo o Fin de Semana Parrillero"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                rows="2"
                required
                className="form-control"
                placeholder="Detalla las condiciones o beneficios..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-grid-2 mb-3">
              <div className="form-group">
                <label className="form-label">Porcentaje de Descuento (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  className="form-control"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Compra Mínima (COP)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="0 para sin mínimo"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Promoción
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminPromotionsPage;
