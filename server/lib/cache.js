const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_TTL = 300; // 5 minutes

/**
 * Get cached data by key
 */
async function getCache(key) {
  try {
    const data = await redis.get(key);
    return data || null;
  } catch (err) {
    console.warn('Redis GET error:', err.message);
    return null;
  }
}

/**
 * Set cache with TTL
 */
async function setCache(key, data, ttl = CACHE_TTL) {
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttl });
  } catch (err) {
    console.warn('Redis SET error:', err.message);
  }
}

/**
 * Delete cache by key or pattern
 */
async function deleteCache(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.warn('Redis DEL error:', err.message);
  }
}

/**
 * Delete all cache keys matching a pattern (e.g., user-specific)
 */
async function deleteCacheByPrefix(prefix) {
  try {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redis.del(key)));
    }
  } catch (err) {
    console.warn('Redis prefix DEL error:', err.message);
  }
}

module.exports = { redis, getCache, setCache, deleteCache, deleteCacheByPrefix };
