[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / GetAccountHandler

# Type Alias: GetAccountHandler()

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](GetAccountResult.md)\>

Defined in: [packages/actions/src/GetAccount/GetAccountHandlerType.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountHandlerType.ts#L21)

Gets the state of a specific Ethereum address.
This handler is for use with a low-level TEVM `TevmNode`, unlike `tevmGetAccount`.

## Parameters

### params

[`GetAccountParams`](GetAccountParams.md)

## Returns

`Promise`\<[`GetAccountResult`](GetAccountResult.md)\>

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
