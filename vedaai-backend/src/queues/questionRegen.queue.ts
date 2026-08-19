import { Queue } from "bullmq"
import { getRedisConnection } from "../config/redis"

let _queue: Queue | null = null

/** Built on first enqueue so a missing REDIS_URL fails that request, not server startup. */
export const getQuestionRegenQueue = () => {
  if (!_queue) {
    _queue = new Queue("question-regeneration", {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
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
