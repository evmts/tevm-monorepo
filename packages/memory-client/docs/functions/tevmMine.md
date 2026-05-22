[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmMine

# Function: tevmMine()

> **tevmMine**(`client`, `params?`): `Promise`\<`MineResult`\>

Defined in: [packages/memory-client/src/tevmMine.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmMine.js#L26)

Tree-shakeable `tevmMine` action. Mines pending transactions into new blocks, advancing canonical state.

In manual mining mode (the default), state changes from transactions only take effect once mined.
Auto- and interval-mining modes are configured via `createMemoryClient({ miningConfig })`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> | The viem client configured with TEVM transport. |
| `params?` | `MineParams`\<`boolean`\> | Optional parameters (blockCount, interval). |

## Returns

`Promise`\<`MineResult`\>

Mining result including an array of block hashes.

## Example

```typescript
import { tevmMine } from 'tevm/actions'
import { createClient } from 'viem'
import { createTevmTransport } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
const { blockHashes } = await tevmMine(client, { blockCount: 5, interval: 10 })
```

## See

 - [MineParams](https://tevm.sh/reference/tevm/actions/type-aliases/mineparams/) for options reference.
 - [MineResult](https://tevm.sh/reference/tevm/actions/type-aliases/mineresult/) for return values reference.
