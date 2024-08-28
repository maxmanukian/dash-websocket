# DASH WEBSOCKET

**Dash WebSocket** is a real-time WebSocket server designed to interact with the Dash blockchain. It provides a live connection to the Dash network, allowing users to receive real-time updates on blockchain events such as new transactions and blocks.

## Table of Contents

- [Usage](#usage)
- [Development & Tests](#development--tests)
    - [Dash Node Configuration](#dash-node-configuration)
    - [Run Locally](#run-locally)
    - [Lint & Tests](#lint-and-tests)
- [License](#license)

## Usage

```bash
npm install ws dotenv
```

```javascript
require('dotenv').config();
const WebSocket = require('ws');

const ws = new WebSocket(process.env.SOCKET_URL);

ws.on('open', () => {
  console.log('Connected to Dash WebSocket server');
});
```

After connecting to the WebSocket server, you will receive a message confirming that you have successfully connected to the server.

## Examples

A transaction has the following format:

```json
{
  "hash": "d0e26b8f982168b06434cbb8c1374151829d05241416557ccfe7c56c8f12bf05",
  "version": 3,
  "inputs": [
    {
      "prevTxId": "0000000000000000000000000000000000000000000000000000000000000000",
      "outputIndex": 4294967295,
      "sequenceNumber": 4294967295,
      "script": "0336aa100101"
    }
  ],
  "outputs": [
    {
      "satoshis": 69036433,
      "script": "76a914c69a0bda7daaae481be8def95e5f347a1d00a4b488ac"
    },
    {
      "satoshis": 77665672,
      "script": "6a"
    },
    {
      "satoshis": 129443627,
      "script": "76a914c69a0bda7daaae481be8def95e5f347a1d00a4b488ac"
    }
  ],
  "nLockTime": 0,
  "type": 5,
  "extraPayload": "030036aa1000291de6aee6e6026c3496c1bb3b58e42ac03d3284a10254fdc6839b37e4f1c984e7faa2e307c368ed9790b7cdbfd6cb7901f0164e397180dc58e04ff2e37e320c008052165874d562d36f8567ff0578d847f69dce85fb47bf01bd1ffa45ac7f77730aa8bc8335d953253043d001260c683b0c042d4fd9d0785188283fb5601ea4c608c60fa2d21f484b0420049d3bc6bb01f51c1d91df2703f39e5058a2e31d2bcc56382dcf27020000"
}
```

To parse the transaction and extract the "from" and "to" addresses, you need to install `@dashevo/dashcore-lib`:

```bash
npm install @dashevo/dashcore-lib
```

```javascript
const Dashcore = require('@dashevo/dashcore-lib');

socket.on('message', (message) => {
  const event = JSON.parse(message)

  if (event.success) {
    return // Skip processing for the welcome message
  }

  const transaction = new Dashcore.Transaction(event)
  const fromAddresses = transaction.inputs.map(input =>
    input.script?.toAddress(Dashcore.Networks.testnet)?.toString() || 'Unknown Address'
  )

  const toAddresses = transaction.outputs.map(output => ({
    address: output.script?.toAddress(Dashcore.Networks.testnet)?.toString() || 'Unknown Address',
    valueSat: output.satoshis
  }))

  console.log(`
       From Address: ${fromAddresses}
       To Address: ${toAddresses}
  `)
})
```

## Development & Tests

### Dash Node Configuration

To install and run the server locally, you need to configure a Dash node with ZeroMQ.

For more information on setting up a Dash node, refer to the [DashCore Documentation](https://docs.dash.org/projects/core/en/stable/docs/index.html).

1. Configure the node to emit events with ZeroMQ:

   ```bash
   cd /path/to/your/datadir
   nano dash.conf
   ```

2. Add the following line to your `dash.conf` file:

   ```bash
   zmqpubrawtx=tcp://127.0.0.1:28332
   ```

3. Save the file and restart your node:

   ```bash
   dash-cli stop
   dashd -daemon 
   ```

### Run Locally

1. Clone the repository:

    ```bash
    git clone https://github.com/maxmanukian/dash-websocket
    cd dash-websocket
    ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the environment:

   ```bash
   cp .env.example .env
   nano .env
   ```

4. Set up environment variables in the `.env` file:

   ```plaintext
   ZMQ_URL=
   PORT=
   BIND_ADDRESS=
   ```

5. Save the file and exit.

6. Run the application:

   ```bash 
   npm run start
   ```

### Lint and Tests

Run lint checks:

  ```bash
npm run lint
```

Run all the tests:

```bash
npm run test
``` 

# License

Code released under [the MIT license](LICENSE).
