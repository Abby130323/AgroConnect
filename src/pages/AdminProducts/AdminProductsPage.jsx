import React, { useState } from 'react';
import { 
  RotateCcw, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  BookOpen, 
  FolderOpen,
  Beef,
  Egg
} from 'lucide-react';
import useAgroCatalog from '../../features/products/hooks/useAgroCatalog';
import { useProducts } from '../../features/products/hooks/useProducts';
import ProductFormModal from '../../features/products/components/ProductFormModal';
import DeleteConfirmModal from '../../features/products/components/DeleteConfirmModal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingState from '../../components/feedback/LoadingState';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { USER_ROLES } from '../../features/auth/models/userModel.js';
import { isProductInUserDomain } from '../../features/auth/utils/permissions.js';

export const AdminProductsPage = () => {
  const { user } = useAuth();
  const userRole = user?.role || USER_ROLES.ADMIN;

  const {
    categories,
    farmers,
    loading: catalogLoading,
    reload: reloadCatalog,
  } = useAgroCatalog();

  const {
    products,
    loading: productsLoading,
    isSaving,
    isDeleting,
    createProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  } = useProducts();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [adminSearch, setAdminSearch] = useState('');

  const categoryMap = new Map(categories.map((c) => [String(c.id), c.name]));
  const farmerMap = new Map(farmers.map((f) => [String(f.id), `${f.name} (${f.farmName || f.location})`]));

  // Regla estricta: Ganadero Porcino sólo ve cerdo, Bovino sólo res, Avícola sólo huevos/pollo.
  const domainProducts = products.filter((p) => isProductInUserDomain(user, p));

  const filteredProducts = domainProducts.filter((p) => {
    if (!adminSearch.trim()) return true;
    const term = adminSearch.toLowerCase();
    const nameMatch = (p.name || '').toLowerCase().includes(term);
    const catName = categoryMap.get(String(p.categoryId)) || '';
    const farmerName = farmerMap.get(String(p.farmerId)) || '';
    return nameMatch || catName.toLowerCase().includes(term) || farmerName.toLowerCase().includes(term);
  });

  const pageBadge = 
    userRole === USER_ROLES.GANADERO_PORCINO
      ? 'Panel Ganadero • Porcicultura'
      : userRole === USER_ROLES.GANADERO_BOVINO
      ? 'Panel Ganadero • Ganadería Bovina'
      : userRole === USER_ROLES.GANADERO_AVICOLA
      ? 'Panel Ganadero • Avicultura'
      : 'Panel de Control REST';

  const pageTitle = 
    userRole === USER_ROLES.GANADERO_PORCINO
      ? 'Gestión Exclusiva de Carne de Cerdo'
      : userRole === USER_ROLES.GANADERO_BOVINO
      ? 'Gestión Exclusiva de Carne de Res'
      : userRole === USER_ROLES.GANADERO_AVICOLA
      ? 'Gestión Exclusiva de Huevos y Pollo'
      : 'Gestión de Productos y Cortes (CRUD)';

  const pageSubtitle = 
    userRole === USER_ROLES.GANADERO_PORCINO
      ? 'Control exclusivo de inventario de cortes de cerdo. Por políticas de rol, no puedes ver ni gestionar otros productos.'
      : userRole === USER_ROLES.GANADERO_BOVINO
      ? 'Control exclusivo de inventario de cortes de res. Por políticas de rol, no puedes ver ni gestionar otros productos.'
      : userRole === USER_ROLES.GANADERO_AVICOLA
      ? 'Control exclusivo de inventario de huevos y pollo campesino. Por políticas de rol, no puedes ver ni gestionar otros productos.'
      : 'Administración de alimentos y carnes comunicándose directamente con los endpoints de MockAPI.';

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingProduct && editingProduct.id) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await createProduct(formData);
    }
    reloadCatalog();
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      reloadCatalog();
    }
  };

  const isLoading = catalogLoading || productsLoading;

  return (
    <div className="admin-page py-5">
      <div className="container">
        {/* Encabezado del Panel */}
        <div className="admin-header-flex">
          <div>
            <span className="admin-badge">{pageBadge}</span>
            <h1 className="admin-title">{pageTitle}</h1>
            <p className="admin-subtitle">{pageSubtitle}</p>
          </div>

          <div className="admin-top-actions">
            {userRole === USER_ROLES.ADMIN && (
              <Button
                variant="outline-secondary"
                onClick={resetProducts}
                title="Restablece el catálogo inicial de prueba"
              >
                <RotateCcw size={16} />
                <span>Restablecer Catálogo</span>
              </Button>
            )}

            <Button
              variant="primary"
              size="lg"
              onClick={handleOpenCreate}
            >
              <Plus size={18} />
              <span>
                {userRole === USER_ROLES.GANADERO_PORCINO
                  ? 'Nuevo Corte de Cerdo'
                  : userRole === USER_ROLES.GANADERO_BOVINO
                  ? 'Nuevo Corte de Res'
                  : userRole === USER_ROLES.GANADERO_AVICOLA
                  ? 'Nuevo Producto Avícola'
                  : 'Nuevo Producto'}
              </span>
            </Button>
          </div>
        </div>

        {/* Ficha Explicativa */}
        <div className="admin-academic-card mb-4">
          <div className="card-section-header">
            <BookOpen size={18} className="text-primary" />
            <h4>Especificación de Operaciones REST</h4>
          </div>
          <div className="admin-crud-badges">
            <span className="badge-op badge-post">POST /producto (Crear)</span>
            <span className="badge-op badge-get">GET /producto (Listar)</span>
            <span className="badge-op badge-put">PUT /producto/:id (Actualizar)</span>
            <span className="badge-op badge-delete">DELETE /producto/:id (Eliminar)</span>
          </div>
          <p className="small text-muted mt-2">
            Todas las operaciones sincronizan el estado en React de manera <strong>inmutable</strong> (empleando <code>[...prev]</code>, <code>map()</code> y <code>filter()</code>) sin recargar la página.
          </p>
        </div>

        {/* Barra de Búsqueda y Métricas */}
        <div className="admin-controls-bar">
          <div className="admin-search-wrapper">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon-inside" />
              <input
                type="search"
                className="form-control pl-input-icon"
                placeholder="Buscar por nombre, corte o categoría..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="admin-stats-pill">
            Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
          </div>
        </div>

        {/* Tabla o Tarjetas Responsive */}
        {isLoading ? (
          <LoadingState type="table" count={6} />
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty-box text-center py-5">
            <div className="empty-icon-wrapper">
              <FolderOpen size={48} className="text-muted" />
            </div>
            <h3>No se encontraron productos</h3>
            <p>No hay registros que coincidan con la búsqueda o el catálogo está vacío.</p>
            <Button variant="primary" onClick={handleOpenCreate} className="mt-2">
              <Plus size={16} />
              <span>Crear Producto</span>
            </Button>
          </div>
        ) : (
          <div className="admin-table-container">
            {/* Vista Tabla Desktop */}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fotografía</th>
                  <th>Producto</th>
                  <th>Categoría / Corte</th>
                  <th>Productor</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isAvail = Number(p.stock) > 0;
                  const categoryName = categoryMap.get(String(p.categoryId)) || 'Sin categoría';
                  const farmerInfo = farmerMap.get(String(p.farmerId)) || 'Productor local';
                  const imageSrc = p.imageUrl || p.image;

                  return (
                    <tr key={p.id}>
                      <td className="admin-td-img">
                        <img 
                          src={imageSrc} 
                          alt={`Fotografía de ${p.name}`} 
                          className="admin-thumb" 
                          loading="lazy"
                        />
                      </td>
                      <td className="admin-td-name">
                        <strong>{p.name}</strong>
                        <small className="d-block text-muted line-clamp-1">{p.description}</small>
                      </td>
                      <td>
                        <Badge variant="category" size="sm">
                          {categoryName}
                        </Badge>
                        {p.cut && (
                          <small className="d-block text-muted mt-1">{p.cut}</small>
                        )}
                      </td>
                      <td className="admin-td-farmer">
                        <span>{farmerInfo}</span>
                      </td>
                      <td className="admin-td-price">
                        {formatCurrency(p.price)}
                        <small className="text-muted"> / {p.unit || 'kg'}</small>
                      </td>
                      <td className="admin-td-stock">
                        <strong>{p.stock}</strong> {p.unit || 'uds'}
                      </td>
                      <td>
                        <Badge variant={isAvail ? 'success' : 'danger'} size="sm">
                          {isAvail ? 'Disponible' : 'Agotado'}
                        </Badge>
                      </td>
                      <td className="admin-td-actions text-right">
                        <button
                          type="button"
                          className="btn-action btn-action-edit"
                          onClick={() => handleOpenEdit(p)}
                          title="Editar producto"
                        >
                          <Edit2 size={14} className="inline-icon" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-action-delete"
                          onClick={() => handleOpenDelete(p)}
                          title="Eliminar producto"
                        >
                          <Trash2 size={14} className="inline-icon" />
                          <span>Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Vista Tarjetas Móvil */}
            <div className="admin-cards-mobile">
              {filteredProducts.map((p) => {
                const isAvail = Number(p.stock) > 0;
                const categoryName = categoryMap.get(String(p.categoryId)) || 'Sin categoría';
                const imageSrc = p.imageUrl || p.image;

                return (
                  <div key={p.id} className="admin-mobile-card">
                    <div className="admin-mobile-card-header">
                      <img 
                        src={imageSrc} 
                        alt={`Fotografía de ${p.name}`} 
                        className="admin-mobile-thumb" 
                        loading="lazy"
                      />
                      <div className="admin-mobile-title-box">
                        <h4 className="admin-mobile-name">{p.name}</h4>
                        <Badge variant="category" size="sm">{categoryName}</Badge>
                      </div>
                    </div>

                    <div className="admin-mobile-card-body">
                      <div className="admin-mobile-row">
                        <span>Precio:</span>
                        <strong>{formatCurrency(p.price)} / {p.unit}</strong>
                      </div>
                      <div className="admin-mobile-row">
                        <span>Stock:</span>
                        <span>{p.stock} {p.unit} ({isAvail ? 'Disponible' : 'Agotado'})</span>
                      </div>
                    </div>

                    <div className="admin-mobile-card-actions">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm flex-1"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <Edit2 size={14} className="inline-icon" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm flex-1"
                        onClick={() => handleOpenDelete(p)}
                      >
                        <Trash2 size={14} className="inline-icon" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ProductFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          categories={categories}
          farmers={farmers}
          isSaving={isSaving}
          userRole={userRole}
          currentUser={user}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          product={productToDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default AdminProductsPage;
