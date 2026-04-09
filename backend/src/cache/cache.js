let redisClientPromise = null;
let redisWarningShown = false;

function warnRedisFallback(message, error) {
  if (redisWarningShown) {
    return;
  }

  redisWarningShown = true;

  const errorMessage = error instanceof Error ? error.message : "";
  // eslint-disable-next-line no-console
  console.warn(`${message}${errorMessage ? ` (${errorMessage})` : ""}`);
}

async function getRedisClient() {
  const redisUrl = process.env.REDIS_URL?.trim();

  if (!redisUrl) {
    return null;
  }

  if (!redisClientPromise) {
    redisClientPromise = import("redis")
      .then(async ({ createClient }) => {
        const client = createClient({
          url: redisUrl,
          socket: {
            reconnectStrategy(retries) {
              return Math.min(retries * 50, 1_000);
            },
          },
        });

        client.on("error", (error) => {
          warnRedisFallback("Redis indisponivel, usando cache em memoria.", error);
        });

        await client.connect();
        return client;
      })
      .catch((error) => {
        warnRedisFallback("Falha ao conectar no Redis, usando cache em memoria.", error);
        redisClientPromise = null;
        return null;
      });
  }

  return redisClientPromise;
}

export class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key, value, ttlMs) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  has(key) {
    return this.get(key) !== null;
  }
}

export class RedisCache {
  constructor(options = {}) {
    this.prefix = options.prefix || process.env.REDIS_KEY_PREFIX?.trim() || "vagas-full";
    this.memoryFallback = new MemoryCache();
  }

  buildKey(key) {
    return `${this.prefix}:${key}`;
  }

  async get(key) {
    const client = await getRedisClient();

    if (!client) {
      return this.memoryFallback.get(key);
    }

    try {
      const raw = await client.get(this.buildKey(key));
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      warnRedisFallback("Erro ao ler do Redis, usando cache em memoria.", error);
      return this.memoryFallback.get(key);
    }
  }

  async set(key, value, ttlMs) {
    this.memoryFallback.set(key, value, ttlMs);

    const client = await getRedisClient();
    if (!client) {
      return;
    }

    try {
      await client.set(this.buildKey(key), JSON.stringify(value), {
        PX: Math.max(1, Number(ttlMs) || 1),
      });
    } catch (error) {
      warnRedisFallback("Erro ao salvar no Redis, usando cache em memoria.", error);
    }
  }

  async delete(key) {
    this.memoryFallback.delete(key);

    const client = await getRedisClient();
    if (!client) {
      return;
    }

    try {
      await client.del(this.buildKey(key));
    } catch (error) {
      warnRedisFallback("Erro ao remover chave do Redis.", error);
    }
  }

  async clear() {
    this.memoryFallback.clear();

    const client = await getRedisClient();
    if (!client) {
      return;
    }

    try {
      const keys = [];
      for await (const key of client.scanIterator({ MATCH: `${this.prefix}:*` })) {
        keys.push(key);
      }

      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      warnRedisFallback("Erro ao limpar o Redis.", error);
    }
  }

  async has(key) {
    return (await this.get(key)) !== null;
  }
}

export const cache = process.env.REDIS_URL?.trim() ? new RedisCache() : new MemoryCache();
