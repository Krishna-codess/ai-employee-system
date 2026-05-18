require('dotenv').config();
const axios = require('axios');

const models = [
  'deepseek/deepseek-v4-flash:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'openai/gpt-oss-20b:free',
  'qwen/qwen3-coder:free'
];

const test = async () => {
  for (const model of models) {
    try {
      console.log('Trying:', model);
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        { model, messages: [{ role: 'user', content: 'Say hello.' }] },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Employee AI System'
          }
        }
      );
      console.log('✅ WORKS:', model);
      console.log('Response:', response.data.choices[0].message.content);
      break;
    } catch (e) {
      console.log('❌ Failed:', e.response?.data?.error?.message);
    }
  }
};

test();
