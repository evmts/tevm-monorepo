[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / createMemoryClient

# Variable: createMemoryClient

> `const` **createMemoryClient**: [`CreateMemoryClientFn`](../type-aliases/CreateMemoryClientFn.md)

Defined in: [packages/memory-client/src/createMemoryClient.js:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js#L36)

Creates a [MemoryClient](../type-aliases/MemoryClient.md) - a fully-featured Ethereum development and testing environment.

Combines an in-memory EVM with viem's wallet/test/public actions and TEVM-specific actions
for state manipulation, tracing, mining, and forking.

## Example

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/common";

const client = createMemoryClient({
  fork: { transport: http("https://mainnet.optimism.io")({}) },
  common: optimism,
  miningConfig: { type: 'auto' },
});

await client.tevmReady();
const blockNumber = await client.getBlockNumber();
await client.tevmSetAccount({ address: "0x123...", balance: 10n ** 19n });
```

## See

 - [Client Guide](https://tevm.sh/learn/clients/)
 - [Actions Guide](https://tevm.sh/learn/actions/)
 - [Reference Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/)

## Param

The options to configure the MemoryClient.
