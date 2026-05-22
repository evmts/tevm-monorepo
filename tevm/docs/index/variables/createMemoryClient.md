[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / createMemoryClient

# Variable: createMemoryClient

> `const` **createMemoryClient**: [`CreateMemoryClientFn`](../type-aliases/CreateMemoryClientFn.md)

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
