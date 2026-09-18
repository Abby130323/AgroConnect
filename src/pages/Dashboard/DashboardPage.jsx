import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Users, 
  Beef, 
  Egg,
  Sprout,
  Tag, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Truck,
  ThermometerSnowflake
} from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { USER_ROLES, ROLE_LABELS } from '../../features/auth/models/userModel.js';
import { isProductInUserDomain } from '../../features/auth/utils/permissions.js';
import productService from '../../services/products/productService.js';
import orderService from '../../features/orders/services/orderService.js';
import promotionService from '../../features/promotions/services/promotionService.js';
import farmerService from '../../services/farmers/farmerService.js';
import { formatCurrency } from '../../utils/formatters.js';

// Widgets Reutilizables
import StatCard from './widgets/StatCard.jsx';
import OrdersWidget from './widgets/OrdersWidget.jsx';
import InventoryWidget from './widgets/InventoryWidget.jsx';
import ProductionWidget from './widgets/ProductionWidget.jsx';
import SalesWidget from './widgets/SalesWidget.jsx';
import PromotionsWidget from './widgets/PromotionsWidget.jsx';
import RecentActivityWidget from './widgets/RecentActivityWidget.jsx';
import TransportLogisticsWidget from './widgets/TransportLogisticsWidget.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [prodList, orderList, promoList] = await Promise.all([
          productService.getAll().catch(() => []),
          orderService.getAll().catch(() => []),
          promotionService.getAll().catch(() => []),
        ]);

        if (!isMounted) return;

        setProducts(prodList);
        setOrders(orderList);
        setPromotions(promoList);

        // Si el usuario es ganadero, cargar datos de su finca/productor
        if (user?.farmerId) {
          const fData = await farmerService.getById(user.farmerId).catch(() => null);
          if (isMounted) setFarmer(fData);
        }
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        await productService.update(productId, { ...prod, stock: newStock });
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err) {
      console.error('Error al actualizar stock:', err);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <LoadingState type="spinner" message="Sincronizando información autorizada desde MockAPI..." />
      </div>
    );
  }

  // --- FILTRADO DE DATOS ESTRICTO SEGÚN ROL Y PRINCIPIO DE MÍNIMO PRIVILEGIO ---
  const userRole = user?.role || USER_ROLES.CLIENTE;

  // 1. Productos permitidos (Estricta separación de dominio)
  let specializedProducts = [];
  if (
    userRole === USER_ROLES.GANADERO_PORCINO ||
    userRole === USER_ROLES.GANADERO_BOVINO ||
    userRole === USER_ROLES.GANADERO_AVICOLA ||
    userRole === USER_ROLES.AGRICULTOR
  ) {
    specializedProducts = products.filter((p) => isProductInUserDomain(user, p));
  } else {
    specializedProducts = products;
  }

  // 2. Pedidos permitidos
  let allowedOrders = [];
  if (
    userRole === USER_ROLES.ADMIN ||
    userRole === USER_ROLES.EMPLEADO_PEDIDOS ||
    userRole === USER_ROLES.EMPLEADO_ATENCION ||
    userRole === USER_ROLES.EMPLEADO_INVENTARIO ||
    userRole === USER_ROLES.TRANSPORTADOR
  ) {
    allowedOrders = orders; // Empleados, Admin y Transportador ven todas
  } else if (userRole === USER_ROLES.CLIENTE) {
    // Cliente: SOLO pedidos con su propio userId
    allowedOrders = orders.filter((o) => String(o.userId) === String(user.id));
  } else if (
    userRole === USER_ROLES.GANADERO_PORCINO ||
    userRole === USER_ROLES.GANADERO_BOVINO ||
    userRole === USER_ROLES.GANADERO_AVICOLA ||
    userRole === USER_ROLES.AGRICULTOR
  ) {
    // Productores / Ganaderos: pedidos que contengan referencias de su especialidad
    const domainIds = new Set(specializedProducts.map((p) => String(p.id)));
    const domainNames = new Set(specializedProducts.map((p) => (p.name || '').toLowerCase()));
    allowedOrders = orders.filter((o) =>
      Array.isArray(o.items) &&
      o.items.some((item) =>
        domainIds.has(String(item.id)) ||
        domainNames.has((item.name || '').toLowerCase())
      )
    );
  }

  return (
    <div className="dashboard-page py-6">
      <div className="container">
        {/* Cabecera del Panel */}
        <div className="dashboard-header-bar mb-5">
          <div>
            <span className="badge badge-primary text-xs mb-1">
              {ROLE_LABELS[userRole] || userRole}
            </span>
            <h1 className="dashboard-user-greeting">
              Hola, {user?.name || 'Usuario'}
            </h1>
            <p className="text-muted text-sm">
              {user?.title || user?.email} • Sesión autenticada en MockAPI
            </p>
          </div>

          <div className="dashboard-top-ctas d-flex gap-2 flex-wrap">
            <Link to="/products" className="btn btn-outline-primary btn-sm">
              <ShoppingBag size={16} />
              <span>Ver Catálogo</span>
            </Link>
            {(userRole === USER_ROLES.ADMIN ||
              userRole === USER_ROLES.EMPLEADO_INVENTARIO ||
              userRole === USER_ROLES.GANADERO_PORCINO ||
              userRole === USER_ROLES.GANADERO_BOVINO ||
              userRole === USER_ROLES.GANADERO_AVICOLA ||
              userRole === USER_ROLES.AGRICULTOR) && (
              <Link to="/admin/products" className="btn btn-primary btn-sm">
                <Layers size={16} />
                <span>
                  {userRole === USER_ROLES.GANADERO_PORCINO
                    ? 'Control de Carne de Cerdo'
                    : userRole === USER_ROLES.GANADERO_BOVINO
                    ? 'Control de Carne de Res'
                    : userRole === USER_ROLES.GANADERO_AVICOLA
                    ? 'Control de Huevos y Pollo'
                    : userRole === USER_ROLES.AGRICULTOR
                    ? 'Control Cosechas y Fruver'
                    : 'Gestión CRUD'}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* --- VISTA: CLIENTES (CLIENTE 1, 2, 3) --- */}
        {userRole === USER_ROLES.CLIENTE && (
          <div className="client-dashboard-layout">
            <div className="row-grid-4 mb-4">
              <StatCard
                title="Mis Pedidos Registrados"
                value={allowedOrders.length}
                subtitle="Compras formalizadas a tu nombre"
                icon={Package}
                variant="primary"
              />
              <StatCard
                title="Pedidos en Camino"
                value={allowedOrders.filter((o) => o.status === 'en_camino').length}
                subtitle="Despachos logísticos activos"
                icon={Clock}
                variant="info"
              />
              <StatCard
                title="Pedidos Entregados"
                value={allowedOrders.filter((o) => o.status === 'entregado').length}
                subtitle="Recibidos a conformidad"
                icon={CheckCircle2}
                variant="success"
              />
              <StatCard
                title="Dirección Registrada"
                value={user?.city || 'Medellín'}
                subtitle={user?.address || 'Cobertura metropolitana'}
                icon={ShieldCheck}
                variant="default"
              />
            </div>

            <div className="mb-5">
              <OrdersWidget
                orders={allowedOrders}
                title="Mis Pedidos Recientes"
                subtitle="Historial exclusivo de tus compras. No accesible por otros clientes."
              />
            </div>

            <div className="mb-5">
              <PromotionsWidget
                promotions={promotions}
                title="Promociones Disponibles para Ti"
              />
            </div>
          </div>
        )}

        {/* --- VISTA: EMPLEADO 1 — INVENTARIO --- */}
        {userRole === USER_ROLES.EMPLEADO_INVENTARIO && (
          <div className="employee-inventory-layout">
            <div className="row-grid-4 mb-4">
              <StatCard
                title="Referencias en Catálogo"
                value={products.length}
                subtitle="Productos agrícolas y carnes"
                icon={Layers}
                variant="primary"
              />
              <StatCard
                title="Productos Agotados"
                value={products.filter((p) => Number(p.stock) <= 0).length}
                subtitle="Requiere reabastecimiento"
                icon={AlertCircle}
                variant="danger"
              />
              <StatCard
                title="Stock Crítico (≤10 uds)"
                value={products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 10).length}
                subtitle="Próximos a agotarse"
                icon={Clock}
                variant="warning"
              />
              <StatCard
                title="Unidades en Bodega"
                value={products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)}
                subtitle="Inventario total disponible"
                icon={CheckCircle2}
                variant="success"
              />
            </div>

            <div className="mb-5">
              <InventoryWidget
                products={products}
                canUpdateStock={true}
                onStockUpdate={handleStockUpdate}
              />
            </div>
          </div>
        )}

        {/* --- VISTA: EMPLEADO 2 — PEDIDOS Y LOGÍSTICA --- */}
        {userRole === USER_ROLES.EMPLEADO_PEDIDOS && (
          <div className="employee-orders-layout">
            <div className="row-grid-4 mb-4">
              <StatCard
                title="Órdenes Totales"
                value={allowedOrders.length}
                subtitle="En cola del sistema"
                icon={Package}
                variant="primary"
              />
              <StatCard
                title="Pendientes de Preparación"
                value={allowedOrders.filter((o) => o.status === 'pendiente').length}
                subtitle="Por coordinar con campesinos"
                icon={Clock}
                variant="warning"
              />
              <StatCard
                title="En Despacho / Ruta"
                value={allowedOrders.filter((o) => o.status === 'en_camino').length}
                subtitle="En tránsito hacia destino"
                icon={TrendingUp}
                variant="info"
              />
              <StatCard
                title="Entregas Exitosas"
                value={allowedOrders.filter((o) => o.status === 'entregado').length}
                subtitle="Entregadas a satisfacción"
                icon={CheckCircle2}
                variant="success"
              />
            </div>

            <div className="mb-5">
              <OrdersWidget
                orders={allowedOrders}
                title="Gestión de Despachos y Estados"
                subtitle="Coordina preparación, rutas y confirma entregas a los clientes."
                canChangeStatus={true}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        )}

        {/* --- VISTA: EMPLEADO 3 — ATENCIÓN AL CLIENTE --- */}
        {userRole === USER_ROLES.EMPLEADO_ATENCION && (
          <div className="employee-support-layout">
            <div className="row-grid-4 mb-4">
              <StatCard
                title="Consultas de Pedidos"
                value={allowedOrders.length}
                subtitle="Historial para soporte y PQRs"
                icon={Package}
                variant="primary"
              />
              <StatCard
                title="Campañas Activas"
                value={promotions.length}
                subtitle="Para orientación de clientes"
                icon={Tag}
                variant="success"
              />
              <StatCard
                title="Clientes Registrados"
                value="3 demo"
                subtitle="Directorio de compradores"
                icon={Users}
                variant="info"
              />
              <StatCard
                title="Nivel de Satisfacción"
                value="98%"
                subtitle="Tasa de entrega en tiempo"
                icon={ShieldCheck}
                variant="primary"
              />
            </div>

            <div className="mb-5">
              <OrdersWidget
                orders={allowedOrders}
                title="Consulta de Órdenes para Soporte"
                subtitle="Verifica estados y direcciones de despacho de los clientes."
              />
            </div>

            <div className="mb-5">
              <PromotionsWidget
                promotions={promotions}
                title="Promociones Vigentes para Orientación"
              />
            </div>
          </div>
        )}

        {/* --- VISTA: PRODUCTORES Y GANADEROS (PORCINO, BOVINO, AVÍCOLA, AGRICULTOR) --- */}
        {(userRole === USER_ROLES.GANADERO_PORCINO ||
          userRole === USER_ROLES.GANADERO_BOVINO ||
          userRole === USER_ROLES.GANADERO_AVICOLA ||
          userRole === USER_ROLES.AGRICULTOR) && (
          <div className="farmer-specialized-layout">
            <div className="row-grid-4 mb-4">
              <StatCard
                title={userRole === USER_ROLES.AGRICULTOR ? 'Cosechas y Cultivos' : 'Productos en Producción'}
                value={specializedProducts.length}
                subtitle={
                  userRole === USER_ROLES.GANADERO_PORCINO
                    ? 'Cortes de cerdo exclusivos'
                    : userRole === USER_ROLES.GANADERO_BOVINO
                    ? 'Cortes de res exclusivos'
                    : userRole === USER_ROLES.GANADERO_AVICOLA
                    ? 'Huevos y aves de corral'
                    : 'Frutas, verduras y hortalizas'
                }
                icon={userRole === USER_ROLES.GANADERO_AVICOLA ? Egg : userRole === USER_ROLES.AGRICULTOR ? Sprout : Beef}
                variant="primary"
              />
              <StatCard
                title="Existencias Disponibles"
                value={specializedProducts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)}
                subtitle="Unidades listas para despacho"
                icon={Layers}
                variant="success"
              />
              <StatCard
                title="Pedidos Vinculados"
                value={allowedOrders.length}
                subtitle="Órdenes con tus referencias"
                icon={Package}
                variant="info"
              />
              <StatCard
                title={userRole === USER_ROLES.AGRICULTOR ? 'Especialidad Agrícola' : 'Especialidad Ganadera'}
                value={user?.specialty || (userRole === USER_ROLES.AGRICULTOR ? 'Agricultura Campesina' : 'Producción Pecuaria')}
                subtitle={user?.title || 'Finca de origen'}
                icon={ShieldCheck}
                variant="default"
              />
            </div>

            <div className="mb-5">
              <ProductionWidget
                user={user}
                farmer={farmer}
                products={specializedProducts}
                userRole={userRole}
                specialtyTitle={
                  userRole === USER_ROLES.GANADERO_PORCINO
                    ? 'Línea Productiva: Porcicultura y Cortes de Cerdo (Exclusivo)'
                    : userRole === USER_ROLES.GANADERO_BOVINO
                    ? 'Línea Productiva: Ganadería Bovina y Cortes de Res (Exclusivo)'
                    : userRole === USER_ROLES.GANADERO_AVICOLA
                    ? 'Línea Productiva: Avicultura, Huevos Campesinos y Pollo (Exclusivo)'
                    : 'Línea Productiva: Agricultura Campesina, Huerta, Frutas y Hortalizas (Exclusivo)'
                }
              />
            </div>

            <div className="mb-5">
              <OrdersWidget
                orders={allowedOrders}
                title={
                  userRole === USER_ROLES.GANADERO_PORCINO
                    ? 'Pedidos con Carne de Cerdo'
                    : userRole === USER_ROLES.GANADERO_BOVINO
                    ? 'Pedidos con Carne de Res'
                    : userRole === USER_ROLES.GANADERO_AVICOLA
                    ? 'Pedidos con Huevos y Pollo'
                    : 'Pedidos con Frutas, Hortalizas y Despensa'
                }
                subtitle="Órdenes exclusivas que contienen referencias de tu especialidad."
              />
            </div>
          </div>
        )}

        {/* --- VISTA: TRANSPORTADOR / OPERADOR LOGÍSTICO RURAL --- */}
        {userRole === USER_ROLES.TRANSPORTADOR && (
          <div className="carrier-logistics-layout">
            <div className="row-grid-4 mb-4">
              <StatCard
                title="Despachos Cadena de Frío"
                value={orders.filter((o) => o.requiresColdChain).length}
                subtitle="Cortes y carnes refrigeradas (0°C a 4°C)"
                icon={ThermometerSnowflake}
                variant="info"
              />
              <StatCard
                title="Despachos Carga Seca"
                value={orders.filter((o) => !o.requiresColdChain).length}
                subtitle="Fruver, hortalizas y despensa"
                icon={Package}
                variant="primary"
              />
              <StatCard
                title="Recolecciones en Finca"
                value={orders.filter((o) => o.status === 'pendiente' || o.status === 'preparando').length}
                subtitle="Pendientes de retiro en origen"
                icon={Clock}
                variant="warning"
              />
              <StatCard
                title="Entregas Exitosas"
                value={orders.filter((o) => o.status === 'entregado').length}
                subtitle="Despachos culminados"
                icon={CheckCircle2}
                variant="success"
              />
            </div>

            <div className="mb-5">
              <TransportLogisticsWidget
                orders={orders}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        )}

        {/* --- VISTA: ADMINISTRADOR GENERAL --- */}
        {userRole === USER_ROLES.ADMIN && (
          <div className="admin-master-dashboard">
            <div className="row-grid-4 mb-4">
              <StatCard
                title="Ventas Totales"
                value={formatCurrency(orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0))}
                subtitle="Recaudo bruto consolidado"
                icon={TrendingUp}
                variant="success"
              />
              <StatCard
                title="Pedidos Totales"
                value={orders.length}
                subtitle="Transacciones en MockAPI"
                icon={Package}
                variant="primary"
              />
              <StatCard
                title="Catálogo Activo"
                value={products.length}
                subtitle="32 productos con fotos reales"
                icon={Layers}
                variant="info"
              />
              <StatCard
                title="Usuarios y Roles"
                value="10 demo"
                subtitle="Admin, Clientes, Empleados, Ganaderos"
                icon={Users}
                variant="warning"
              />
            </div>

            <div className="mb-5">
              <SalesWidget orders={orders} />
            </div>

            <div className="mb-5">
              <OrdersWidget
                orders={orders}
                title="Control Global de Órdenes y Trazabilidad"
                subtitle="Gestión integral de pedidos, estados de entrega y logística en tiempo real"
                canChangeStatus={true}
                onStatusChange={handleStatusChange}
              />
            </div>

            <div className="mb-5">
              <InventoryWidget
                products={products}
                title="Control Global de Inventario y Stock"
                canUpdateStock={true}
                onStockUpdate={handleStockUpdate}
              />
            </div>

            <div className="grid-2-cols gap-4 mb-5">
              <PromotionsWidget promotions={promotions} />
              <RecentActivityWidget />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
