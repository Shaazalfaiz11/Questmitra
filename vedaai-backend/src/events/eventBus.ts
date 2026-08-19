import Redis from "ioredis"
import { getRedisConnection } from "../config/redis"

let _pub: Redis | null = null
let _sub: Redis | null = null

/** Connections are opened on first use so a missing REDIS_URL does not crash startup. */
export const getPub = () => (_pub ??= new Redis(getRedisConnection()))
export const getSub = () => (_sub ??= new Redis(getRedisConnection()))

/** Lets the socket layer degrade to plain WebSockets instead of throwing. */
export const isEventBusAvailable = () => Boolean(process.env.REDIS_URL)
