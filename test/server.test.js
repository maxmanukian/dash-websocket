import { expect } from 'chai'
import WebSocket from 'ws'
import Server from '../src/server.js'

describe('WebSocket Server Test', function () {
  let server
  let testClient
  const receivedMessages = []

  before(function (done) {
    server = new Server()
    server.start()

    const port = process.env.PORT
    const wsServerUrl = `ws://${process.env.BIND_ADDRESS}:${port}`
    testClient = new WebSocket(wsServerUrl)

    testClient.on('open', () => {
      server.zmq.emit('rawtx', '030000000154b384be59cef8b0394f9ce0c11a7a58f67e9e1f1bda3c9b686c755a49cc6d18010000006a47304402202ae6d93c8b3fc41fb2cfbe49d68f7aa012c6325ad48e978b0255d4b3e570f2fa022062b4398fd98e00dd0972e80649e1cf6922d8e1c35af1c23a66ad7ff55a4d41350121033fecb4f84218317e890042d07816751a1c99abe79fd8abf0293e44481c03c027ffffffff0285911100000000001976a914298b538295fcef0648d44b9347514b41ffff347d88ac2a774075000000001976a9143a9055f7321375613422626ecbdc42fe9fb43d6488ac00000000')
    })

    testClient.on('message', (message) => {
      const parsedMessage = JSON.parse(message)
      receivedMessages.push(parsedMessage)

      if (receivedMessages.length === 2) {
        done()
      }
    })

    testClient.on('error', (err) => {
      console.error('WebSocket error:', err)
      done(err)
    })
  })

  after(function (done) {
    testClient.close()
    done()
  })

  it('should receive welcome and transaction messages', function () {
    expect(receivedMessages).to.have.lengthOf(2)

    const [welcomeMessage, txMessage] = receivedMessages
    expect(welcomeMessage).to.have.property('success').that.is.true
    expect(txMessage).to.have.property('hash').that.is.a('string')
  })
})
