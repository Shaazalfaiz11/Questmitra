import "dotenv/config"
import { Queue } from "bullmq"
import { getRedisConnection } from "../config/redis"

let _queue: Queue | null = null

/** Built on first enqueue so a missing REDIS_URL fails that request, not server startup. */
export const getGenerationQueue = () => {
  if (!_queue) {
    _queue = new Queue("assignment-generation", {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 4,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail:     50,
      },
    })
  }
  return _queue
}