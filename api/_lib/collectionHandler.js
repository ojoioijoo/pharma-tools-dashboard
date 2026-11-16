import { redisGetJSON, redisReadRaw, redisCompareAndSet } from './redis.js';
import { mergeCollection } from '../../shared/mergeCollection.js';
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
        res.setHeader('Cache-Control', 'no-store');
        const items = await redisGetJSON(key, []);
        return res.status(200).json({ items });
      }

      if (req.method === 'POST') {
        const { items, baseItems } = req.body || {};
        if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be an array' });
        // Older open tabs must reload instead of replacing data from other devices.
        if (!Array.isArray(baseItems)) return res.status(409).json({ error: 'Reload required for safe synchronization' });
        for (let attempt = 0; attempt < 10; attempt++) {
          const raw = await redisReadRaw(key);
          const current = raw ? JSON.parse(raw) : [];
          const merged = mergeCollection(baseItems, items, current);
          if (await redisCompareAndSet(key, raw, merged)) {
            return res.status(200).json({ success: true, items: merged });
          }
        }
        return res.status(409).json({ error: 'Concurrent update, retry required' });
      }

      return res.status(405).end();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
}
