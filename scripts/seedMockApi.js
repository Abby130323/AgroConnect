import { INITIAL_CATEGORIES, INITIAL_FARMERS, INITIAL_PRODUCTS } from '../src/utils/seedData.js';

const BASE_URL = 'https://6aa6bb5ad7765db985078f3b.mockapi.io';

async function seed() {
  console.log('🌱 Iniciando siembra completa en MockAPI:', BASE_URL);

  // 1. Categorías (/categoria)
  console.log('\n📦 Verificando y sembrando categorías en /categoria...');
  const catRes = await fetch(`${BASE_URL}/categoria`).catch(() => null);
  const existingCats = catRes && catRes.ok ? await catRes.json() : [];

  if (existingCats.length === 0) {
    for (const cat of INITIAL_CATEGORIES) {
      try {
        const payload = {
          nombre: cat.name,
          name: cat.name,
          descripcion: cat.description,
          description: cat.description,
          iconKey: cat.iconKey,
          estado: true,
        };
        const res = await fetch(`${BASE_URL}/categoria`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log(`  ✓ Creada categoría: "${data.nombre || data.name}" (ID: ${data.id})`);
      } catch (e) {
        console.error(`  ✗ Error en /categoria "${cat.name}":`, e.message);
      }
    }
  } else {
    console.log(`  ℹ Ya existen ${existingCats.length} categorías en /categoria.`);
  }

  // 2. Agricultores (/cliente)
  console.log('\n👨‍🌾 Verificando y sembrando agricultores en /cliente...');
  const farmRes = await fetch(`${BASE_URL}/cliente`).catch(() => null);
  const existingFarmers = farmRes && farmRes.ok ? await farmRes.json() : [];

  if (existingFarmers.length === 0) {
    for (const farmer of INITIAL_FARMERS) {
      try {
        const payload = {
          nombre: farmer.name,
          name: farmer.name,
          apellido: farmer.farmName,
          farmName: farmer.farmName,
          direccion: farmer.location,
          location: farmer.location,
          telefono: farmer.phone,
          phone: farmer.phone,
          correo: farmer.email,
          email: farmer.email,
          avatar: farmer.avatar,
          estado: true,
        };
        const res = await fetch(`${BASE_URL}/cliente`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log(`  ✓ Creado agricultor: "${data.nombre || data.name}" (ID: ${data.id})`);
      } catch (e) {
        console.error(`  ✗ Error en /cliente "${farmer.name}":`, e.message);
      }
    }
  } else {
    console.log(`  ℹ Ya existen ${existingFarmers.length} agricultores en /cliente.`);
  }

  // 3. Productos (/producto)
  console.log('\n🌾 Verificando y sembrando productos en /producto...');
  const prodRes = await fetch(`${BASE_URL}/producto`).catch(() => null);
  const existingProducts = prodRes && prodRes.ok ? await prodRes.json() : [];

  if (existingProducts.length < INITIAL_PRODUCTS.length) {
    const existingNames = new Set(existingProducts.map(p => (p.nombre || p.name || '').toLowerCase()));
    for (const prod of INITIAL_PRODUCTS) {
      if (existingNames.has(prod.name.toLowerCase())) continue;

      try {
        const payload = {
          nombre: prod.name,
          name: prod.name,
          descripcion: prod.description,
          description: prod.description,
          precio: prod.price,
          price: prod.price,
          stock: prod.stock,
          unit: prod.unit,
          imagen: prod.image,
          image: prod.image,
          categoria: prod.categoryId,
          categoryId: prod.categoryId,
          farmerId: prod.farmerId,
          estado: prod.stock > 0,
          createdAt: prod.createdAt,
        };
        const res = await fetch(`${BASE_URL}/producto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log(`  ✓ Creado producto: "${data.nombre || data.name}" (ID: ${data.id})`);
      } catch (e) {
        console.error(`  ✗ Error en /producto "${prod.name}":`, e.message);
      }
    }
  } else {
    console.log(`  ℹ Ya existen ${existingProducts.length} productos en /producto.`);
  }

  console.log('\n✨ ¡Proceso de siembra en MockAPI finalizado con éxito!');
}

seed();
