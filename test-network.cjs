const net = require("node:net");

const host = "ep-solitary-violet-amzk9cn2-pooler.c-5.us-east-1.aws.neon.tech";

for (const family of [4, 6]) {
  const socket = net.connect({
    host,
    port: 5432,
    family,
    timeout: 5000,
  });

  socket.on("connect", () => {
    console.log(`IPv${family}: CONNECTED`);
    socket.destroy();
  });

  socket.on("timeout", () => {
    console.log(`IPv${family}: TIMEOUT`);
    socket.destroy();
  });

  socket.on("error", (error) => {
    console.log(`IPv${family}: ${error.code}`);
  });
}
