import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, User } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { useCart } from '../../cart/hooks/useCart';
import Badge from '../../../components/common/Badge';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isAvailable = Number(product.stock) > 0;
  const imageSrc = product.imageUrl || product.image;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAvailable) {
      addToCart(product, 1);
    }
  };

  return (
    <article className={`product-card ${!isAvailable ? 'product-card-out-of-stock' : ''}`}>
      {/* 1. Fotografía Real */}
      <div className="product-card-media">
        <Link to={`/products/${product.id}`} className="product-media-link" tabIndex="-1">
          <img
            src={imageSrc}
            alt={`Fotografía real de ${product.name}`}
            className="product-card-img"
            loading="lazy"
          />
        </Link>
        <div className="product-card-badges">
          {product.category && (
            <Badge variant="category" size="sm">
              {typeof product.category === 'object' ? product.category.name : product.category}
            </Badge>
          )}
          {product.meatType && (
            <Badge variant="neutral" size="sm">
              {product.meatType} • {product.cut}
            </Badge>
          )}
          <Badge variant={isAvailable ? 'success' : 'danger'} size="sm">
            {isAvailable ? 'Disponible' : 'Agotado'}
          </Badge>
        </div>
      </div>

      <div className="product-card-body">
        {/* Trazabilidad del Productor */}
        {product.farmer && (
          <div className="product-farmer-preview" title={`Origen: ${product.farmer.location}`}>
            <User size={13} className="farmer-icon-svg" />
            <span className="farmer-text">
              {product.farmer.name} • <small>{product.farmer.farmName}</small>
            </span>
          </div>
        )}

        {/* 2. Nombre del producto */}
        <h3 className="product-card-title">
          <Link to={`/products/${product.id}`} className="product-title-link">
            {product.name}
          </Link>
        </h3>

        {/* 3. Descripción breve */}
        <p className="product-card-desc">
          {product.description}
        </p>

        {/* 4. Presentación / Unidad y especificación técnica */}
        <div className="product-specs-row">
          <span className="product-unit-badge">
            Presentación: {product.presentation || product.unit || 'kg'}
          </span>
          {product.conservation && (
            <span className="product-conservation-badge">
              {product.conservation}
            </span>
          )}
        </div>

        {/* 5. Precio y Existencias */}
        <div className="product-card-footer">
          <div className="product-price-box">
            <span className="product-price-amount">
              {formatCurrency(product.price)}
            </span>
            <span className="product-price-unit">/ {product.unit || 'kg'}</span>
            <span className="product-stock-counter">
              {isAvailable ? `Stock: ${product.stock} ${product.unit}` : 'Sin existencias'}
            </span>
          </div>

          {/* 6. Acciones */}
          <div className="product-card-actions">
            <Link
              to={`/products/${product.id}`}
              className="btn btn-outline-primary btn-sm btn-detail"
              aria-label={`Ver detalles de ${product.name}`}
            >
              <Eye size={15} />
              <span>Detalles</span>
            </Link>

            <button
              type="button"
              className={`btn btn-sm btn-add-cart ${isAvailable ? 'btn-primary' : 'btn-disabled'}`}
              onClick={handleAddToCart}
              disabled={!isAvailable}
              aria-label={`Agregar ${product.name} a la canasta`}
            >
              <ShoppingCart size={15} />
              <span>{isAvailable ? 'Agregar' : 'Agotado'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
