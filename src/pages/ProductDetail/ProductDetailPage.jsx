import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  MapPin, 
  Phone, 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  Beef 
} from 'lucide-react';
import productService from '../../services/products/productService';
import categoryService from '../../services/categories/categoryService';
import farmerService from '../../services/farmers/farmerService';
import { useCart } from '../../features/cart/hooks/useCart';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import QuantitySelector from '../../features/cart/components/QuantitySelector';
import LoadingState from '../../components/feedback/LoadingState';
import ErrorState from '../../components/feedback/ErrorState';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const prodData = await productService.getById(id);
        setProduct(prodData);

        const [catData, farmerData] = await Promise.all([
          prodData.categoryId ? categoryService.getById(prodData.categoryId).catch(() => null) : null,
          prodData.farmerId ? farmerService.getById(prodData.farmerId).catch(() => null) : null,
        ]);

        setCategory(catData);
        setFarmer(farmerData);
      } catch (err) {
        setError(err.message || 'No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingState type="spinner" message="Obteniendo detalles técnicos del producto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <ErrorState
          title="Producto no disponible"
          error={error || 'El producto seleccionado no existe o fue retirado del catálogo.'}
          onRetry={() => navigate('/products')}
        />
        <div className="text-center mt-3">
          <Link to="/products" className="btn btn-outline-primary">
            <ArrowLeft size={16} />
            <span>Volver al Catálogo</span>
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = Number(product.stock) > 0;
  const maxStock = Number(product.stock) || 0;
  const imageSrc = product.imageUrl || product.image;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="product-detail-page py-5">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs mb-4" aria-label="Navegación secundaria">
          <Link to="/">Inicio</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/products">Catálogo</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          {/* Columna Izquierda: Fotografía Real */}
          <div className="detail-media-column">
            <div className="detail-image-wrapper">
              <img
                src={imageSrc}
                alt={`Fotografía comercial real de ${product.name}`}
                className="detail-image"
              />
              <div className="detail-badges-overlay">
                {category && (
                  <Badge variant="category" size="md">
                    {category.name}
                  </Badge>
                )}
                {product.meatType && (
                  <Badge variant="neutral" size="md">
                    {product.meatType} • {product.cut}
                  </Badge>
                )}
                <Badge variant={isAvailable ? 'success' : 'danger'} size="md">
                  {isAvailable ? 'Disponible' : 'Agotado'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información y Acciones */}
          <div className="detail-info-column">
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-pricing-box">
              <span className="detail-price">{formatCurrency(product.price)}</span>
              <span className="detail-unit">/ {product.unit || 'kg'}</span>
            </div>

            <div className="detail-stock-indicator">
              <span className={`stock-dot ${isAvailable ? 'in-stock' : 'out-of-stock'}`} />
              <span>
                {isAvailable
                  ? `Existencias disponibles: ${product.stock} ${product.unit || 'unidades'}`
                  : 'Sin existencias en este momento'}
              </span>
            </div>

            <div className="detail-desc-box">
              <h3>Descripción del Producto</h3>
              <p>{product.description}</p>
              {product.createdAt && (
                <small className="text-muted d-block mt-2">
                  Registro de lote: {formatDate(product.createdAt)}
                </small>
              )}
            </div>

            {/* Ficha técnica cárnica si corresponde */}
            {product.meatType && (
              <div className="detail-meat-specs-box">
                <h4>Ficha Técnica del Corte</h4>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Tipo:</span>
                    <span className="spec-val">{product.meatType}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Corte:</span>
                    <span className="spec-val">{product.cut || 'Especial'}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Presentación:</span>
                    <span className="spec-val">{product.presentation || 'Al vacío'}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Conservación:</span>
                    <span className="spec-val">{product.conservation || 'Refrigerado 0°C a 4°C'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ficha del Productor */}
            {farmer && (
              <div className="farmer-detail-box">
                <div className="farmer-detail-header">
                  <img
                    src={farmer.avatar}
                    alt={`Fotografía de ${farmer.name}`}
                    className="farmer-detail-avatar"
                  />
                  <div>
                    <h4 className="farmer-detail-name">{farmer.name}</h4>
                    <span className="farmer-detail-farm">
                      <Store size={14} className="inline-icon" />
                      <span>{farmer.farmName}</span>
                    </span>
                  </div>
                </div>
                <div className="farmer-detail-meta">
                  <span>
                    <MapPin size={14} className="inline-icon" />
                    <span>{farmer.location}</span>
                  </span>
                  <span>
                    <Phone size={14} className="inline-icon" />
                    <span>{farmer.phone}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Selector de Cantidad y Botón de Carrito */}
            <div className="detail-purchase-box">
              {isAvailable ? (
                <>
                  <div className="quantity-row">
                    <label className="qty-label">Cantidad a solicitar:</label>
                    <QuantitySelector
                      quantity={quantity}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      maxStock={maxStock}
                      size="lg"
                    />
                    <span className="qty-subtotal-hint">
                      Subtotal: <strong>{formatCurrency(product.price * quantity)}</strong>
                    </span>
                  </div>

                  <div className="purchase-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg btn-block"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart size={20} />
                      <span>Agregar {quantity} {quantity === 1 ? 'unidad' : 'unidades'} a la Canasta</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="alert-out-of-stock">
                  Este producto se encuentra temporalmente sin existencias en bodega.
                </div>
              )}
            </div>

            <div className="detail-back-link">
              <Link to="/products" className="btn btn-outline-secondary btn-sm">
                <ArrowLeft size={16} />
                <span>Volver al Catálogo de Productos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
