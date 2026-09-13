import { useState, useEffect, useMemo, useCallback } from 'react';
import productService from '../../../services/products/productService';
import categoryService from '../../../services/categories/categoryService';
import farmerService from '../../../services/farmers/farmerService';
import { useCart } from '../../cart/hooks/useCart';

/**
 * Hook useAgroCatalog
 * 
 * Orquesta la carga simultánea mediante Promise.all():
 * - Products
 * - Categories
 * - Farmers
 * 
 * Resuelve relaciones en memoria mediante Maps (O(1)) para crear un Modelo de Presentación enriquecido.
 * Aplica filtros dinámicos (búsqueda, categoría, disponibilidad, ordenamiento) sin recargas.
 */
export const useAgroCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc', 'name-desc', 'price-asc', 'price-desc', 'newest'

  const { syncWithCatalog } = useCart();

  /**
   * Carga paralela con Promise.all()
   */
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData, farmersData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        farmerService.getAll(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setFarmers(farmersData);

      // Sincronizar defensivamente el carrito
      if (syncWithCatalog) {
        syncWithCatalog(productsData);
      }
    } catch (err) {
      console.error('[useAgroCatalog] Error en carga simultánea:', err);
      setError(err.message || 'Error cargando datos del catálogo');
    } finally {
      setLoading(false);
    }
  }, [syncWithCatalog]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  /**
   * Construcción de Diccionarios / Maps para resolución de relaciones en O(1)
   */
  const { categoryMap, farmerMap } = useMemo(() => {
    const cMap = new Map();
    categories.forEach((cat) => cMap.set(String(cat.id), cat));

    const fMap = new Map();
    farmers.forEach((farmer) => fMap.set(String(farmer.id), farmer));

    return { categoryMap: cMap, farmerMap: fMap };
  }, [categories, farmers]);

  /**
   * Modelo de Presentación:
   * Enriquece cada producto con el objeto completo de su categoría y productor,
   * sin modificar el modelo original en MockAPI.
   */
  const presentationProducts = useMemo(() => {
    return products.map((product) => {
      const category = categoryMap.get(String(product.categoryId)) || {
        id: product.categoryId,
        name: 'Categoría General',
        description: '',
      };

      const farmer = farmerMap.get(String(product.farmerId)) || {
        id: product.farmerId,
        name: 'Productor Local',
        farmName: 'Finca Campesina',
        location: 'Colombia',
      };

      const stockNum = Number(product.stock) || 0;

      return {
        ...product,
        category,
        farmer,
        isAvailable: stockNum > 0,
      };
    });
  }, [products, categoryMap, farmerMap]);

  /**
   * Filtrado y Ordenamiento Dinámico en memoria
   */
  const filteredProducts = useMemo(() => {
    return presentationProducts
      .filter((product) => {
        // Filtro por búsqueda textual (nombre, descripción, finca o productor)
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          const matchName = product.name.toLowerCase().includes(term);
          const matchDesc = (product.description || '').toLowerCase().includes(term);
          const matchFarmer = (product.farmer?.name || '').toLowerCase().includes(term);
          const matchFarm = (product.farmer?.farmName || '').toLowerCase().includes(term);

          if (!matchName && !matchDesc && !matchFarmer && !matchFarm) {
            return false;
          }
        }

        // Filtro por categoría
        if (selectedCategory !== 'all') {
          if (String(product.categoryId) !== String(selectedCategory)) {
            return false;
          }
        }

        // Filtro por disponibilidad (stock > 0)
        if (onlyAvailable && !product.isAvailable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name, 'es');
          case 'name-desc':
            return b.name.localeCompare(a.name, 'es');
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          default:
            return 0;
        }
      });
  }, [presentationProducts, searchTerm, selectedCategory, onlyAvailable, sortBy]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setOnlyAvailable(false);
    setSortBy('name-asc');
  }, []);

  return {
    products: filteredProducts,
    allProducts: presentationProducts,
    rawProducts: products,
    categories,
    farmers,
    loading,
    error,
    reload: loadAllData,
    filters: {
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      onlyAvailable,
      setOnlyAvailable,
      sortBy,
      setSortBy,
      resetFilters,
      totalCount: presentationProducts.length,
      filteredCount: filteredProducts.length,
    },
  };
};

export default useAgroCatalog;
