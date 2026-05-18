require('dotenv').config();
const axios = require('axios');

axios.get('https://openrouter.ai/api/v1/models', {
  headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
}).then(res => {
  const freeModels = res.data.data.filter(m => m.id.includes(':free'));
  freeModels.forEach(m => console.log(m.id));
}).catch(e => console.log('Error:', e.message));
