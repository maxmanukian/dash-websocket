import 'dotenv/config'
import { WebSocketServer } from 'ws'
import ZmqConnection from './zmq.js'
import Client from './client.js'
import Dashcore from '@dashevo/dashcore-lib'

export default class Server {
  #clients = []

  constructor () {
    this.zmq = new ZmqConnection()
    this.zmq.on('rawtx', (hex) => this.handleRawTx(hex))
  }

  async start () {
    const host = 'localhost'
    const port =  8787
    this.wss = new WebSocketServer({
      port,
      host
    })

    this.wss.on('connection', (socket) => {
      const client = new Client(socket)
      this.#clients.push(client)
      client.sendMessage(JSON.stringify({
        success: true,
        message: 'You are successfully connected to the Dash WebSocket server!'
      }))
    })

    console.log(`WebSocket server is running on ws://${host}:${port}`)
  }

  handleRawTx (hex) {
    const transaction = new Dashcore.Transaction(hex).toJSON()
    this.#clients.forEach(client => client.sendMessage(JSON.stringify(transaction)))
  }
}
