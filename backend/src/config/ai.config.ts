export const aiConfig = {
  provider: process.env.AI_PROVIDER || 'gemini',
  apiKey: process.env.AI_API_KEY || '',
  model: process.env.AI_MODEL || 'gemini-1.5-pro',
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.2'),
};
