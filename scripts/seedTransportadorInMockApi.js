const API_BASE = 'https://6aa6bb5ad7765db985078f3b.mockapi.io';

async function run() {
  console.log('=== [1] REGISTRANDO USUARIO TRANSPORTADOR EN MOCKAPI ===');
  const userRes = await fetch(`${API_BASE}/usuario`);
  const users = await userRes.json();
  const existingCarrier = users.find(u => u.email === 'transportador@agroconnect.com' || u.role === 'transportador');

  if (!existingCarrier) {
    const newCarrier = {
      name: 'Transportes AgroExpress',
      email: 'transportador@agroconnect.com',
      password: 'Transportador123',
      role: 'transportador',
      title: 'Operador Logístico Rural • Cadena de Frío y Carga Seca',
      specialty: 'Flota con Termoking Refrigerado (0°C - 4°C) y Furgones Campesinos',
      phone: '+57 315 889 4433',
      vehiclePlate: 'TRK-892 (Isuzu Termoking) / AGR-441 (Furgón Seco)',
      active: true,
      avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
    };

    const createRes = await fetch(`${API_BASE}/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCarrier),
    });

    if (createRes.ok) {
      const created = await createRes.json();
      console.log(`✓ Usuario Transportador registrado con éxito en MockAPI. ID: ${created.id}`);
    } else {
      console.error(`✗ Error registrando Transportador: ${createRes.status}`);
    }
  } else {
    console.log(`✓ Usuario Transportador ya existe en MockAPI con ID: ${existingCarrier.id}`);
  }

  console.log('\n=== [2] AUDITANDO Y ENRIQUECIENDO ÓRDENES CON METADATOS LOGÍSTICOS ===');
  const orderRes = await fetch(`${API_BASE}/orden`);
  const orders = await orderRes.json();
  console.log(`Total órdenes a procesar: ${orders.length}`);

  for (const order of orders) {
    const items = Array.isArray(order.items) ? order.items : Array.isArray(order.detalle) ? order.detalle : [];
    
    // Evaluar si alguna referencia requiere cadena de frío (carnes de res, cerdo, pollo fresco)
    const hasColdChain = items.some(i => {
      const name = (i.name || i.nombre || '').toLowerCase();
      const meat = (i.meatType || '').toLowerCase();
      return (
        meat === 'res' || meat === 'cerdo' || meat === 'avicola' || meat === 'pollo' ||
        name.includes('punta de anca') || name.includes('lomo fino') || name.includes('solomito') ||
        name.includes('costilla') || name.includes('sobrebarriga') || name.includes('molida') ||
        name.includes('bondiola') || name.includes('tocino') || name.includes('chuleta') ||
        name.includes('pechuga') || name.includes('pernil') || name.includes('muslo') ||
        name.includes('pollo')
      );
    });

    // Fincas de origen sugeridas según ítems
    let originFarm = 'Finca El Mirador • Marinilla, Antioquia (Don Carlos Mendoza)';
    if (items.some(i => (i.name || '').toLowerCase().includes('res') || (i.name || '').toLowerCase().includes('angus'))) {
      originFarm = 'Ganadería Los Guayacanes • Santa Rosa de Cabal (Javier Tamayo)';
    } else if (items.some(i => (i.name || '').toLowerCase().includes('cerdo') || (i.name || '').toLowerCase().includes('bondiola'))) {
      originFarm = 'Agroecológica Tierra Fértil • Piedecuesta, Santander (Doña Inés Quintero)';
    } else if (items.some(i => (i.name || '').toLowerCase().includes('pollo') || (i.name || '').toLowerCase().includes('huevo'))) {
      originFarm = 'Parcela Villa Hermosa • Chocontá, Cundinamarca (María Eugenia Beltrán)';
    }

    const subtotal = Number(order.subtotal || order.total || 100000);
    const platformFee = Math.round(subtotal * 0.06); // 6% comisión de intermediación
    const shippingCost = hasColdChain ? 12500 : 8500; // Recargo logístico para frío

    const updatePayload = {
      requiresColdChain: hasColdChain,
      transportType: hasColdChain ? 'Cadena de Frío (0°C a 4°C)' : 'Carga Seca / Carga General',
      transportBadge: hasColdChain ? 'Refrigerado Termoking' : 'Furgón Ventilado',
      originFarm: order.originFarm || originFarm,
      shippingCost: order.shippingCost || shippingCost,
      platformFee: order.platformFee || platformFee,
      carrierName: 'Transportes AgroExpress',
      carrierPhone: '+57 315 889 4433',
      vehiclePlate: hasColdChain ? 'TRK-892 (Termoking)' : 'AGR-441 (Seco)',
    };

    const putRes = await fetch(`${API_BASE}/orden/${order.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });

    if (putRes.ok) {
      console.log(`  ✓ Orden #${order.id} enriquecida: ${updatePayload.transportType} | Flete: $${shippingCost} | Comisión: $${platformFee}`);
    } else {
      console.error(`  ✗ Error en Orden #${order.id}: ${putRes.status}`);
    }
  }

  console.log('\n✨ ¡MockAPI sincronizado exitosamente con el módulo de transporte e intermediación!');
}

run().catch(console.error);
