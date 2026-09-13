import { useState, useCallback } from 'react';

const INITIAL_FORM_VALUES = {
  name: '',
  description: '',
  price: '',
  unit: 'kg',
  stock: '',
  image: '',
  categoryId: '',
  farmerId: '',
};

export const useProductForm = (initialData = null) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        unit: initialData.unit || 'kg',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        image: initialData.image || '',
        categoryId: initialData.categoryId ? String(initialData.categoryId) : '',
        farmerId: initialData.farmerId ? String(initialData.farmerId) : '',
      };
    }
    return INITIAL_FORM_VALUES;
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          error = 'El nombre del producto es obligatorio.';
        } else if (value.trim().length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres.';
        }
        break;

      case 'description':
        if (!value || !value.trim()) {
          error = 'La descripción es obligatoria.';
        } else if (value.trim().length < 10) {
          error = 'Describe el producto con al menos 10 caracteres.';
        }
        break;

      case 'price':
        if (value === '' || value === null || value === undefined) {
          error = 'El precio es obligatorio.';
        } else if (Number(value) <= 0 || isNaN(Number(value))) {
          error = 'El precio debe ser un número mayor a 0.';
        }
        break;

      case 'unit':
        if (!value || !value.trim()) {
          error = 'La unidad de medida es obligatoria.';
        }
        break;

      case 'stock':
        if (value === '' || value === null || value === undefined) {
          error = 'El stock es obligatorio.';
        } else if (Number(value) < 0 || isNaN(Number(value))) {
          error = 'El stock no puede ser negativo.';
        }
        break;

      case 'image':
        if (!value || !value.trim()) {
          error = 'La URL de la imagen es obligatoria.';
        } else if (!/^https?:\/\/.+/i.test(value.trim())) {
          error = 'Ingresa una URL válida (ej: https://...).';
        }
        break;

      case 'categoryId':
        if (!value) {
          error = 'Selecciona una categoría para el producto.';
        }
        break;

      case 'farmerId':
        if (!value) {
          error = 'Selecciona el productor agrícola responsable.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar en vivo si ya fue tocado
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  }, [touched]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }, []);

  const validateAll = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([field, value]) => {
      const fieldError = validateField(field, value);
      if (fieldError) {
        newErrors[field] = fieldError;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = useCallback(() => {
    setFormData(initialData ? { ...initialData } : INITIAL_FORM_VALUES);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    formData,
    setFormData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  };
};

export default useProductForm;
