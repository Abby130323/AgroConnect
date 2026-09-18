/**
 * Script de siembra para los endpoints que se encontraban en amarillo (con 0 datos):
 * 1. /estado_orden (Catálogo oficial de estados de órdenes)
 * 2. /information (Información institucional, sedes y metadatos de la plataforma)
 * 3. /orden (Órdenes reales vinculadas a usuarios, productos y clientes)
 */

const BASE_URL = 'https://6aa6bb5ad7765db985078f3b.mockapi.io';

const SEED_ESTADO_ORDEN = [
  {
    nombre: "Pendiente de Confirmación",
    name: "Pendiente de Confirmación",
    codigo: "pendiente",
    code: "pendiente",
    descripcion: "Pedido registrado por el comprador a la espera de verificación y disponibilidad en finca.",
    description: "Pedido registrado por el comprador a la espera de verificación y disponibilidad en finca.",
    color: "#f59e0b",
    orden_flujo: 1,
    estado: true,
    activo: true,
    active: true
  },
  {
    nombre: "Confirmado",
    name: "Confirmado",
    codigo: "confirmado",
    code: "confirmado",
    descripcion: "Pago y existencias validados. La orden entra en cola de alistamiento agropecuario.",
    description: "Pago y existencias validados. La orden entra en cola de alistamiento agropecuario.",
    color: "#3b82f6",
    orden_flujo: 2,
    estado: true,
    activo: true,
    active: true
  },
  {
    nombre: "En Preparación en Finca / Acopio",
    name: "En Preparación en Finca / Acopio",
    codigo: "preparando",
    code: "preparando",
    descripcion: "Cosecha fresca y cortes refrigerados siendo empacados bajo estrictas normas de inocuidad.",
    description: "Cosecha fresca y cortes refrigerados siendo empacados bajo estrictas normas de inocuidad.",
    color: "#8b5cf6",
    orden_flujo: 3,
    estado: true,
    activo: true,
    active: true
  },
  {
    nombre: "En Despacho Logístico",
    name: "En Despacho Logístico",
    codigo: "en_camino",
    code: "en_camino",
    descripcion: "La carga refrigerada está en ruta terrestre hacia el domicilio del cliente.",
    description: "La carga refrigerada está en ruta terrestre hacia el domicilio del cliente.",
    color: "#06b6d4",
    orden_flujo: 4,
    estado: true,
    activo: true,
    active: true
  },
  {
    nombre: "Entregado al Destinatario",
    name: "Entregado al Destinatario",
    codigo: "entregado",
    code: "entregado",
    descripcion: "Productos recibidos y conformes por el consumidor final en su destino.",
    description: "Productos recibidos y conformes por el consumidor final en su destino.",
    color: "#10b981",
    orden_flujo: 5,
    estado: true,
    activo: true,
    active: true
  },
  {
    nombre: "Cancelado",
    name: "Cancelado",
    codigo: "cancelado",
    code: "cancelado",
    descripcion: "Pedido anulado por desistimiento del cliente o falta de stock agrícola.",
    description: "Pedido anulado por desistimiento del cliente o falta de stock agrícola.",
    color: "#ef4444",
    orden_flujo: 6,
    estado: false,
    activo: false,
    active: false
  }
];

const SEED_INFORMATION = [
  {
    nombre: "AgroConnect - Sede Central y Plataforma",
    name: "AgroConnect - Sede Central y Plataforma",
    telefono: "+57 (4) 444 3700",
    phone: "+57 (4) 444 3700",
    direccion: "Calle 73 # 73A - 226, Robledo, Medellín",
    address: "Calle 73 # 73A - 226, Robledo, Medellín",
    horario: "Lunes a Viernes: 7:00 AM - 5:00 PM",
    schedule: "Lunes a Viernes: 7:00 AM - 5:00 PM",
    ciudad: "Medellín, Antioquia",
    city: "Medellín, Antioquia",
    correo: "contacto@agroconnect.co",
    email: "contacto@agroconnect.co",
    descripcion: "Sede administrativa y tecnológica de AgroConnect en el Tecnológico de Antioquia. Coordinación académica, soporte técnico y mesa de ayuda.",
    institucion: "Tecnológico de Antioquia (TdeA)",
    docente: "Yan Angarita",
    autores: "Ashley Yulieth Méndez, Samuel Colmenares Quero, Jairo Yeison Sánchez López",
    tipo: "Sede Administrativa",
    estado: true,
    active: true
  },
  {
    nombre: "AgroConnect - Centro de Acopio y Logística Oriente",
    name: "AgroConnect - Centro de Acopio y Logística Oriente",
    telefono: "+57 312 458 9012",
    phone: "+57 312 458 9012",
    direccion: "Km 4 Variante Marinilla - El Santuario, Vereda La Esmeralda",
    address: "Km 4 Variante Marinilla - El Santuario, Vereda La Esmeralda",
    horario: "Lunes a Sábado: 5:00 AM - 4:00 PM",
    schedule: "Lunes a Sábado: 5:00 AM - 4:00 PM",
    ciudad: "Marinilla, Antioquia",
    city: "Marinilla, Antioquia",
    correo: "acopio.oriente@agroconnect.co",
    email: "acopio.oriente@agroconnect.co",
    descripcion: "Nodo regional de recepción de hortalizas, frutas y lácteos del altiplano del Oriente Antioqueño. Control de calidad y cadena de frío.",
    institucion: "Tecnológico de Antioquia (TdeA)",
    docente: "Yan Angarita",
    autores: "Ashley Yulieth Méndez, Samuel Colmenares Quero, Jairo Yeison Sánchez López",
    tipo: "Centro de Acopio Agrícola",
    estado: true,
    active: true
  },
  {
    nombre: "AgroConnect - Punto de Control Ganadero Norte",
    name: "AgroConnect - Punto de Control Ganadero Norte",
    telefono: "+57 314 678 3344",
    phone: "+57 314 678 3344",
    direccion: "Carrera 30 # 28-15, Zona Pecuaria",
    address: "Carrera 30 # 28-15, Zona Pecuaria",
    horario: "Lunes a Sábado: 6:00 AM - 2:00 PM",
    schedule: "Lunes a Sábado: 6:00 AM - 2:00 PM",
    ciudad: "Santa Rosa de Osos, Antioquia",
    city: "Santa Rosa de Osos, Antioquia",
    correo: "ganaderia.norte@agroconnect.co",
    email: "ganaderia.norte@agroconnect.co",
    descripcion: "Centro de fiscalización y trazabilidad bovina, porcina y avícola del Norte Antioqueño con certificación de bienestar animal.",
    institucion: "Tecnológico de Antioquia (TdeA)",
    docente: "Yan Angarita",
    autores: "Ashley Yulieth Méndez, Samuel Colmenares Quero, Jairo Yeison Sánchez López",
    tipo: "Punto Pecuario",
    estado: true,
    active: true
  }
];

const SEED_ORDERS = [
  {
    userId: "2",
    cliente: "María López",
    customerName: "María López",
    correo: "cliente1@agroconnect.com",
    customerEmail: "cliente1@agroconnect.com",
    telefono: "+57 300 234 5678",
    customerPhone: "+57 300 234 5678",
    direccion: "Carrera 43A # 18 Sur - 135, Apto 804",
    shippingAddress: "Carrera 43A # 18 Sur - 135, Apto 804",
    ciudad: "Medellín",
    city: "Medellín",
    metodo_pago: "PSE",
    paymentMethod: "PSE",
    fecha: "2026-09-14T09:15:00.000Z",
    createdAt: "2026-09-14T09:15:00.000Z",
    estado_orden: "entregado",
    status: "entregado",
    subtotal: 165000,
    descuento: 16500,
    discount: 16500,
    total: 148500,
    detalle: [
      { id: "1", name: "Punta de Anca Angus Nacional", quantity: 2, price: 38500, subtotal: 77000 },
      { id: "9", name: "Huevos Campesinos AA", quantity: 2, price: 19000, subtotal: 38000 },
      { id: "13", name: "Aguacate Hass Exportación", quantity: 4, price: 6500, subtotal: 26000 },
      { id: "17", name: "Café Especial de Origen", quantity: 1, price: 24000, subtotal: 24000 }
    ],
    items: [
      { id: "1", name: "Punta de Anca Angus Nacional", quantity: 2, price: 38500, subtotal: 77000 },
      { id: "9", name: "Huevos Campesinos AA", quantity: 2, price: 19000, subtotal: 38000 },
      { id: "13", name: "Aguacate Hass Exportación", quantity: 4, price: 6500, subtotal: 26000 },
      { id: "17", name: "Café Especial de Origen", quantity: 1, price: 24000, subtotal: 24000 }
    ],
    notes: "Dejar en recepción de la torre sur."
  },
  {
    userId: "3",
    cliente: "Juan Pérez",
    customerName: "Juan Pérez",
    correo: "cliente2@agroconnect.com",
    customerEmail: "cliente2@agroconnect.com",
    telefono: "+57 311 890 1234",
    customerPhone: "+57 311 890 1234",
    direccion: "Calle 38 Sur # 41-20, Casa 12",
    shippingAddress: "Calle 38 Sur # 41-20, Casa 12",
    ciudad: "Envigado",
    city: "Envigado",
    metodo_pago: "Contraentrega",
    paymentMethod: "Contraentrega",
    fecha: "2026-09-15T11:45:00.000Z",
    createdAt: "2026-09-15T11:45:00.000Z",
    estado_orden: "entregado",
    status: "entregado",
    subtotal: 98000,
    descuento: 0,
    discount: 0,
    total: 98000,
    detalle: [
      { id: "5", name: "Costilla BBQ de Cerdo", quantity: 2, price: 32000, subtotal: 64000 },
      { id: "14", name: "Papa Criolla Seleccionada", quantity: 4, price: 4500, subtotal: 18000 },
      { id: "18", name: "Panela Pulverizada Artesanal", quantity: 2, price: 8000, subtotal: 16000 }
    ],
    items: [
      { id: "5", name: "Costilla BBQ de Cerdo", quantity: 2, price: 32000, subtotal: 64000 },
      { id: "14", name: "Papa Criolla Seleccionada", quantity: 4, price: 4500, subtotal: 18000 },
      { id: "18", name: "Panela Pulverizada Artesanal", quantity: 2, price: 8000, subtotal: 16000 }
    ],
    notes: "Timbrar en el portón principal."
  },
  {
    userId: "4",
    cliente: "Ana Rodríguez",
    customerName: "Ana Rodríguez",
    correo: "cliente3@agroconnect.com",
    customerEmail: "cliente3@agroconnect.com",
    telefono: "+57 320 456 7890",
    customerPhone: "+57 320 456 7890",
    direccion: "Carrera 70 # 32B - 45",
    shippingAddress: "Carrera 70 # 32B - 45",
    ciudad: "Medellín",
    city: "Medellín",
    metodo_pago: "Tarjeta de Crédito",
    paymentMethod: "Tarjeta de Crédito",
    fecha: "2026-09-16T14:20:00.000Z",
    createdAt: "2026-09-16T14:20:00.000Z",
    estado_orden: "en_camino",
    status: "en_camino",
    subtotal: 125000,
    descuento: 12500,
    discount: 12500,
    total: 112500,
    detalle: [
      { id: "2", name: "Lomo Fino de Res (Solomito)", quantity: 2, price: 46000, subtotal: 92000 },
      { id: "10", name: "Pechuga Campesina Fresca", quantity: 1, price: 18000, subtotal: 18000 },
      { id: "15", name: "Tomate Chonto de Invernadero", quantity: 3, price: 5000, subtotal: 15000 }
    ],
    items: [
      { id: "2", name: "Lomo Fino de Res (Solomito)", quantity: 2, price: 46000, subtotal: 92000 },
      { id: "10", name: "Pechuga Campesina Fresca", quantity: 1, price: 18000, subtotal: 18000 },
      { id: "15", name: "Tomate Chonto de Invernadero", quantity: 3, price: 5000, subtotal: 15000 }
    ],
    notes: "Transporte en cadena de frío indispensable."
  },
  {
    userId: "1",
    cliente: "Carlos Gómez",
    customerName: "Carlos Gómez",
    correo: "admin@agroconnect.com",
    customerEmail: "admin@agroconnect.com",
    telefono: "+57 301 555 0100",
    customerPhone: "+57 301 555 0100",
    direccion: "Transversal 39B # 72 - 12",
    shippingAddress: "Transversal 39B # 72 - 12",
    ciudad: "Medellín",
    city: "Medellín",
    metodo_pago: "Transferencia Bancolombia",
    paymentMethod: "Transferencia Bancolombia",
    fecha: "2026-09-17T08:30:00.000Z",
    createdAt: "2026-09-17T08:30:00.000Z",
    estado_orden: "en_camino",
    status: "en_camino",
    subtotal: 240000,
    descuento: 36000,
    discount: 36000,
    total: 204000,
    detalle: [
      { id: "6", name: "Lomo de Cerdo Fresco", quantity: 3, price: 26000, subtotal: 78000 },
      { id: "1", name: "Punta de Anca Angus Nacional", quantity: 2, price: 38500, subtotal: 77000 },
      { id: "11", name: "Pollo Campesino Entero", quantity: 2, price: 32000, subtotal: 64000 },
      { id: "20", name: "Miel de Abejas de Bosque", quantity: 1, price: 21000, subtotal: 21000 }
    ],
    items: [
      { id: "6", name: "Lomo de Cerdo Fresco", quantity: 3, price: 26000, subtotal: 78000 },
      { id: "1", name: "Punta de Anca Angus Nacional", quantity: 2, price: 38500, subtotal: 77000 },
      { id: "11", name: "Pollo Campesino Entero", quantity: 2, price: 32000, subtotal: 64000 },
      { id: "20", name: "Miel de Abejas de Bosque", quantity: 1, price: 21000, subtotal: 21000 }
    ],
    notes: "Despacho institucional para degustación corporativa."
  },
  {
    userId: "2",
    cliente: "María López",
    customerName: "María López",
    correo: "cliente1@agroconnect.com",
    customerEmail: "cliente1@agroconnect.com",
    telefono: "+57 300 234 5678",
    customerPhone: "+57 300 234 5678",
    direccion: "Carrera 43A # 18 Sur - 135, Apto 804",
    shippingAddress: "Carrera 43A # 18 Sur - 135, Apto 804",
    ciudad: "Medellín",
    city: "Medellín",
    metodo_pago: "PSE",
    paymentMethod: "PSE",
    fecha: "2026-09-17T16:10:00.000Z",
    createdAt: "2026-09-17T16:10:00.000Z",
    estado_orden: "preparando",
    status: "preparando",
    subtotal: 72000,
    descuento: 0,
    discount: 0,
    total: 72000,
    detalle: [
      { id: "7", name: "Panceta de Cerdo Seleccionada", quantity: 2, price: 22000, subtotal: 44000 },
      { id: "16", name: "Cebolla de Rama Orgánica", quantity: 4, price: 3500, subtotal: 14000 },
      { id: "19", name: "Queso Campesino Tradicional", quantity: 1, price: 14000, subtotal: 14000 }
    ],
    items: [
      { id: "7", name: "Panceta de Cerdo Seleccionada", quantity: 2, price: 22000, subtotal: 44000 },
      { id: "16", name: "Cebolla de Rama Orgánica", quantity: 4, price: 3500, subtotal: 14000 },
      { id: "19", name: "Queso Campesino Tradicional", quantity: 1, price: 14000, subtotal: 14000 }
    ],
    notes: "Preparar cortes con fecha de vencimiento extendida."
  },
  {
    userId: "3",
    cliente: "Juan Pérez",
    customerName: "Juan Pérez",
    correo: "cliente2@agroconnect.com",
    customerEmail: "cliente2@agroconnect.com",
    telefono: "+57 311 890 1234",
    customerPhone: "+57 311 890 1234",
    direccion: "Calle 38 Sur # 41-20, Casa 12",
    shippingAddress: "Calle 38 Sur # 41-20, Casa 12",
    ciudad: "Envigado",
    city: "Envigado",
    metodo_pago: "PSE",
    paymentMethod: "PSE",
    fecha: "2026-09-18T10:00:00.000Z",
    createdAt: "2026-09-18T10:00:00.000Z",
    estado_orden: "confirmado",
    status: "confirmado",
    subtotal: 185000,
    descuento: 18500,
    discount: 18500,
    total: 166500,
    detalle: [
      { id: "3", name: "Costilla de Res Especial para Asar", quantity: 3, price: 34000, subtotal: 102000 },
      { id: "8", name: "Bondiola de Cerdo en Medallones", quantity: 2, price: 28000, subtotal: 56000 },
      { id: "12", name: "Pernil de Pollo Campesino", quantity: 2, price: 13500, subtotal: 27000 }
    ],
    items: [
      { id: "3", name: "Costilla de Res Especial para Asar", quantity: 3, price: 34000, subtotal: 102000 },
      { id: "8", name: "Bondiola de Cerdo en Medallones", quantity: 2, price: 28000, subtotal: 56000 },
      { id: "12", name: "Pernil de Pollo Campesino", quantity: 2, price: 13500, subtotal: 27000 }
    ],
    notes: "Asado familiar programado para el fin de semana."
  },
  {
    userId: "4",
    cliente: "Ana Rodríguez",
    customerName: "Ana Rodríguez",
    correo: "cliente3@agroconnect.com",
    customerEmail: "cliente3@agroconnect.com",
    telefono: "+57 320 456 7890",
    customerPhone: "+57 320 456 7890",
    direccion: "Carrera 70 # 32B - 45",
    shippingAddress: "Carrera 70 # 32B - 45",
    ciudad: "Medellín",
    city: "Medellín",
    metodo_pago: "Contraentrega",
    paymentMethod: "Contraentrega",
    fecha: "2026-09-18T14:15:00.000Z",
    createdAt: "2026-09-18T14:15:00.000Z",
    estado_orden: "pendiente",
    status: "pendiente",
    subtotal: 54000,
    descuento: 0,
    discount: 0,
    total: 54000,
    detalle: [
      { id: "13", name: "Aguacate Hass Exportación", quantity: 4, price: 6500, subtotal: 26000 },
      { id: "17", name: "Café Especial de Origen", quantity: 1, price: 24000, subtotal: 24000 },
      { id: "16", name: "Cebolla de Rama Orgánica", quantity: 1, price: 4000, subtotal: 4000 }
    ],
    items: [
      { id: "13", name: "Aguacate Hass Exportación", quantity: 4, price: 6500, subtotal: 26000 },
      { id: "17", name: "Café Especial de Origen", quantity: 1, price: 24000, subtotal: 24000 },
      { id: "16", name: "Cebolla de Rama Orgánica", quantity: 1, price: 4000, subtotal: 4000 }
    ],
    notes: "Confirmar por WhatsApp antes de despachar."
  },
  {
    userId: null,
    cliente: "Restaurante La Tradición Campesina",
    customerName: "Restaurante La Tradición Campesina",
    correo: "compras@latradicioncampesina.com",
    customerEmail: "compras@latradicioncampesina.com",
    telefono: "+57 310 998 7766",
    customerPhone: "+57 310 998 7766",
    direccion: "Parque Principal de Sabaneta # 14-22",
    shippingAddress: "Parque Principal de Sabaneta # 14-22",
    ciudad: "Sabaneta",
    city: "Sabaneta",
    metodo_pago: "PSE",
    paymentMethod: "PSE",
    fecha: "2026-09-13T12:00:00.000Z",
    createdAt: "2026-09-13T12:00:00.000Z",
    estado_orden: "cancelado",
    status: "cancelado",
    subtotal: 310000,
    descuento: 62000,
    discount: 62000,
    total: 248000,
    detalle: [
      { id: "1", name: "Punta de Anca Angus Nacional", quantity: 4, price: 38500, subtotal: 154000 },
      { id: "2", name: "Lomo Fino de Res (Solomito)", quantity: 2, price: 46000, subtotal: 92000 },
      { id: "5", name: "Costilla BBQ de Cerdo", quantity: 2, price: 32000, subtotal: 64000 }
    ],
    items: [
      { id: "1", name: "Punta de Anca Angus Nacional", quantity: 4, price: 38500, subtotal: 154000 },
      { id: "2", name: "Lomo Fino de Res (Solomito)", quantity: 2, price: 46000, subtotal: 92000 },
      { id: "5", name: "Costilla BBQ de Cerdo", quantity: 2, price: 32000, subtotal: 64000 }
    ],
    notes: "Cancelado por cambio de menú en el restaurante."
  }
];

async function seedEndpoint(endpoint, dataList, nameKey = 'nombre') {
  console.log(`\n🌱 Sembrando endpoint [/${endpoint}]...`);
  
  // 1. Consultar registros existentes
  let existing = [];
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    if (res.ok) {
      existing = await res.json();
    }
  } catch (e) {
    console.error(`  ✗ Error al consultar [/${endpoint}]:`, e.message);
  }

  if (Array.isArray(existing) && existing.length > 0) {
    console.log(`  ℹ Ya existen ${existing.length} registros en [/${endpoint}]. No se sobreescribirá.`);
    return existing.length;
  }

  // 2. Insertar registros
  let createdCount = 0;
  for (const item of dataList) {
    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const created = await res.json();
        createdCount++;
        const label = created[nameKey] || created.name || created.cliente || created.codigo || created.id;
        console.log(`  ✓ Creado registro #${created.id} en /${endpoint}: "${label}"`);
      } else {
        console.error(`  ✗ Error HTTP ${res.status} al crear en /${endpoint}:`, await res.text());
      }
    } catch (e) {
      console.error(`  ✗ Excepción al crear en /${endpoint}:`, e.message);
    }
  }

  return createdCount;
}

async function run() {
  console.log('======================================================');
  console.log('🌾 POBLANDO ENDPOINTS FALTANTES EN MOCKAPI (AgroConnect)');
  console.log('URL Base:', BASE_URL);
  console.log('======================================================');

  const countEstados = await seedEndpoint('estado_orden', SEED_ESTADO_ORDEN, 'nombre');
  const countInfo = await seedEndpoint('information', SEED_INFORMATION, 'nombre');
  const countOrdenes = await seedEndpoint('orden', SEED_ORDERS, 'cliente');

  console.log('\n======================================================');
  console.log('🎉 RESUMEN DE SIEMBRA COMPLETADA:');
  console.log(`  • /estado_orden : ${countEstados} registros sembrados`);
  console.log(`  • /information  : ${countInfo} registros sembrados`);
  console.log(`  • /orden        : ${countOrdenes} registros sembrados`);
  console.log('======================================================\n');
}

run();
