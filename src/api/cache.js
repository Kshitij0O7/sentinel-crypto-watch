// Simple in-memory cache with TTL (Time To Live)
class APICache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
  }

  // Set cache with TTL (default: 5 minutes)
  set(key, value, ttlMs = 5 * 60 * 1000) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
  }

  // Get cached value if not expired
  get(key) {
    if (!this.cache.has(key)) return null;
    
    const expiry = this.ttl.get(key);
    if (Date.now() > expiry) {
      this.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  // Delete cache entry
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  // Clear all expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        this.delete(key);
      }
    }
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.ttl.clear();
  }
}

// Create singleton instance
const apiCache = new APICache();

// Cleanup expired entries every minute
setInterval(() => apiCache.cleanup(), 60000);

export default apiCache;
