
const fetch = require('node-fetch'); // eslint-disable-line @typescript-eslint/no-require-imports

const API_URL = 'http://localhost:3000/api/comenzi/anuleaza-neconfirmate';

const ruleazaAnulare = async () => {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    console.log(`[${new Date().toISOString()}] ✅ Comenzi anulate:`, json.comenzi);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Eroare la fetch:`, err.message || err);
  }
};

ruleazaAnulare();
setInterval(ruleazaAnulare, 5 * 60 * 1000);
