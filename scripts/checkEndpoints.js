const BASE_URL = 'https://6aa6bb5ad7765db985078f3b.mockapi.io';
const endpoints = ['estado_orden', 'cliente', 'categoria', 'orden', 'usuario', 'producto', 'information'];

async function check() {
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE_URL}/${ep}`);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      console.log(`Endpoint [/${ep}] - Status: ${res.status}`);
      if (Array.isArray(data)) {
        console.log(`  Count: ${data.length}`);
        if (data.length > 0) {
          console.log(`  Sample keys: ${Object.keys(data[0]).join(', ')}`);
          console.log(`  Sample: ${JSON.stringify(data[0])}`);
        }
      } else {
        console.log(`  Response: ${JSON.stringify(data)}`);
      }
    } catch (e) {
      console.log(`Endpoint [/${ep}] - Fetch error: ${e.message}`);
    }
  }
}

check();
