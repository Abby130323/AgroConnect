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
  Beef
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
        return <Beef size={28} className="text-primary" />;
      case 'pork':
        return <UtensilsCrossed size={28} className="text-primary" />;
      case 'fruits':
        return <Apple size={28} className="text-primary" />;
      case 'vegetables':
        return <Carrot size={28} className="text-primary" />;
      case 'tubers':
        return <Package size={28} className="text-primary" />;
      case 'pantry':
      case 'coffee':
        return <Coffee size={28} className="text-primary" />;
      default:
        return <CheckCircle2 size={28} className="text-primary" />;
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge-wrapper">
              <ShieldCheck size={16} />
              <span>Comercio Directo y Alimentos 100% Frescos</span>
            </div>
            <h1 className="hero-title">
              Cortes Selectos y <span className="text-highlight">Cosechas del Campo</span> en tu Hogar
            </h1>
            <p className="hero-subtitle">
              Compra carne de res madurada, carne de cerdo premium, frutas, hortalizas y café
              directamente a productores del campo colombiano, con trazabilidad garantizada.
            </p>

            <div className="hero-cta-group">
              <Link to="/products" className="btn btn-primary btn-lg">
                <span>Explorar Catálogo</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/admin/products" className="btn btn-outline-secondary btn-lg">
                <Settings size={18} />
                <span>Panel Administrativo</span>
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <span className="stat-number">30+</span>
                <span className="stat-label">Cortes y Cosechas</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Fotografías Reales</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-number">REST</span>
                <span className="stat-label">Arquitectura por Capas</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80"
                alt="Selección de alimentos frescos y cortes comerciales del campo"
                className="hero-main-img"
              />
              <div className="hero-floating-badge">
                <div className="floating-icon-box">
                  <Award size={22} className="text-primary" />
                </div>
                <div>
                  <strong>Origen Certificado</strong>
                  <small>Directo desde el predio productor</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Promocional Dinámico */}
      {activePromotion && (
        <div className="container my-4">
          <PromotionBanner promotion={activePromotion} />
        </div>
      )}

      {/* Modal Publicitario Emergente */}
      <PromotionalModal promotion={activePromotion} />

      {/* Categorías del Campo */}
      <section className="categories-section py-5">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Líneas de Producción</span>
            <h2 className="section-title">Explora por Categorías</h2>
            <p className="section-desc">Selecciona el tipo de alimento o corte que deseas llevar a tu mesa.</p>
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
                <span className="category-link">Ver catálogo →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="featured-section py-5 bg-surface">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-eyebrow">Selección Especial</span>
              <h2 className="section-title">Cortes y Productos Destacados</h2>
            </div>
            <Link to="/products" className="btn btn-outline-primary">
              <span>Ver Catálogo Completo ({products.length})</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingState message="Cargando catálogo destacado..." count={8} />
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

      {/* Directorio de Productores */}
      <section className="farmers-section py-5">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Trazabilidad</span>
            <h2 className="section-title">Productores y Familias Campesinas</h2>
            <p className="section-desc">
              Conoce el origen y las fincas responsables de cada alimento comercializado.
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

      {/* Explicación Didáctica de Arquitectura */}
      <section className="architecture-banner py-5 bg-gradient-agro">
        <div className="container text-center text-white">
          <span className="arch-pill">Arquitectura por Capas Desacoplada</span>
          <h2 className="arch-title">Flujo de Comunicación REST en AgroConnect</h2>
          <div className="arch-flow-diagram">
            <div className="flow-step">
              <span className="flow-num">1</span>
              <strong>React UI</strong>
              <small>Componentes de presentación</small>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-num">2</span>
              <strong>Custom Hooks</strong>
              <small>useAgroCatalog / useCart</small>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-num">3</span>
              <strong>Services</strong>
              <small>productService / categoryService</small>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-num">4</span>
              <strong>HTTP Client</strong>
              <small>fetch centralizado</small>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-num">5</span>
              <strong>MockAPI REST</strong>
              <small>Endpoints JSON</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
