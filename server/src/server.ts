import app from './app'
import * as mongoConnection from './db/mongodb/connectMongoDB'
import * as pgConnection from './db/postgres/pgClient'
import * as helperFunctions from './utils/helperFunctions'
import http from "http"
import WebSocket from 'ws'

const PORT = process.env.PORT || 3000
const ARCHITECTURE = process.env.ARCHITECTURE

switch (ARCHITECTURE) {
  case "single-machine":
  case "3-tier":
    mongoConnection.standard()
    pgConnection.standard()
    break;
  case "RDS-ssl":
    mongoConnection.ssl()
    pgConnection.ssl()
    break;
  case "RDS-secret-manager":
    mongoConnection.awsSecretsManager()
    pgConnection.awsSecretsManager()
    break;
  default:
    throw new Error("Invalid ARCHITECTURE env variable value")
}

const server = http.createServer(app)
export const wss = new WebSocket.Server({ server })

wss.on("connection", (ws) => {
  console.log("Client Connected")
  ws.send(JSON.stringify(({ type: "Welcome", message: 'Connected to web socket' })))
})

server.on("upgrade", (req, socket, head) => {
  console.log("Upgrade request headers:", req.headers);

  // Example: specifically check for WebSocket
  if (req.headers["upgrade"]?.toLowerCase() === "websocket") {
    console.log("This is a WebSocket upgrade request.");
  }
});

server.listen(PORT, () => {
  console.log(new Date());
  console.log('Request Bin server started on port', PORT)
})
