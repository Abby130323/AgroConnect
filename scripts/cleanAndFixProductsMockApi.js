const API_BASE = 'https://6aa6bb5ad7765db985078f3b.mockapi.io';

const PORK_KEYWORDS = ['cerdo', 'bondiola', 'tocino', 'chicharrón', 'chicharron', 'panceta', 'chuleta de cerdo', 'costilla de cerdo'];
const BEEF_KEYWORDS = ['res', 'angus', 'punta de anca', 'lomo fino', 'solomito', 'churrasco', 'costilla de res', 'sobrebarriga', 'carne molida'];
const POULTRY_KEYWORDS = ['huevo', 'pollo', 'pechuga', 'pernil', 'muslo', 'gallina', 'alitas', 'avicola', 'avícola'];
const AGRI_KEYWORDS = [
  'lechuga', 'cebolla', 'pimentón', 'pimenton', 'tomate', 'espinaca', 'zanahoria',
  'papa', 'yuca', 'plátano', 'platano', 'banano', 'aguacate', 'mango', 'mora',
  'lulo', 'maracuyá', 'maracuya', 'uchuva', 'café', 'cafe', 'panela', 'miel',
  'fríjol', 'frijol', 'maíz', 'maiz', 'arveja', 'cilantro', 'albahaca',
  'hierbabuena', 'romero', 'arracacha', 'ñame', 'name', 'francesa'
];

function classify(prod) {
  const name = (prod.name || prod.nombre || '').toLowerCase();
  const meat = (prod.meatType || '').toLowerCase();

  // 1. Is it Poultry?
  if (meat === 'avicola' || POULTRY_KEYWORDS.some(k => name.includes(k))) {
    return 'avicola';
  }

  // 2. Is it Agricultural?
  if (AGRI_KEYWORDS.some(k => name.includes(k))) {
    return 'agricultor';
  }

  // 3. Is it Pork?
  if (meat === 'cerdo' || PORK_KEYWORDS.some(k => name.includes(k))) {
    return 'porcino';
  }

  // 4. Is it Beef?
  if (meat === 'res' || BEEF_KEYWORDS.some(k => name.includes(k))) {
    return 'bovino';
  }

  // Default to agricultor if not meat
  return 'agricultor';
}

async function run() {
  console.log('Fetching products from MockAPI...');
  const res = await fetch(`${API_BASE}/producto`);
  const products = await res.json();
  console.log(`Total products to audit: ${products.length}`);

  let updatedCount = 0;

  for (const prod of products) {
    const roleType = classify(prod);
    let patchData = {};
    let needsPatch = false;

    const currentName = prod.name || prod.nombre || '';
    const currentMeat = prod.meatType || null;
    const currentFarmer = String(prod.farmerId || '');
    const currentCat = String(prod.categoryId || prod.categoria || '');

    if (roleType === 'porcino') {
      // Pork product: strictly pork
      if (currentMeat !== 'Cerdo') { patchData.meatType = 'Cerdo'; needsPatch = true; }
      if (currentFarmer !== '6') { patchData.farmerId = '6'; needsPatch = true; }
      if (currentCat !== '7') { patchData.categoryId = '7'; needsPatch = true; }
      if (!prod.name && prod.nombre) { patchData.name = prod.nombre; needsPatch = true; }
    } else if (roleType === 'bovino') {
      // Beef product: strictly beef
      if (currentMeat !== 'Res') { patchData.meatType = 'Res'; needsPatch = true; }
      if (currentFarmer !== '3') { patchData.farmerId = '3'; needsPatch = true; }
      if (currentCat !== '7') { patchData.categoryId = '7'; needsPatch = true; }
      if (!prod.name && prod.nombre) { patchData.name = prod.nombre; needsPatch = true; }
    } else if (roleType === 'avicola') {
      // Poultry product: strictly poultry
      if (currentMeat !== 'Avicola') { patchData.meatType = 'Avicola'; needsPatch = true; }
      if (currentFarmer !== '4') { patchData.farmerId = '4'; needsPatch = true; }
      if (currentCat !== '8') { patchData.categoryId = '8'; needsPatch = true; }
      if (!prod.name && prod.nombre) { patchData.name = prod.nombre; needsPatch = true; }
    } else {
      // Agricultor product (Fruver, Hortalizas, etc.): NEVER meat
      if (currentMeat !== null) { patchData.meatType = null; needsPatch = true; }
      if (prod.cut !== null && prod.cut !== undefined) { patchData.cut = null; needsPatch = true; }
      if (currentFarmer !== '1') { patchData.farmerId = '1'; needsPatch = true; }
      if (!prod.name && prod.nombre) { patchData.name = prod.nombre; needsPatch = true; }
      // Category check: cannot be category 7 (Carnes) or 8 (Avicola)
      if (currentCat === '7' || currentCat === '8') {
        patchData.categoryId = '2'; // Default to verduras y hortalizas
        needsPatch = true;
      }
    }

    if (needsPatch) {
      console.log(`[PATCH] ID ${prod.id} (${currentName || prod.nombre}) -> role: ${roleType}`, patchData);
      const patchRes = await fetch(`${API_BASE}/producto/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData),
      });
      if (!patchRes.ok) {
        console.error(`Error updating product ${prod.id}: ${patchRes.status}`);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`\nAudit finished! Updated ${updatedCount} products in MockAPI.`);
}

run().catch(console.error);
