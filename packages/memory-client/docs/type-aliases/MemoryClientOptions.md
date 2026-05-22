[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / MemoryClientOptions

# Type Alias: MemoryClientOptions\<TCommon, TAccountOrAddress, TRpcSchema\>

> **MemoryClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\> = `TevmNodeOptions`\<`TCommon`\> & `Pick`\<`ClientConfig`\<`Transport`, `TCommon`, `TAccountOrAddress`, `TRpcSchema`\>, `"type"` \| `"key"` \| `"name"` \| `"account"` \| `"pollingInterval"` \| `"cacheTime"`\> & `object`

Defined in: [packages/memory-client/src/MemoryClientOptions.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClientOptions.ts#L32)

Configuration options for [createMemoryClient](../variables/createMemoryClient.md).

Extends TevmNodeOptions (fork, miningConfig, persister, common, eips, loggingLevel, etc.)
with viem client options (type, key, name, account, pollingInterval, cacheTime).

## Type Declaration

### ~~mining?~~

> `readonly` `optional` **mining?**: `object`

#### Type Declaration

#### Deprecated

Use miningConfig instead. Interval values are interpreted as milliseconds for compatibility.

#### mining.auto?

> `readonly` `optional` **auto?**: `boolean`

#### mining.interval?

> `readonly` `optional` **interval?**: `number`

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TCommon` *extends* `Common` & `Chain` | `Common` & `Chain` | The common chain configuration, extending both `Common` and `Chain`. |
| `TAccountOrAddress` *extends* `Account` \| `Address` \| `undefined` | `undefined` | The account or address type for the client. |
| `TRpcSchema` *extends* `RpcSchema` \| `undefined` | [`TevmRpcSchema`](TevmRpcSchema.md) | The RPC schema type, defaults to `TevmRpcSchema`. |

## Example

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/common";

const client = createMemoryClient({
  fork: { transport: http("https://mainnet.optimism.io")({}) },
  common: optimism,
  miningConfig: { type: 'auto' },
});
```

## See

 - [MemoryClient](MemoryClient.md)
 - TevmNodeOptions
