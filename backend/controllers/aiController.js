const axios = require('axios');
const Employee = require('../models/Employee');

const MODELS = [
  'deepseek/deepseek-r1-0528:free',
  'deepseek/deepseek-v4-flash:free',
  'mistralai/mistral-7b-instruct:free',
  'qwen/qwen3-8b:free'
];

const getRecommendation = async (req, res) => {
  try {
    const { employeeId, allEmployees } = req.body;
    let prompt = '';

    if (allEmployees) {
      const employees = await Employee.find().sort({ performanceScore: -1 });
      const employeeData = employees.map(e =>
        `Name: ${e.name}, Dept: ${e.department}, Score: ${e.performanceScore}, Experience: ${e.experience} yrs, Skills: ${e.skills.join(', ')}`
      ).join('\n');
      prompt = `You are an HR analytics expert. Respond in English only.\n\nHere are all employees:\n${employeeData}\n\nProvide:\n1. Employee Rankings\n2. Promotion Recommendations\n3. Training Suggestions`;
    } else if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      prompt = `You are an HR analytics expert. Respond in English only.\n\nAnalyze this employee:\nName: ${employee.name}\nDepartment: ${employee.department}\nPerformance Score: ${employee.performanceScore}/100\nExperience: ${employee.experience} years\nSkills: ${employee.skills.join(', ')}\n\nProvide:\n1. Promotion recommendation (Yes/No with reason)\n2. Training suggestions\n3. Overall feedback`;
    } else {
      return res.status(400).json({ message: 'Provide employeeId or allEmployees' });
    }

    let lastError = '';
    for (const model of MODELS) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          { model, messages: [{ role: 'user', content: prompt }] },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:3000',
              'X-Title': 'Employee AI System'
            },
            timeout: 30000
          }
        );
        const recommendation = response.data.choices[0].message.content;
        console.log(`✅ Success with ${model}`);
        return res.json({ recommendation, model });
      } catch (e) {
        lastError = e.response?.data?.error?.message || e.message;
        console.log(`❌ ${model} failed: ${lastError}`);
        continue;
      }
    }

    res.status(500).json({ message: 'All AI models failed: ' + lastError });
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI service error: ' + error.message });
  }
};

module.exports = { getRecommendation };
