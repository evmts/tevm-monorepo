[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / MemoryClient

# Type Alias: MemoryClient\<TChain, TAccountOrAddress\>

> **MemoryClient**\<`TChain`, `TAccountOrAddress`\> = `Prettify`\<`Client`\<[`TevmTransport`](TevmTransport.md), `TChain`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, [`TevmRpcSchema`](TevmRpcSchema.md), [`TevmActions`](TevmActions.md) & `PublicActions`\<[`TevmTransport`](TevmTransport.md), `TChain`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & `WalletActions`\<`TChain`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & `TestActions`\>\>

Defined in: [packages/memory-client/src/MemoryClient.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClient.ts#L31)

Represents a TEVM-enhanced viem client with an in-memory Ethereum client as its transport.

Combines TEVM actions with viem public, wallet, and test actions for a complete in-browser
EVM development and testing environment, including forking, mining control, and state persistence.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TChain` *extends* `Chain` \| `undefined` | `Chain` \| `undefined` |
| `TAccountOrAddress` *extends* `Account` \| `Address` \| `undefined` | `Account` \| `Address` \| `undefined` |

## See

 - [createMemoryClient](../variables/createMemoryClient.md) for creating an instance.
 - [Client Guide](https://tevm.sh/learn/clients/)
 - [Actions Guide](https://tevm.sh/learn/actions/)

## Example

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/common";

const client = createMemoryClient({
  fork: { transport: http("https://mainnet.optimism.io")({}) },
  common: optimism,
});
await client.tevmReady();
const bn = await client.getBlockNumber();
```
