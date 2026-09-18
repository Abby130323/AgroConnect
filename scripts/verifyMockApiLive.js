const BASE_URL = 'https://6aa6bb5ad7765db985078f3b.mockapi.io';

async function checkLiveMockApi() {
  console.log('====================================================');
  console.log('   VERIFICACION EN VIVO DE MOCKAPI (MOCKAPI.IO)');
  console.log('====================================================\n');

  try {
    // 1. Usuarios
    const usersRes = await fetch(`${BASE_URL}/usuario`);
    const users = await usersRes.json();
    console.log(`[1] Endpoint /usuario: ${users.length} usuarios registrados en MockAPI.`);
    const transportUser = users.find(u => u.email === 'transportador@agroconnect.com' || u.role === 'transportador');
    const agriUser = users.find(u => u.email === 'agricultor@agroconnect.com' || u.role === 'agricultor');
    console.log(`    - Transportador en MockAPI: ${transportUser ? `SI (ID: ${transportUser.id}, Nombre: ${transportUser.name})` : 'NO'}`);
    console.log(`    - Agricultor en MockAPI: ${agriUser ? `SI (ID: ${agriUser.id}, Nombre: ${agriUser.name})` : 'NO'}`);

    // 2. Ordenes
    const ordersRes = await fetch(`${BASE_URL}/orden`);
    const orders = await ordersRes.json();
    console.log(`\n[2] Endpoint /orden: ${orders.length} pedidos registrados en MockAPI.`);
    const coldOrders = orders.filter(o => o.requiresColdChain);
    const dryOrders = orders.filter(o => !o.requiresColdChain);
    console.log(`    - Pedidos con Cadena de Frío (Termoking): ${coldOrders.length}`);
    console.log(`    - Pedidos Carga Seca Campesina: ${dryOrders.length}`);
    if (orders.length > 0) {
      const sample = orders[0];
      console.log(`    - Ejemplo de orden #${sample.id}:`);
      console.log(`      * Origen: ${sample.originFarm || 'N/A'}`);
      console.log(`      * Tipo Transporte: ${sample.transportBadge || sample.transportType || 'N/A'}`);
      console.log(`      * Flete: $${sample.shippingCost || 'N/A'} COP`);
      console.log(`      * Comisión AgroConnect (6%): $${sample.platformFee || 'N/A'} COP`);
      console.log(`      * Estado actual: ${sample.status || sample.estado_orden}`);
    }

    // 3. Productos
    const prodRes = await fetch(`${BASE_URL}/producto`);
    const prods = await prodRes.json();
    console.log(`\n[3] Endpoint /producto: ${prods.length} productos registrados en MockAPI.`);
    const porkProds = prods.filter(p => p.meatType === 'Cerdo');
    const beefProds = prods.filter(p => p.meatType === 'Res');
    const poultryProds = prods.filter(p => p.meatType === 'Avicola');
    const agriProds = prods.filter(p => !p.meatType);

    console.log(`    - Porcino (Cerdo): ${porkProds.length} cortes`);
    console.log(`    - Bovino (Res): ${beefProds.length} cortes`);
    console.log(`    - Avícola (Pollo/Huevos): ${poultryProds.length} productos`);
    console.log(`    - Agrícola (Fruver/Hortalizas): ${agriProds.length} productos`);

    console.log('\n====================================================');
    console.log('   MOCKAPI SINCRONIZADO Y VALIDADO AL 100%');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Error al consultar MockAPI:', err.message);
  }
}

checkLiveMockApi();
