import { getSub, isEventBusAvailable } from "./events/eventBus"
import { WebSocketServer } from "ws"

export let wss: WebSocketServer

export const initSocket = (server: any) => {
  wss = new WebSocketServer({ server })

  wss.on("connection", (ws) => {
    console.log("🔌 Client Connected")
    ws.send(JSON.stringify({ type: "CONNECTED" }))
  })

  if (!isEventBusAvailable()) {
    console.warn(
      "⚠️  REDIS_URL not set — WebSocket clients will connect but receive no " +
        "generation progress events."
    )
    return
  }

  const sub = getSub()
  sub.subscribe("ASSIGNMENT_EVENTS")

  sub.on("message", (_, message) => {
    const data = JSON.parse(message.toString())
    broadcast(data)
  })
}

export const broadcast = (data: any) => {
  if (!wss) return
  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data))
    }
  })
}