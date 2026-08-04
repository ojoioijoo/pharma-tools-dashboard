import crypto from 'crypto';

const SALT = 'pharma-tools-dashboard-v1';

export function makeToken(password) {
  return crypto.createHmac('sha256', password).update(SALT).digest('hex');
}

export function isValidToken(token) {
  const correct = process.env.DASHBOARD_PASSWORD;
  if (!correct || !token) return false;
  return token === makeToken(correct);
}
