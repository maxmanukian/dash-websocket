import { v4 as uuid } from 'uuid'

export default class Client {
  constructor (socket) {
    this.socket = socket
    this.socket.id = uuid()
  }

  sendMessage (message) {
    if (this.socket.readyState === 1) {
      this.socket.send(message)
    }
  }
}
