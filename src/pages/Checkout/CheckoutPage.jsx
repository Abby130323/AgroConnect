import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ShoppingBag, MapPin, CheckCircle2, ArrowLeft, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../features/cart/hooks/useCart.js';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import orderService from '../../features/orders/services/orderService.js';
import { formatCurrency } from '../../utils/formatters.js';
import Modal from '../../components/common/Modal.jsx';

const checkoutSchema = z.object({
  fullName: z.string().nonempty('El nombre completo es obligatorio').min(3, 'Mínimo 3 caracteres'),
  email: z.string().nonempty('El correo electrónico es obligatorio').email('Formato de correo electrónico no válido'),
  phone: z.string().nonempty('El teléfono es obligatorio').min(7, 'Ingresa al menos 7 dígitos'),
  address: z.string().nonempty('La dirección es obligatoria').min(5, 'Ingresa la dirección completa de entrega'),
  city: z.string().nonempty('La ciudad o municipio es obligatorio'),
  notes: z.string().optional(),
});

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totals, clearCart } = useCart();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '+57 300 123 4567',
      address: user?.address || 'Calle 10 # 43E-20',
      city: user?.city || 'Medellín',
      notes: '',
    },
  });

  useEffect(() => {
    if (user) {
      if (user.name) setValue('fullName', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
      if (user.address) setValue('address', user.address);
      if (user.city) setValue('city', user.city);
    }
  }, [user, setValue]);

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="checkout-page py-6">
        <div className="container text-center">
          <div className="checkout-empty-card">
            <div className="empty-icon-wrapper">
              <ShoppingBag size={48} className="text-muted" />
            </div>
            <h2>No tienes productos para procesar</h2>
            <p>Para formalizar un pedido, primero agrega alimentos o cortes a tu canasta de compras.</p>
            <Link to="/products" className="btn btn-primary mt-3">
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: user ? String(user.id) : null,
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        shippingAddress: data.address,
        city: data.city,
        items: items.map((i) => ({
          id: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          unit: i.unit,
        })),
        subtotal: totals.subtotal,
        discount: totals.discount || 0,
        total: totals.total,
        status: 'pendiente',
        createdAt: new Date().toISOString(),
        notes: data.notes || '',
      };

      // Registro real en MockAPI /orden
      const savedOrder = await orderService.create(orderPayload);
      
      setConfirmedOrder(savedOrder);
      clearCart();
      toast.success('¡Pedido registrado con éxito en MockAPI!', {
        description: `Código de orden asignado: #${savedOrder.id}`,
      });
    } catch (err) {
      toast.error('Error al formalizar el pedido', {
        description: err.message || 'No se pudo registrar la orden en el servidor REST.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page py-5">
      <div className="container">
        <div className="page-header mb-4">
          <h1 className="page-title">Proceso de Entrega y Formalización</h1>
          <p className="page-subtitle">
            Ingresa tus datos de entrega para coordinar el despacho directo desde los centros de acopio y fincas.
          </p>
        </div>

        <div className="checkout-grid">
          {/* Formulario */}
          <div className="checkout-form-column">
            <div className="checkout-card">
              <div className="card-section-header">
                <MapPin size={20} className="text-primary" />
                <h2 className="card-section-title">Datos de Entrega y Destinatario</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      Nombre Completo <span className="required-mark">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      placeholder="Ej: Juliana Restrepo"
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <span className="form-error-msg" role="alert">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Correo Electrónico <span className="required-mark">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="juliana@ejemplo.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <span className="form-error-msg" role="alert">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Teléfono / Celular <span className="required-mark">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="+57 300 123 4567"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <span className="form-error-msg" role="alert">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      Municipio / Ciudad <span className="required-mark">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      placeholder="Ej: Marinilla o Medellín"
                      {...register('city')}
                    />
                    {errors.city && (
                      <span className="form-error-msg" role="alert">
                        {errors.city.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Dirección Completa de Envío <span className="required-mark">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Calle, Carrera, Edificio o Vereda..."
                    {...register('address')}
                  />
                  {errors.address && (
                    <span className="form-error-msg" role="alert">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="notes" className="form-label">
                    Instrucciones Especiales de Entrega (Opcional)
                  </label>
                  <textarea
                    id="notes"
                    rows="3"
                    className="form-control"
                    placeholder="Ej: Dejar en portería, timbre 402, maduración específica..."
                    {...register('notes')}
                  />
                </div>

                <div className="checkout-payment-hint p-3 rounded mb-4 bg-muted">
                  <ShieldCheck size={18} className="text-primary d-inline mr-2" />
                  <span className="text-sm">
                    <strong>Modalidad de Pago:</strong> Contra entrega en efectivo, transferencia o datáfono móvil al recibir los alimentos frescos.
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Registrando Pedido en MockAPI...</span>
                  ) : (
                    <span>Confirmar y Formalizar Pedido ({formatCurrency(totals.total)})</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Resumen Lateral */}
          <div className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h3 className="summary-title">Resumen de Alimentos ({totals.totalUnits} uds)</h3>

              <div className="checkout-items-mini-list">
                {items.map((item) => (
                  <div key={item.productId} className="mini-item-row">
                    <img 
                      src={item.imageUrl || item.image} 
                      alt={`Fotografía de ${item.name}`} 
                      className="mini-item-thumb" 
                    />
                    <div className="mini-item-info">
                      <span className="mini-item-name">{item.name}</span>
                      <small className="mini-item-qty">
                        {item.quantity} {item.unit || 'uds'} × {formatCurrency(item.price)}
                      </small>
                    </div>
                    <span className="mini-item-subtotal">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-totals-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal bruto</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="breakdown-row text-success font-bold">
                    <span className="d-flex align-items-center gap-1">
                      <Tag size={14} />
                      <span>Descuento aplicado</span>
                    </span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}

                <div className="breakdown-row">
                  <span>Envío logístico</span>
                  <span>{totals.shipping === 0 ? 'Gratis' : formatCurrency(totals.shipping)}</span>
                </div>

                <div className="breakdown-row total-row">
                  <span>Total Final</span>
                  <span className="total-highlight">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Pedido Exitoso */}
        {confirmedOrder && (
          <Modal
            isOpen={true}
            onClose={() => navigate('/products')}
            title="Pedido Registrado Correctamente"
            size="md"
          >
            <div className="order-success-content text-center">
              <div className="order-success-icon-wrapper">
                <CheckCircle2 size={48} className="text-success" />
              </div>
              <h3>Confirmación de Pedido Comercial</h3>
              <p className="order-id-badge">
                Código de Pedido en MockAPI: <strong>#{confirmedOrder.id}</strong>
              </p>
              <p className="order-description">
                Hemos formalizado el registro para el destinatario{' '}
                <strong>{confirmedOrder.customerName}</strong>.
                Los productos serán despachados hacia{' '}
                <strong>{confirmedOrder.shippingAddress}, {confirmedOrder.city}</strong>.
              </p>

              <div className="order-summary-box text-left">
                <div className="order-summary-row">
                  <span>Estado del despacho:</span>
                  <strong className="text-primary font-bold">Pendiente de Preparación</strong>
                </div>
                <div className="order-summary-row">
                  <span>Total liquidado:</span>
                  <strong>{formatCurrency(confirmedOrder.total)}</strong>
                </div>
              </div>

              <div className="modal-actions mt-4">
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Ver en Mi Panel de Pedidos
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
