const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand(...args) {
  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    signal: AbortSignal.timeout(10000),
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || `Redis HTTP ${res.status}`);
  return data;
}

export async function redisReadRaw(key) {
  const { result } = await redisCommand('GET', key);
  return result;
}

export async function redisCompareAndSet(key, expected, items) {
  const script = `local current = redis.call('GET', KEYS[1])
    if (current or '') ~= ARGV[1] then return 0 end
    redis.call('SET', KEYS[1], ARGV[2])
    return 1`;
  const { result } = await redisCommand('EVAL', script, 1, key, expected ?? '', JSON.stringify(items));
  return result === 1;
}

export async function redisGetJSON(key, fallback) {
  const { result } = await redisCommand('GET', key);
  return result ? JSON.parse(result) : fallback;
}

export async function redisSetJSON(key, value) {
  await redisCommand('SET', key, JSON.stringify(value));
}
