---
title: TevmNode api
description: Using TevmNode from `tevm/node` package
---
# TevmNode

## Using JSON-RPC

TevmNode supports much of the ethereum, debug, anvil, and hardhat JSON-RPC apis. There are two ways to use this api

1. Treeshakable procedures
2. EIP-1193 provider

### Using Treeshakable prodedures and actions

Tree shakable procedures can be imported form the tevm/procedures package. All procedures take a TevmClient as a param and return a handler.

```typescript
import {createTevmNode} from 'tevm'
import {ethCallProcedure, EthCallJsonRpcRequest} from 'tevm/procedures'

const node = createTevmNode()

const call = ethCallProcedure(node)

const request: EthCallJsonRpcRequest = {
  params: [{data: '0x2342...'}],
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_call'
}

const res = await call(request) 
```

Most JSON-RPC procedures have more ergonomic apis called "Actions" as well that can be used as an alternative. Actions have benifit of

- less verbose
- uses normal data structures like bigint rather than encoded hex string
- sometimes more typesafe

```typescript
import {createTevmNode} from 'tevm'
import {ethCallHandler} from 'tevm/actions'

const node = createTevmNode()

const call = ethCallHandler(node)

const res = await call({
  data: '0x234234...'
}) // 0n
```

### Adding EIP-1193 Provider

TevmNode can become an EIP-1193 Provider using [requestEip1193](https://tevm.sh/reference/tevm/decorators/functions/requesteip1193/) decorator from `tevm/decorators` package.

```typescript
import { createTevmNode } from "tevm/node";
import { requestEip1193 } from "tevm/decorators";

const tevm = createTevmNode().extend(requestEip1193());
const blockNumber = await tevm.request({ method: "eth_getBlockNumber" });
```

See [json-rpc api](../json-rpc/) for which methods are supported.

Similarly tevm can also be extended with the actions api.

```typescript
import { createTevmNode } from "tevm/node";
import { ethActions, tevmActions } from "tevm/decorators";

const tevm = createTevmNode().extend(ethActions()).extend(tevmActions());

await tevm.eth.blockNumber()
await tevm.contract({
  abi,
  functionName: 'balanceOf',
  args: ['0x....'],
  address: '0x....',
})
```
