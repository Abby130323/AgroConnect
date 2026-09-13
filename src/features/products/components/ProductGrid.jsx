import React from 'react';
import { PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard';
import EmptyState from '../../../components/feedback/EmptyState';

export const ProductGrid = ({ products = [], onResetFilters }) => {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No encontramos productos con esos criterios"
        message="Intenta buscar con otros términos, seleccionar otra categoría o restablecer los filtros."
        actionLabel="Restablecer Filtros"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="product-grid" role="region" aria-label="Catálogo de productos agrícolas">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
