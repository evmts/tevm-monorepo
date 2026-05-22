[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmLoadState

# Function: tevmLoadState()

> **tevmLoadState**(`client`, `params`): `Promise`\<`LoadStateResult`\<`InternalError`\>\>

Defined in: [packages/memory-client/src/tevmLoadState.js:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmLoadState.js#L25)

Tree-shakeable `tevmLoadState` action. Replaces TEVM state with a previously dumped snapshot.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> | The viem client configured with TEVM transport. |
| `params` | `LoadStateParams`\<`boolean`\> | State object previously produced by [tevmDumpState](tevmDumpState.md). |

## Returns

`Promise`\<`LoadStateResult`\<`InternalError`\>\>

Result of the load operation.

## Example

```typescript
import { tevmLoadState } from 'tevm/actions'
import { createClient } from 'viem'
import { createTevmTransport } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
await tevmLoadState(client, savedState)
```

## See

 - [LoadStateParams](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateparams/)
 - [LoadStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateresult/)

## Throws

If the provided state is invalid or incompatible.
