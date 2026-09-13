import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

export const ProductFilters = ({
  filters,
  categories = [],
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    onlyAvailable,
    setOnlyAvailable,
    sortBy,
    setSortBy,
    resetFilters,
    totalCount,
    filteredCount,
  } = filters;

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    onlyAvailable !== false ||
    sortBy !== 'name-asc';

  return (
    <aside className="filters-container">
      {/* Botón de apertura de filtros en móvil */}
      <div className="filters-mobile-bar">
        <button
          type="button"
          className="btn btn-outline-primary btn-filter-toggle"
          onClick={() => setIsMobileOpen(true)}
          aria-expanded={isMobileOpen}
        >
          <SlidersHorizontal size={18} />
          <span>Filtros y Búsqueda</span>
          {hasActiveFilters && <span className="filter-active-dot" />}
        </button>

        <span className="results-count-mobile">
          {filteredCount} de {totalCount} productos
        </span>
      </div>

      {/* Panel de Filtros */}
      <div className={`filters-panel ${isMobileOpen ? 'filters-panel-open' : ''}`}>
        <div className="filters-header">
          <div className="filters-title-group">
            <h3 className="filters-title">Filtros del Catálogo</h3>
            <span className="results-badge">
              {filteredCount} de {totalCount}
            </span>
          </div>

          <button
            type="button"
            className="filters-mobile-close"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Cerrar panel de filtros"
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. Buscador por texto */}
        <div className="filter-group">
          <label htmlFor="search-input" className="filter-label">
            Buscar por producto, corte o finca
          </label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon-inside" />
            <input
              id="search-input"
              type="search"
              className="form-control filter-search-input pl-input-icon"
              placeholder="Ej: Punta de Anca, Aguacate, Marinilla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 2. Filtro por Categorías */}
        <div className="filter-group">
          <label className="filter-label">Líneas de Producto</label>
          <div className="category-pill-group">
            <button
              type="button"
              className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Todas las Categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${String(selectedCategory) === String(cat.id) ? 'active' : ''}`}
                onClick={() => setSelectedCategory(String(cat.id))}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Ordenamiento */}
        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">
            Criterio de Ordenamiento
          </label>
          <select
            id="sort-select"
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name-asc">Nombre: A a la Z</option>
            <option value="name-desc">Nombre: Z a la A</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="newest">Llegadas más recientes</option>
          </select>
        </div>

        {/* 4. Disponibilidad inmediata */}
        <div className="filter-group filter-checkbox-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <span className="checkbox-text">Solo productos con stock disponible</span>
          </label>
        </div>

        {/* 5. Acciones de restablecimiento */}
        {hasActiveFilters && (
          <div className="filters-reset-action">
            <button
              type="button"
              className="btn btn-outline-danger btn-block btn-sm"
              onClick={() => {
                resetFilters();
                setIsMobileOpen(false);
              }}
            >
              <RotateCcw size={14} />
              <span>Limpiar Filtros</span>
            </button>
          </div>
        )}

        {/* Botón aplicar en móvil */}
        <div className="filters-mobile-apply">
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => setIsMobileOpen(false)}
          >
            Ver {filteredCount} Productos
          </button>
        </div>
      </div>

      {/* Backdrop para móvil */}
      {isMobileOpen && (
        <div
          className="filters-mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </aside>
  );
};

export default ProductFilters;
