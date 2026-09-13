import { useState, useEffect, useCallback } from 'react';
import farmerService from '../../../services/farmers/farmerService';

/**
 * Hook para la gestión del recurso Agricultores
 */
export const useFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarmers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmerService.getAll();
      setFarmers(data);
    } catch (err) {
      setError(err.message || 'Error cargando agricultores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  return {
    farmers,
    loading,
    error,
    refreshFarmers: fetchFarmers,
  };
};

export default useFarmers;
