[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmDumpState

# Function: tevmDumpState()

> **tevmDumpState**(`client`): `Promise`\<`DumpStateResult`\<`TevmDumpStateError`\>\>

Defined in: [packages/memory-client/src/tevmDumpState.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmDumpState.js#L24)

Tree-shakeable `tevmDumpState` action. Exports the full TEVM blockchain state as a serializable object.

Output includes account state, contract bytecode, receipts, and block history. Pair with
[tevmLoadState](tevmLoadState.md) to restore. BigInt values must be handled when serializing to JSON.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> | The viem client configured with TEVM transport. |

## Returns

`Promise`\<`DumpStateResult`\<`TevmDumpStateError`\>\>

Serializable snapshot of the blockchain state.

## Example

```typescript
import { tevmDumpState } from 'tevm/actions'
import { createClient } from 'viem'
import { createTevmTransport } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
const state = await tevmDumpState(client)
```

## See

[DumpStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/dumpstateresult/)
