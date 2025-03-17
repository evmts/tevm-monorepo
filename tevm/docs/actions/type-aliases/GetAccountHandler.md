[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / GetAccountHandler

# Type Alias: GetAccountHandler()

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](../../index/type-aliases/GetAccountResult.md)\>

Defined in: packages/actions/dist/index.d.ts:2204

Gets the state of a specific Ethereum address.
This handler is for use with a low-level TEVM `TevmNode`, unlike `tevmGetAccount`.

## Parameters

### params

[`GetAccountParams`](../../index/type-aliases/GetAccountParams.md)

## Returns

`Promise`\<[`GetAccountResult`](../../index/type-aliases/GetAccountResult.md)\>

## Example

```typescript
import { createClient } from 'tevm'
import { getAccountHandler } from 'tevm/actions'

const client = createClient()
const getAccount = getAccountHandler(client)

const res = await getAccount({ address: '0x123...' })
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```
