export const TOKEN_KEY = 'pharma_tools_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export async function login(password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return res.json();
}

export async function verifyToken(token) {
  const res = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function fetchCollection(name) {
  const res = await fetch(`/api/${name}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(`GET /api/${name} failed: ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

export async function saveCollection(name, items, baseItems) {
  const res = await fetch(`/api/${name}`, {
    method: 'POST',
    signal: AbortSignal.timeout(15000),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ items, baseItems }),
  });
  if (!res.ok) throw new Error(`POST /api/${name} failed: ${res.status}`);
  return res.json();
}
