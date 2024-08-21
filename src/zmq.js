import zmq from 'zeromq';
import EventEmitter from 'node:events';


export default class ZmqConnection extends EventEmitter{

    constructor() {
        super();
        this.socket  = new zmq.socket('sub')
        this.listen()
    }

    listen(){
        this.socket.connect("tcp://127.0.0.1:28332")
        this.socket.subscribe("rawtx")
        this.socket.on('message', (topic, message) => {
            this.emit(topic.toString(), message.toString('hex') )
        });
    }
}
