const BASE_URL = 'https://6aa6bb5ad7765db985078f3b.mockapi.io';

async function migrate() {
  console.log('🌱 1. Verificando / Creando usuario Agricultor en MockAPI (/usuario)...');
  const userRes = await fetch(`${BASE_URL}/usuario`);
  const users = await userRes.json();
  const existingAgr = users.find(u => (u.email || '').toLowerCase() === 'agricultor@agroconnect.com' || u.role === 'agricultor');

  if (!existingAgr) {
    const agrPayload = {
      name: 'Agricultor Don Carlos',
      nombre: 'Agricultor Don Carlos',
      email: 'agricultor@agroconnect.com',
      correo: 'agricultor@agroconnect.com',
      password: 'Agricultor123',
      clave: 'Agricultor123',
      role: 'agricultor',
      active: true,
      estado: true,
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
      title: 'Finca El Mirador - Marinilla',
      farmerId: '1',
      specialty: 'Frutas, Verduras y Hortalizas Campesinas (Fruver)',
      city: 'Marinilla, Antioquia',
      address: 'Vereda La Esmeralda, Finca El Mirador',
      phone: '+57 312 458 9012'
    };
    const createRes = await fetch(`${BASE_URL}/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agrPayload)
    });
    const createdUser = await createRes.json();
    console.log(`  ✓ Creado usuario Agricultor con ID #${createdUser.id} (${createdUser.email})`);
  } else {
    console.log(`  ℹ El usuario Agricultor ya existe con ID #${existingAgr.id}`);
  }

  console.log('\n🌾 2. Moviendo productos de Fruver y Hortalizas al Agricultor (farmerId: "1") en MockAPI...');
  const prodRes = await fetch(`${BASE_URL}/producto`);
  const prods = await prodRes.json();

  let updatedCount = 0;
  for (const p of prods) {
    const catId = String(p.categoria || p.categoryId || '');
    const pName = (p.nombre || p.name || '').toLowerCase();
    
    // Identificar si es producto de fruver, hortalizas, tubérculos, despensa agrícola
    const isFruver = ['3', '4', '5', '6'].includes(catId) ||
      pName.includes('aguacate') ||
      pName.includes('mora') ||
      pName.includes('lulo') ||
      pName.includes('maracuy') ||
      pName.includes('mango') ||
      pName.includes('tomate') ||
      pName.includes('lechuga') ||
      pName.includes('cebolla') ||
      pName.includes('zanahoria') ||
      pName.includes('cilantro') ||
      pName.includes('papa') ||
      pName.includes('yuca') ||
      pName.includes('plátano') ||
      pName.includes('platano') ||
      pName.includes('arracacha') ||
      pName.includes('fríjol') ||
      pName.includes('frijol') ||
      pName.includes('arveja') ||
      pName.includes('albahaca') ||
      pName.includes('café') ||
      pName.includes('cafe') ||
      pName.includes('panela') ||
      pName.includes('miel');

    // No es carne ni pollo
    const isMeat = p.meatType === 'Res' || p.meatType === 'Cerdo' || p.meatType === 'Avicola' ||
      catId === '1' || catId === '2' || catId === '8' ||
      pName.includes('angus') || pName.includes('solomito') || pName.includes('costilla') ||
      pName.includes('bondiola') || pName.includes('panceta') || pName.includes('chuleta') ||
      pName.includes('pollo') || pName.includes('huevo');

    if (isFruver && !isMeat) {
      const needsUpdate = p.farmerId !== '1' || p.meatType || p.cut;
      if (needsUpdate) {
        const updatePayload = {
          ...p,
          farmerId: '1',
          meatType: null,
          cut: null,
          weight: null,
          presentation: p.presentation || p.unit || 'kg',
        };
        const putRes = await fetch(`${BASE_URL}/producto/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        });
        if (putRes.ok) {
          updatedCount++;
          console.log(`  ✓ Producto #${p.id} "${p.name || p.nombre}" asignado a Agricultor (farmerId: "1")`);
        }
      }
    }
  }

  console.log(`\n✨ Migración finalizada: ${updatedCount} productos actualizados en MockAPI.`);
}

migrate();
