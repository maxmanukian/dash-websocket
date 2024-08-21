import {WebSocketServer} from 'ws';
import { v4 as uuid } from 'uuid';
import ZmqConnection from "./zmq.js";
import {decodeRawTransaction} from "./helper.js";
import MessageManager from "./messageManager.js";

export default class Server {
    constructor() {
        this.connections = []
        this.transactions = []
        this.zmq = new ZmqConnection()
        this.zmq.on('rawtx', (data) => {
            this.transactions.push(data);
        });
        this.messageManager = new MessageManager()
    }

    async start() {
        const socket =  new WebSocketServer({ port: 8000 });

        socket.on('connection', (socket) => {
            socket.on('message', (message) => {
                console.log(`Received message: ${message}`);
            });
            socket.id = uuid()
            this.connections.push(socket)
            socket.send('Welcome to the Dash WebSocket server!');
        });

        console.log('WebSocket server is running on ws://localhost:8000');
        setInterval(() => this.handleRawTransactions(), 1000)
    }

    async handleRawTransactions() {
        if (this.transactions.length) {
            const decodedTransaction = await decodeRawTransaction(this.transactions.pop())
            this.messageManager.broadcastMessage(this.connections, decodedTransaction);
        }
    }
};



