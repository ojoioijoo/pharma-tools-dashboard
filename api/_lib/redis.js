const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand(...args) {
  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  return res.json();
}

export async function redisGetJSON(key, fallback) {
  const { result } = await redisCommand('GET', key);
  return result ? JSON.parse(result) : fallback;
}

export async function redisSetJSON(key, value) {
  await redisCommand('SET', key, JSON.stringify(value));
}
