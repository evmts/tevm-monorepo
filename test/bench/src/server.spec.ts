import { createMemoryClient, http } from "tevm";
import { createServer } from "tevm/server";

const PORT = 8545;

const client = createMemoryClient();
const server = createServer(client);

server.listen(PORT, () => {
  console.log("server started making a request");

  http(`http://localhost:${PORT}`)({})
    .request({
      method: "eth_chainId",
    })
    .then(console.log)
    .catch(console.error);
});
