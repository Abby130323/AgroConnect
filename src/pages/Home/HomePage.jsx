import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Settings, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Award, 
  CheckCircle2, 
  UtensilsCrossed, 
  Apple, 
  Carrot, 
  Package, 
  Coffee,
  Beef,
  Truck,
  Store,
  ThermometerSnowflake,
  Sparkles
} from 'lucide-react';
import useAgroCatalog from '../../features/products/hooks/useAgroCatalog';
import ProductCard from '../../features/products/components/ProductCard';
import LoadingState from '../../components/feedback/LoadingState';
import ErrorState from '../../components/feedback/ErrorState';
import PromotionBanner from '../../features/promotions/components/PromotionBanner.jsx';
import PromotionalModal from '../../features/promotions/components/PromotionalModal.jsx';
import promotionService from '../../features/promotions/services/promotionService.js';

export const HomePage = () => {
  const navigate = useNavigate();
  const { products, categories, farmers, loading, error, reload } = useAgroCatalog();
  const [activePromotion, setActivePromotion] = useState(null);

  useEffect(() => {
    promotionService.getAll()
      .then((promos) => {
        if (Array.isArray(promos) && promos.length > 0) {
          setActivePromotion(promos[0]);
        }
      })
      .catch(() => {});
  }, []);

  const featuredProducts = products.slice(0, 8);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  const getCategoryIcon = (iconKey) => {
    switch (iconKey) {
      case 'beef':
        return <Beef size={28} className="category-icon-svg" />;
      case 'pork':
        return <UtensilsCrossed size={28} className="category-icon-svg" />;
      case 'fruits':
        return <Apple size={28} className="category-icon-svg" />;
      case 'vegetables':
        return <Carrot size={28} className="category-icon-svg" />;
      case 'tubers':
        return <Package size={28} className="category-icon-svg" />;
      case 'pantry':
      case 'coffee':
        return <Coffee size={28} className="category-icon-svg" />;
      default:
        return <CheckCircle2 size={28} className="category-icon-svg" />;
    }
  };

  return (
    <div className="home-page">
      {/* 1. Hero Principal de Supermercado Agroalimentario */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge-wrapper">
              <ShieldCheck size={16} className="hero-badge-icon" />
              <span>Alimentos Seleccionados Directos del Productor</span>
            </div>
            <h1 className="hero-title">
              Cortes Selectos y <span className="text-highlight">Cosechas del Campo</span> en tu Hogar
            </h1>
            <p className="hero-subtitle">
              Abastécete con carne de res madurada, cortes porcinos, aves, frutas y hortalizas 
              frescas, con trazabilidad desde las fincas de familias campesinas y ganaderos.
            </p>

            <div className="hero-cta-group">
              <Link to="/products" className="btn btn-primary btn-lg">
                <span>Explorar Catálogo</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline-secondary btn-lg">
                <span>Acceso a Productores</span>
              </Link>
            </div>

            {/* Métricas Dinámicas del Negocio */}
            <div className="hero-stats">
              <div className="hero-stat-item">
                <span className="stat-number">{products.length || 30}+</span>
                <span className="stat-label">Cortes y Cosechas</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-number">{categories.length || 6}</span>
                <span className="stat-label">Departamentos</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-number">{farmers.length || 6}</span>
                <span className="stat-label">Fincas Vinculadas</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80"
                alt="Selección de alimentos frescos y carnes seleccionadas del campo"
                className="hero-main-img"
              />
              <div className="hero-floating-badge">
                <div className="floating-icon-box">
                  <Award size={22} />
                </div>
                <div>
                  <strong>Origen de Finca</strong>
                  <small>Directo desde el predio productor</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Banner Promocional Dinámico */}
      {activePromotion && (
        <div className="container my-4">
          <PromotionBanner promotion={activePromotion} />
        </div>
      )}

      {/* Modal Publicitario Emergente */}
      <PromotionalModal promotion={activePromotion} />

      {/* 3. Pasillos y Categorías del Campo */}
      <section className="categories-section py-5">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Departamentos del Mercado</span>
            <h2 className="section-title">Explora por Categorías</h2>
            <p className="section-desc">Selecciona el tipo de alimento o corte especializado para tu mesa.</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => handleCategoryClick(cat.id)}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.id)}
              >
                <div className="category-icon-wrapper">
                  {getCategoryIcon(cat.iconKey)}
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.description}</p>
                <span className="category-link">Ver pasillo →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Productos Destacados */}
      <section className="featured-section py-5 bg-surface">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-eyebrow">Selección del Día</span>
              <h2 className="section-title">Cortes y Productos Destacados</h2>
            </div>
            <Link to="/products" className="btn btn-outline-primary">
              <span>Ver Catálogo Completo ({products.length})</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingState message="Cargando productos destacados del campo..." count={8} />
          ) : error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Directorio de Productores y Trazabilidad */}
      <section className="farmers-section py-5">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Trazabilidad Rural</span>
            <h2 className="section-title">Familias Campesinas y Ganaderos</h2>
            <p className="section-desc">
              Conoce el origen, las fincas y las manos responsables de cada producto.
            </p>
          </div>

          <div className="farmers-grid">
            {farmers.slice(0, 4).map((farmer) => (
              <div key={farmer.id} className="farmer-profile-card">
                <img
                  src={farmer.avatar}
                  alt={`Fotografía de ${farmer.name}`}
                  className="farmer-avatar"
                  loading="lazy"
                />
                <div className="farmer-info">
                  <h3 className="farmer-name">{farmer.name}</h3>
                  <span className="farmer-farm">{farmer.farmName}</span>
                  <span className="farmer-loc">
                    <MapPin size={13} className="inline-icon" />
                    <span>{farmer.location}</span>
                  </span>
                  <span className="farmer-contact">
                    <Phone size={13} className="inline-icon" />
                    <span>{farmer.phone}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Compromiso de Calidad y Logística AgroConnect */}
      <section className="assurance-section py-5 bg-gradient-agro">
        <div className="container">
          <div className="text-center text-white mb-4">
            <span className="assurance-pill">Compromiso AgroConnect</span>
            <h2 className="assurance-title">Abastecimiento Directo y Calidad en Origen</h2>
            <p className="assurance-subtitle">
              Conectamos la producción rural colombiana con los hogares a través de procesos organizados y eficientes.
            </p>
          </div>

          <div className="assurance-grid">
            <div className="assurance-card">
              <div className="assurance-icon-box">
                <Store size={26} />
              </div>
              <h3 className="assurance-card-title">Origen de Finca Verificado</h3>
              <p className="assurance-card-desc">
                Cada alimento proviene de ganaderos y familias campesinas registradas, respaldando la economía del campo.
              </p>
            </div>

            <div className="assurance-card">
              <div className="assurance-icon-box">
                <ThermometerSnowflake size={26} />
              </div>
              <h3 className="assurance-card-title">Conservación Adecuada</h3>
              <p className="assurance-card-desc">
                Cuidado de la temperatura para cortes cárnicos y manejo fresco para frutas y hortalizas de huerta.
              </p>
            </div>

            <div className="assurance-card">
              <div className="assurance-icon-box">
                <ShieldCheck size={26} />
              </div>
              <h3 className="assurance-card-title">Pesaje y Trazabilidad</h3>
              <p className="assurance-card-desc">
                Porciones y pesos exactos según la presentación requerida, garantizando transparencia en cada pedido.
              </p>
            </div>

            <div className="assurance-card">
              <div className="assurance-icon-box">
                <Truck size={26} />
              </div>
              <h3 className="assurance-card-title">Logística y Despacho</h3>
              <p className="assurance-card-desc">
                Coordinación de traslados desde los predios rurales hasta tu dirección con operadores dedicados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
