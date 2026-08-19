import "dotenv/config";
import { Queue } from "bullmq";
import { getRedisConnection } from "../config/redis";

let _queue: Queue | null = null;

/** Built on first enqueue so a missing REDIS_URL fails that request, not server startup. */
export const getPdfQueue = () => {
  if (!_queue) {
    _queue = new Queue("pdf-processing", {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });
  }
  return _queue;
};
