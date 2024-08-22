import zmq from 'zeromq'
import EventEmitter from 'node:events'

export default class ZmqConnection extends EventEmitter {
  constructor () {
    super()
    this.socket = new zmq.Socket('sub')
    this.listen()
  }

  listen () {
    this.socket.connect(process.env.ZMQ_URL)
    this.socket.subscribe('rawtx')
    this.socket.on('message', (topic, message) => {
      this.emit(topic.toString(), message.toString('hex'))
    })
  }
}
