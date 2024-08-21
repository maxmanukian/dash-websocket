import Server from "./src/server.js";

new Server().start().catch(e => console.log(e))