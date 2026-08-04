import { redisGetJSON, redisSetJSON } from './redis.js';
import { isValidToken } from './auth.js';

export function createCollectionHandler(key) {
  return async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!isValidToken(token)) return res.status(401).json({ error: 'Unauthorized' });

    try {
      if (req.method === 'GET') {
        const items = await redisGetJSON(key, []);
        return res.status(200).json({ items });
      }

      if (req.method === 'POST') {
        const { items } = req.body || {};
        if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be an array' });
        await redisSetJSON(key, items);
        return res.status(200).json({ success: true });
      }

      return res.status(405).end();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
}
