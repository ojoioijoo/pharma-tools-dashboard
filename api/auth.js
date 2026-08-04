import { makeToken } from './_lib/auth.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body || {};
  const correct = process.env.DASHBOARD_PASSWORD;

  if (!correct) return res.status(500).json({ error: 'DASHBOARD_PASSWORD not configured' });
  if (!password || password !== correct) {
    return res.status(401).json({ error: 'Λάθος password' });
  }

  return res.status(200).json({ token: makeToken(correct) });
}
