import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAgroCatalog from '../../features/products/hooks/useAgroCatalog';
import ProductFilters from '../../features/products/components/ProductFilters';
import ProductGrid from '../../features/products/components/ProductGrid';
import LoadingState from '../../components/feedback/LoadingState';
import ErrorState from '../../components/feedback/ErrorState';

export const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const {
    products,
    categories,
    loading,
    error,
    reload,
    filters,
  } = useAgroCatalog();

  // Si viene con parámetro en URL (?category=2), seleccionarlo
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      filters.setSelectedCategory(categoryParam);
    }
  }, [searchParams, filters.setSelectedCategory]);

  return (
    <div className="products-page py-4">
      <div className="container">
        {/* Cabecera de Página */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Catálogo de Productos Agrícolas</h1>
            <p className="page-subtitle">
              Explora alimentos frescos cosechados directamente en tierras colombianas.
            </p>
          </div>
        </div>

        {/* Contenido Principal con Filtros y Grid */}
        <div className="catalog-layout">
          <ProductFilters
            filters={filters}
            categories={categories}
          />

          <main className="catalog-content">
            {loading ? (
              <LoadingState message="Cargando productos y resolviendo relaciones..." count={8} />
            ) : error ? (
              <ErrorState
                title="No fue posible conectar con MockAPI"
                error={error}
                onRetry={reload}
              />
            ) : (
              <ProductGrid
                products={products}
                onResetFilters={filters.resetFilters}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
