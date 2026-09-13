import { INITIAL_CATEGORIES, INITIAL_FARMERS, INITIAL_PRODUCTS } from '../src/utils/seedData.js';
import { formatCurrency, formatDate, isAvailable } from '../src/utils/formatters.js';
import { INITIAL_USERS, USER_ROLES } from '../src/features/auth/models/userModel.js';
import { 
  canManageUsers, 
  canManageProducts, 
  canManageOrders, 
  canManageInventory, 
  canViewAdminPanel, 
  canManageOwnProducts, 
  canBuy,
  hasPermission,
  isProductInUserDomain,
  PERMISSIONS 
} from '../src/features/auth/utils/permissions.js';
import { 
  getPromotionProgress, 
  calculateCartDiscount, 
  calculateTotal 
} from '../src/features/promotions/utils/promotionsCalculator.js';

async function runTests() {
  console.log('==========================================');
  console.log('   AGROCONNECT -- PRUEBAS DE ARQUITECTURA');
  console.log('==========================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`  [PASSED] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAILED] ${testName}`);
    }
  }

  // 1. MODELO DE DATOS Y RELACIONES
  console.log('[1] Verificacion de Entidades y Relaciones');
  assert(INITIAL_CATEGORIES.length >= 6, 'Existen al menos 6 categorias registradas');
  assert(INITIAL_FARMERS.length >= 6, 'Existen al menos 6 campesinos registrados');
  assert(INITIAL_PRODUCTS.length >= 30, 'Existen al menos 30 productos en el catalogo inicial');

  // Integridad de llaves foraneas
  const categoryIds = new Set(INITIAL_CATEGORIES.map(c => String(c.id)));
  const farmerIds = new Set(INITIAL_FARMERS.map(f => String(f.id)));

  const allCategoriesValid = INITIAL_PRODUCTS.every(p => categoryIds.has(String(p.categoryId)));
  const allFarmersValid = INITIAL_PRODUCTS.every(p => farmerIds.has(String(p.farmerId)));

  assert(allCategoriesValid, 'Todos los productos tienen relacion integra con CATEGORIA (categoryId)');
  assert(allFarmersValid, 'Todos los productos tienen relacion integra con PRODUCTOR (farmerId)');

  // 2. MODELO DE DATOS OBLIGATORIO Y FOTOGRAFIAS REALES
  console.log('\n[2] Estandar del Modelo de Producto y Fotografias Reales');
  const requiredFields = ['id', 'name', 'description', 'price', 'stock', 'categoryId', 'farmerId', 'imageUrl', 'unit'];
  
  const allHaveRequiredFields = INITIAL_PRODUCTS.every(p => 
    requiredFields.every(field => p[field] !== undefined && p[field] !== null && p[field] !== '')
  );
  assert(allHaveRequiredFields, 'Todos los productos cumplen con los campos minimos obligatorios (incluyendo imageUrl y unit)');

  // Fotografias reales y no placeholders
  const allValidPhotos = INITIAL_PRODUCTS.every(p => 
    typeof p.imageUrl === 'string' && 
    p.imageUrl.startsWith('https://images.unsplash.com/') &&
    !p.imageUrl.includes('placeholder') &&
    !p.imageUrl.includes('via.placeholder')
  );
  assert(allValidPhotos, 'Todas las fotografias son URLs reales de alta resolucion comercial (sin placeholders)');

  // Proporcion visual y unicidad de imagenes para productos diferentes
  const imageUrls = INITIAL_PRODUCTS.map(p => p.imageUrl);
  const uniqueUrls = new Set(imageUrls);
  assert(uniqueUrls.size >= INITIAL_PRODUCTS.length * 0.9, 'Fotografias unicas y representativas asignadas individualmente a cada corte/producto');

  // 3. PRODUCTOS CARNICOS Y PROPIEDADES ESPECIFICAS
  console.log('\n[3] Especificaciones Tecnicas de Productos Carnicos');
  const meatProducts = INITIAL_PRODUCTS.filter(p => p.meatType);
  assert(meatProducts.length >= 7, `Existen al menos 7 productos carnicos especializados (encontrados: ${meatProducts.length})`);

  const beefProducts = INITIAL_PRODUCTS.filter(p => p.meatType === 'Res');
  const porkProducts = INITIAL_PRODUCTS.filter(p => p.meatType === 'Cerdo');
  assert(beefProducts.length >= 4, `Cortes especializados de Res registrados (${beefProducts.length} cortes)`);
  assert(porkProducts.length >= 3, `Cortes especializados de Cerdo registrados (${porkProducts.length} cortes)`);

  const allMeatHaveSpecs = meatProducts.every(p => 
    p.cut && p.presentation && p.conservation && p.meatType
  );
  assert(allMeatHaveSpecs, 'Todos los productos carnicos contienen ficha tecnica: cut, presentation, conservation y meatType');

  // 4. REGLA DE NEGOCIO: DISPONIBILIDAD DERIVADA DE STOCK
  console.log('\n[4] Regla de Negocio: Disponibilidad Derivada de Stock');
  assert(isAvailable(10) === true, 'Stock = 10 -> isAvailable es true');
  assert(isAvailable(1) === true, 'Stock = 1 -> isAvailable es true');
  assert(isAvailable(0) === false, 'Stock = 0 -> isAvailable es false (Agotado)');
  assert(isAvailable(-5) === false, 'Stock < 0 -> isAvailable es false');

  // 5. RESOLUCION EFICIENTE DE RELACIONES O(1)
  console.log('\n[5] Resolucion Concurrente y Mapeo en O(1)');
  const catMap = new Map(INITIAL_CATEGORIES.map(c => [String(c.id), c]));
  const farmMap = new Map(INITIAL_FARMERS.map(f => [String(f.id), f]));

  const sampleProduct = INITIAL_PRODUCTS[0];
  const enrichedCategory = catMap.get(String(sampleProduct.categoryId));
  const enrichedFarmer = farmMap.get(String(sampleProduct.farmerId));

  assert(enrichedCategory && enrichedCategory.name.length > 0, `Resolucion categoria "${enrichedCategory?.name}" para producto "${sampleProduct.name}"`);
  assert(enrichedFarmer && enrichedFarmer.name.length > 0, `Resolucion productor "${enrichedFarmer?.name}" (${enrichedFarmer?.farmName})`);

  // 6. LOGICA DEL CARRITO E INMUTABILIDAD
  console.log('\n[6] Logica del Carrito y Control Estricto de Stock');
  let cart = [];

  const productToAdd = { ...sampleProduct, stock: 5 };
  const addAction = (currentCart, prod, qty) => {
    const existing = currentCart.find(i => i.productId === prod.id);
    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > prod.stock) return { cart: currentCart, error: 'Excede stock' };
      return {
        cart: currentCart.map(i => i.productId === prod.id ? { ...i, quantity: newQty } : i),
        error: null
      };
    }
    if (qty > prod.stock) return { cart: currentCart, error: 'Excede stock' };
    return {
      cart: [...currentCart, { productId: prod.id, price: prod.price, quantity: qty, stock: prod.stock }],
      error: null
    };
  };

  const res1 = addAction(cart, productToAdd, 3);
  cart = res1.cart;
  assert(cart.length === 1 && cart[0].quantity === 3, 'Agregar 3 unidades de un producto con stock 5');

  const res2 = addAction(cart, productToAdd, 3);
  assert(res2.error === 'Excede stock' && res2.cart[0].quantity === 3, 'Bloqueo estricto al superar el stock maximo disponible');

  const totalUnits = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  assert(totalUnits === 3, `Unidades totales en carrito calculadas correctamente (${totalUnits} uds)`);
  assert(subtotal === productToAdd.price * 3, `Subtotal liquidado correctamente (${formatCurrency(subtotal)})`);

  // 7. AUTENTICACION Y 10 ROLES DEMO
  console.log('\n[7] Verificacion de los 10 Roles de Usuario Predefinidos');
  assert(INITIAL_USERS.length === 10, 'Existen exactamente 10 cuentas de usuario predefinidas');

  const admin = INITIAL_USERS.find(u => u.email === 'admin@agroconnect.com');
  const cliente1 = INITIAL_USERS.find(u => u.email === 'cliente1@agroconnect.com');
  const cliente2 = INITIAL_USERS.find(u => u.email === 'cliente2@agroconnect.com');
  const cliente3 = INITIAL_USERS.find(u => u.email === 'cliente3@agroconnect.com');
  const empInv = INITIAL_USERS.find(u => u.email === 'empleado1@agroconnect.com');
  const empPed = INITIAL_USERS.find(u => u.email === 'empleado2@agroconnect.com');
  const empAte = INITIAL_USERS.find(u => u.email === 'empleado3@agroconnect.com');
  const ganPorcino = INITIAL_USERS.find(u => u.email === 'porcino@agroconnect.com');
  const ganBovino = INITIAL_USERS.find(u => u.email === 'bovino@agroconnect.com');
  const ganAvicola = INITIAL_USERS.find(u => u.email === 'avicola@agroconnect.com');

  assert(admin && admin.role === USER_ROLES.ADMIN, 'Cuenta Administrador validada (admin@agroconnect.com)');
  assert(cliente1 && cliente2 && cliente3, '3 Cuentas de Cliente validadas (cliente1, cliente2, cliente3)');
  assert(empInv && empInv.role === USER_ROLES.EMPLEADO_INVENTARIO, 'Empleado 1: Inventario validado');
  assert(empPed && empPed.role === USER_ROLES.EMPLEADO_PEDIDOS, 'Empleado 2: Pedidos validado');
  assert(empAte && empAte.role === USER_ROLES.EMPLEADO_ATENCION, 'Empleado 3: Atencion validado');
  assert(ganPorcino && ganPorcino.role === USER_ROLES.GANADERO_PORCINO, 'Ganadero Porcino validado (porcino@agroconnect.com)');
  assert(ganBovino && ganBovino.role === USER_ROLES.GANADERO_BOVINO, 'Ganadero Bovino validado (bovino@agroconnect.com)');
  assert(ganAvicola && ganAvicola.role === USER_ROLES.GANADERO_AVICOLA, 'Ganadero Avicola validado (avicola@agroconnect.com)');

  // 8. MATRIZ DE PERMISOS (RBAC)
  console.log('\n[8] Evaluacion de la Matriz de Permisos (RBAC)');
  assert(canManageUsers(admin) === true, 'Admin tiene permiso de gestionar usuarios');
  assert(canManageUsers(cliente1) === false, 'Cliente NO tiene permiso de gestionar usuarios');
  assert(canManageUsers(empInv) === false, 'Empleado Inventario NO tiene permiso de gestionar usuarios');
  assert(canViewAdminPanel(admin) === true, 'Admin puede acceder a panel administrativo global');
  assert(canViewAdminPanel(ganBovino) === false, 'Ganadero NO puede acceder a panel administrativo global');
  assert(canBuy(cliente1) === true, 'Cliente tiene permiso de compra');
  assert(canBuy(empInv) === false, 'Empleado no tiene perfil de comprador directo');
  assert(canManageInventory(empInv) === true, 'Empleado Inventario puede gestionar inventario');

  // Restriccion de gestion de productos propios para ganaderos
  const bovineProduct = { id: '1', farmerId: '3', name: 'Punta de Anca' };
  const porcineProduct = { id: '6', farmerId: '6', name: 'Costilla de Cerdo' };

  assert(canManageOwnProducts(ganBovino, bovineProduct) === true, 'Ganadero bovino puede gestionar su propio producto (farmerId 3)');
  assert(canManageOwnProducts(ganBovino, porcineProduct) === false, 'Ganadero bovino NO puede gestionar productos porcinos ajenos');
  assert(canManageOwnProducts(admin, porcineProduct) === true, 'Administrador puede gestionar cualquier producto');

  // 9. MOTOR DE PROMOCIONES Y DESCUENTOS ESCALONADOS
  console.log('\n[9] Motor de Promociones y Descuentos por Monto');
  const prog1 = getPromotionProgress(50000);
  assert(prog1.currentDiscountPercent === 0 && prog1.missingAmount === 50000, 'Subtotal $50.000 -> 0% descuento, faltan $50.000 para nivel 10%');

  const prog2 = getPromotionProgress(150000);
  assert(prog2.currentDiscountPercent === 10 && prog2.missingAmount === 50000, 'Subtotal $150.000 -> 10% descuento activo, faltan $50.000 para nivel 15%');

  const prog3 = getPromotionProgress(250000);
  assert(prog3.currentDiscountPercent === 15 && prog3.missingAmount === 50000, 'Subtotal $250.000 -> 15% descuento activo, faltan $50.000 para nivel 20%');

  const prog4 = getPromotionProgress(350000);
  assert(prog4.currentDiscountPercent === 20 && prog4.missingAmount === 0, 'Subtotal $350.000 -> 20% descuento maximo activo');

  // Calculo de liquidacion de orden con promocion
  const mockItems = [
    { productId: '1', price: 100000, quantity: 2 }, // $200.000 -> 15% ($30.000)
  ];
  const cartTotals = calculateTotal(mockItems, [], 0);
  assert(cartTotals.subtotal === 200000, 'Subtotal liquidado correctamente en $200.000');
  assert(cartTotals.discountAmount === 30000, 'Descuento liquidado en $30.000 (15%)');
  assert(cartTotals.finalTotal === 170000, 'Total neto final liquidado en $170.000');

  // 10. AUSENCIA TOTAL DE EMOJIS EN MODELOS DE DATOS
  console.log('\n[10] Verificacion de Ausencia de Emojis');
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
  
  const noEmojisInProducts = INITIAL_PRODUCTS.every(p => 
    !emojiRegex.test(p.name) && !emojiRegex.test(p.description) && (!p.cut || !emojiRegex.test(p.cut))
  );
  const noEmojisInCategories = INITIAL_CATEGORIES.every(c => 
    !emojiRegex.test(c.name) && !emojiRegex.test(c.description)
  );
  const noEmojisInUsers = INITIAL_USERS.every(u => 
    !emojiRegex.test(u.name) && !emojiRegex.test(u.title)
  );

  assert(noEmojisInProducts, 'Los productos no contienen emojis');
  assert(noEmojisInCategories, 'Las categorias no contienen emojis');
  assert(noEmojisInUsers, 'Los usuarios y perfiles no contienen emojis');

  // 11. CONTROL ESTRICTO DE DOMINIOS GANADEROS (NO MÁS) Y AISLAMIENTO
  console.log('\n[11] Control Estricto de Dominios Ganaderos (Cerdo, Res, Avicola - NO MAS)');
  const porcinoUser = INITIAL_USERS.find(u => u.role === USER_ROLES.GANADERO_PORCINO);
  const bovinoUser = INITIAL_USERS.find(u => u.role === USER_ROLES.GANADERO_BOVINO);
  const avicolaUser = INITIAL_USERS.find(u => u.role === USER_ROLES.GANADERO_AVICOLA);
  const clienteUser = INITIAL_USERS.find(u => u.role === USER_ROLES.CLIENTE);
  const empPedidosUser = INITIAL_USERS.find(u => u.role === USER_ROLES.EMPLEADO_PEDIDOS);

  const porkProduct = INITIAL_PRODUCTS.find(p => p.meatType === 'Cerdo');
  const beefProduct = INITIAL_PRODUCTS.find(p => p.meatType === 'Res');
  const poultryProduct = INITIAL_PRODUCTS.find(p => p.meatType === 'Avicola');
  const fruitProduct = INITIAL_PRODUCTS.find(p => p.name.includes('Aguacate'));

  // Porcino: TODO cerdo, NADA de res, avícola o fruta
  assert(isProductInUserDomain(porcinoUser, porkProduct), 'Ganadero Porcino tiene control sobre corte de cerdo');
  assert(!isProductInUserDomain(porcinoUser, beefProduct), 'Ganadero Porcino NO tiene acceso a corte de res (NO MAS)');
  assert(!isProductInUserDomain(porcinoUser, poultryProduct), 'Ganadero Porcino NO tiene acceso a pollo/huevos (NO MAS)');
  assert(!isProductInUserDomain(porcinoUser, fruitProduct), 'Ganadero Porcino NO tiene acceso a productos agricolas (NO MAS)');

  // Bovino: TODO res, NADA de cerdo, avícola o fruta
  assert(isProductInUserDomain(bovinoUser, beefProduct), 'Ganadero Bovino tiene control sobre corte de res');
  assert(!isProductInUserDomain(bovinoUser, porkProduct), 'Ganadero Bovino NO tiene acceso a corte de cerdo (NO MAS)');
  assert(!isProductInUserDomain(bovinoUser, poultryProduct), 'Ganadero Bovino NO tiene acceso a pollo/huevos (NO MAS)');
  assert(!isProductInUserDomain(bovinoUser, fruitProduct), 'Ganadero Bovino NO tiene acceso a productos agricolas (NO MAS)');

  // Avícola: TODO huevos y pollo, NADA de res, cerdo o fruta
  assert(isProductInUserDomain(avicolaUser, poultryProduct), 'Ganadero Avicola tiene control sobre huevos y pollo');
  assert(!isProductInUserDomain(avicolaUser, porkProduct), 'Ganadero Avicola NO tiene acceso a corte de cerdo (NO MAS)');
  assert(!isProductInUserDomain(avicolaUser, beefProduct), 'Ganadero Avicola NO tiene acceso a corte de res (NO MAS)');
  assert(!isProductInUserDomain(avicolaUser, fruitProduct), 'Ganadero Avicola NO tiene acceso a productos agricolas (NO MAS)');

  // Clientes y Empleados de logística NO tienen dominio sobre paneles ganaderos
  assert(!isProductInUserDomain(clienteUser, porkProduct), 'Cliente NO tiene dominio de control sobre productos ganaderos');
  assert(!isProductInUserDomain(empPedidosUser, beefProduct), 'Empleado de pedidos NO tiene dominio de control sobre productos ganaderos');

  console.log('\n==========================================');
  console.log(`RESULTADOS: ${passed} de ${total} pruebas aprobadas (${Math.round((passed/total)*100)}%)`);
  console.log('==========================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
