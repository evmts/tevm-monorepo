**@tevm/server** • [**Docs**](globals.md)

***

<p align="center">
  <a href="https://tevm.sh/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Execute solidity scripts in browser
<p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/e2e.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/e2e.yml)
[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/unit.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/unit.yml)
<a href="https://www.npmjs.com/package/@tevm/server" target="\_parent">
<img alt="" src="https://img.shields.io/npm/dm/@tevm/server.svg" />
</a>
<a href="https://bundlephobia.com/package/@tevm/server@latest" target="\_parent">
<img alt="" src="https://badgen.net/bundlephobia/minzip/@tevm/server" />
</a>

# @tevm/server

Creates a JSON RPC server for serving tevm\_ requests from an ethereumjs evm.

- [`createHttpHandler`](_media/createHttpHandler.js) Creates a generic http handler
- [`createServer`](_media/createServer.js) Creates a simple vanilla node.js server to serve TEVM json-rpc api
- [`createExpressMiddleware`](_media/createExpressMiddleware.js) Creates an express middleware to serve TEVM json-rpc api
- [`createNextApiHandler`](./src/adapters/createNextApiHandler.js.js) Creates a next.js handler for tevm.

## Example

```typescript
import { createMemoryClient } from "tevm";
import { createServer } from "@tevm/server";

const client = createMemoryClient();

const server = createServer(client);

server.listen(8080);
```

Once you are running it as a server you can use any ethereum client to communicate with it with no special modifications including a [viem public client](https://viem.sh/docs/clients/public.html)

```typescript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://localhost:8545"),
});

console.log(await publicClient.getChainId());
```

Tevm also supports a growing list of the [anvil/hardhat test api](https://viem.sh/docs/clients/test#test-client).

For viem users you can also use the custom tevm actions such as `tevmSetAccount` even over http via extending any viem client with [tevmViemExtension](https://tevm.sh/reference/tevm/viem/functions/tevmviemextension/).

```typescript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { tevmViemExtension } from "tevm/viem";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://localhost:8545"),
}).extend(tevmViemExtension());

console.log(await publicClient.setAccount({ address: `0x${"00".repeat(20)}` }));
console.log(await publicClient.getAccount({ address: `0x${"00".repeat(20)}` }));
```

This works because all tevm actions are implemented both in memory and as JSON-RPC handlers. This means whether using tevm in memory with `MemoryProvider` or over http the api is the same.

## Visit [Docs](https://tevm.sh/) for docs, guides, API and more!

## License 📄

<a href="_media/LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
