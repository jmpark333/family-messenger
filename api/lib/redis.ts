// Upstash Redis client for Vercel Functions
const { Redis } = require('@upstash/redis');

let redis = null;

function getRedis() {
  if (!redis) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error('[Redis] Missing environment variables');
      return null;
    }

    redis = new Redis({
      url,
      token,
    });

    console.log('[Redis] Client initialized');
  }

  return redis;
}

module.exports = { getRedis };
