import React, { useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import useProductForm from '../hooks/useProductForm';
import { USER_ROLES } from '../../auth/models/userModel.js';

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  farmers = [],
  isSaving = false,
  userRole = null,
  currentUser = null,
}) => {
  const isEditing = Boolean(initialData && initialData.id);

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    setFormData,
  } = useProductForm(initialData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          price: initialData.price !== undefined ? String(initialData.price) : '',
          unit: initialData.unit || 'kg',
          stock: initialData.stock !== undefined ? String(initialData.stock) : '',
          imageUrl: initialData.imageUrl || initialData.image || '',
          image: initialData.imageUrl || initialData.image || '',
          categoryId: initialData.categoryId ? String(initialData.categoryId) : '',
          farmerId: initialData.farmerId ? String(initialData.farmerId) : '',
          meatType: initialData.meatType || '',
          cut: initialData.cut || '',
          presentation: initialData.presentation || '',
          conservation: initialData.conservation || '',
        });
      } else {
        resetForm();
        // Prefijar valores obligatorios según el rol del ganadero
        if (userRole === USER_ROLES.GANADERO_PORCINO) {
          setFormData((prev) => ({
            ...prev,
            meatType: 'Cerdo',
            categoryId: '7',
            farmerId: String(currentUser?.farmerId || '6'),
          }));
        } else if (userRole === USER_ROLES.GANADERO_BOVINO) {
          setFormData((prev) => ({
            ...prev,
            meatType: 'Res',
            categoryId: '7',
            farmerId: String(currentUser?.farmerId || '3'),
          }));
        } else if (userRole === USER_ROLES.GANADERO_AVICOLA) {
          setFormData((prev) => ({
            ...prev,
            meatType: 'Avicola',
            categoryId: '8',
            farmerId: String(currentUser?.farmerId || '4'),
          }));
        } else if (userRole === USER_ROLES.AGRICULTOR) {
          setFormData((prev) => ({
            ...prev,
            meatType: '',
            cut: '',
            categoryId: '2',
            farmerId: String(currentUser?.farmerId || '1'),
          }));
        }
      }
    }
  }, [isOpen, initialData, resetForm, setFormData, userRole, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) return;

    await onSubmit({
      ...formData,
      image: formData.imageUrl,
    });
    onClose();
  };

  // Filtrado de opciones estrictas por rol ganadero o agricultor
  let filteredCategories = categories;
  let filteredFarmers = farmers;
  let meatTypeOptions = [
    { value: '', label: 'No aplica (Agrícola / Fruver)' },
    { value: 'Res', label: 'Carne de Res' },
    { value: 'Cerdo', label: 'Carne de Cerdo' },
    { value: 'Avicola', label: 'Avícola (Huevos y Pollo)' },
  ];

  if (userRole === USER_ROLES.GANADERO_PORCINO) {
    filteredCategories = categories.filter((c) => String(c.id) === '7' || (c.name || '').toLowerCase().includes('cerdo') || (c.name || '').toLowerCase().includes('carnes seleccionadas'));
    meatTypeOptions = [{ value: 'Cerdo', label: 'Carne de Cerdo (Exclusivo)' }];
    if (currentUser?.farmerId) {
      filteredFarmers = farmers.filter((f) => String(f.id) === String(currentUser.farmerId));
    }
  } else if (userRole === USER_ROLES.GANADERO_BOVINO) {
    filteredCategories = categories.filter((c) => String(c.id) === '7' || (c.name || '').toLowerCase().includes('res') || (c.name || '').toLowerCase().includes('carnes seleccionadas'));
    meatTypeOptions = [{ value: 'Res', label: 'Carne de Res (Exclusivo)' }];
    if (currentUser?.farmerId) {
      filteredFarmers = farmers.filter((f) => String(f.id) === String(currentUser.farmerId));
    }
  } else if (userRole === USER_ROLES.GANADERO_AVICOLA) {
    filteredCategories = categories.filter((c) => String(c.id) === '8' || (c.name || '').toLowerCase().includes('avícol') || (c.name || '').toLowerCase().includes('avicol'));
    meatTypeOptions = [{ value: 'Avicola', label: 'Avícola (Huevos y Pollo)' }];
    if (currentUser?.farmerId) {
      filteredFarmers = farmers.filter((f) => String(f.id) === String(currentUser.farmerId));
    }
  } else if (userRole === USER_ROLES.AGRICULTOR) {
    filteredCategories = categories.filter((c) => {
      const name = (c.name || '').toLowerCase();
      return !name.includes('carne') && !name.includes('avícol') && !name.includes('avicol') && String(c.id) !== '7' && String(c.id) !== '8';
    });
    meatTypeOptions = [{ value: '', label: 'No aplica (Agrícola / Fruver / Huerta)' }];
    if (currentUser?.farmerId) {
      filteredFarmers = farmers.filter((f) => String(f.id) === String(currentUser.farmerId));
    }
  }

  const categoryOptions = filteredCategories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const farmerOptions = filteredFarmers.map((f) => ({
    value: String(f.id),
    label: `${f.name} (${f.farmName || f.location})`,
  }));

  const unitOptions = [
    { value: 'kg', label: 'Kilogramo (kg)' },
    { value: 'libra', label: 'Libra' },
    { value: 'cubeta x 30', label: 'Cubeta x 30' },
    { value: 'estuche x 15', label: 'Estuche x 15' },
    { value: 'bandeja 500g', label: 'Bandeja 500g' },
    { value: 'unidad', label: 'Unidad' },
    { value: 'atado', label: 'Atado' },
    { value: 'frasco 500g', label: 'Frasco 500g' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Producto del Catálogo' : 'Registrar Nuevo Producto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} noValidate className="product-form">
        <div className="form-grid-2">
          <Input
            label="Nombre del Producto"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: Punta de Anca Angus o Aguacate Hass"
            error={errors.name}
            required
          />

          <Select
            label="Categoría"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
            options={categoryOptions}
            placeholder="-- Seleccionar Categoría --"
            error={errors.categoryId}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descripción y Especificaciones <span className="required-mark">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            rows="3"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe las características sensoriales, origen o sugerencia culinaria..."
          />
          {errors.description && (
            <span className="form-error-msg" role="alert">
              {errors.description}
            </span>
          )}
        </div>

        <div className="form-grid-3">
          <Input
            label="Precio Unitario (COP)"
            name="price"
            type="number"
            min="1"
            value={formData.price}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: 38500"
            error={errors.price}
            required
          />

          <Select
            label="Presentación / Unidad"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            onBlur={handleBlur}
            options={unitOptions}
            error={errors.unit}
            required
          />

          <Input
            label="Stock Disponible"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: 25"
            error={errors.stock}
            helperText="Si es 0, aparecerá marcado como Agotado"
            required
          />
        </div>

        {/* Sección específica para productos cárnicos (oculta para agricultores) */}
        {userRole !== USER_ROLES.AGRICULTOR && (
          <div className="form-section-highlight">
            <h4 className="form-section-title">Especificaciones Cárnicas (Opcional)</h4>
            <div className="form-grid-3">
              <Select
                label="Tipo de Carne"
                name="meatType"
                value={formData.meatType || ''}
                onChange={handleChange}
                options={meatTypeOptions}
              />

              <Input
                label="Corte Específico"
                name="cut"
                value={formData.cut || ''}
                onChange={handleChange}
                placeholder="Ej: Punta de Anca, Costilla"
              />

              <Input
                label="Conservación"
                name="conservation"
                value={formData.conservation || ''}
                onChange={handleChange}
                placeholder="Ej: Refrigerado 0°C a 4°C"
              />
            </div>
          </div>
        )}

        <div className="form-grid-2">
          <Select
            label="Productor Responsable"
            name="farmerId"
            value={formData.farmerId}
            onChange={handleChange}
            onBlur={handleBlur}
            options={farmerOptions}
            placeholder="-- Seleccionar Productor --"
            error={errors.farmerId}
            required
          />

          <Input
            label="URL de la Fotografía Real"
            name="imageUrl"
            type="url"
            value={formData.imageUrl || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://images.unsplash.com/..."
            error={errors.image || errors.imageUrl}
            helperText="Enlace público de la fotografía comercial del producto"
            required
          />
        </div>

        {formData.imageUrl && (
          <div className="form-image-preview">
            <span className="preview-label">Vista previa de la fotografía:</span>
            <img
              src={formData.imageUrl}
              alt="Vista previa comercial"
              className="preview-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="modal-actions mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            loading={isSaving}
            disabled={isSaving}
          >
            {isEditing ? 'Guardar Cambios' : 'Registrar Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
