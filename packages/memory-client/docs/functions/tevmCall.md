[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmCall

# Function: tevmCall()

> **tevmCall**(`client`, `params`): `Promise`\<`CallResult`\<`TevmCallError`\>\>

Defined in: [packages/memory-client/src/tevmCall.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmCall.js#L26)

Tree-shakeable `tevmCall` action. Low-level EVM call with extra control beyond `eth_call`:
impersonation, step tracing, skipBalance, plus `addToMempool` / `addToBlockchain` to turn it
into a transaction. For ABI-encoded contract calls use [tevmContract](tevmContract.md).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> | The viem client configured with TEVM transport. |
| `params` | `CallParams`\<`boolean`\> | Call parameters. |

## Returns

`Promise`\<`CallResult`\<`TevmCallError`\>\>

Call result including return data, gas, and optional traces.

## Example

```typescript
import { createClient } from 'viem'
import { tevmCall } from 'tevm/actions'
import { createTevmTransport } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
const result = await tevmCall(client, { to: '0x123...', data: '0xabc...' })
```

## See

 - [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)
 - [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/)

## Throws

Will throw if the call reverts (error contains revert reason if available).
