let _cached: any = null

export const getRedisConnection = () => {
  if (!_cached) {
    const raw = process.env.REDIS_URL
    if (!raw) {
      throw new Error(
        "REDIS_URL is not set. Background jobs (assignment generation, PDF processing) " +
          "need Redis. Add REDIS_URL to vedaai-backend/.env and restart."
      )
    }

    const redisUrl = new URL(raw)
    _cached = {
      host: redisUrl.hostname,
      port: Number(redisUrl.port) || 6379,
      password: redisUrl.password,
      tls: redisUrl.protocol === "rediss:" ? {} : undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      family: 0,
    }
  }
  return _cached
}
