import { useState, useEffect, useCallback } from 'react';
import productService from '../../../services/products/productService';
import { useToast } from '../../../context/ToastContext';

/**
 * Hook useProducts
 * 
 * Gestiona el ciclo de vida del recurso Productos:
 * - Lectura REST (GET)
 * - Creación REST (POST)
 * - Actualización REST (PUT)
 * - Eliminación REST (DELETE)
 * - Inmutabilidad estricta en el estado de React sin recarga de página.
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Error al obtener productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Operación CREATE (POST /products)
   * Actualización inmutable: [...prev, created]
   */
  const createProduct = async (productData) => {
    setIsSaving(true);
    try {
      const created = await productService.create(productData);
      setProducts((prev) => [created, ...prev]);
      addToast('Producto creado correctamente.', 'success');
      return { success: true, product: created };
    } catch (err) {
      addToast(`Error al crear producto: ${err.message}`, 'error');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Operación UPDATE (PUT /products/:id)
   * Actualización inmutable: prev.map(...)
   */
  const updateProduct = async (id, productData) => {
    setIsSaving(true);
    try {
      const updated = await productService.update(id, productData);
      setProducts((prev) =>
        prev.map((item) => (String(item.id) === String(id) ? updated : item))
      );
      addToast('Producto actualizado correctamente.', 'success');
      return { success: true, product: updated };
    } catch (err) {
      addToast(`Error al actualizar producto: ${err.message}`, 'error');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Operación DELETE (DELETE /products/:id)
   * Actualización inmutable: prev.filter(...)
   */
  const deleteProduct = async (id) => {
    setIsDeleting(true);
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((item) => String(item.id) !== String(id)));
      addToast('Producto eliminado correctamente.', 'info');
      return { success: true };
    } catch (err) {
      addToast(`Error al eliminar producto: ${err.message}`, 'error');
      return { success: false, error: err.message };
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Restablecer catálogo a semillas originales (útil para sustentación)
   */
  const resetProducts = () => {
    const fresh = productService.resetToInitial();
    setProducts(fresh);
    addToast('Catálogo restablecido con los datos iniciales.', 'info');
  };

  return {
    products,
    loading,
    error,
    isSaving,
    isDeleting,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  };
};

export default useProducts;
