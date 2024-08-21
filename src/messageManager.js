export default class MessageManager {
    broadcastMessage(connections, message) {
        connections.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(message));
            }
        });
    }
}