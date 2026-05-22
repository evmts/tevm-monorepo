[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmSetAccount

# Function: tevmSetAccount()

> **tevmSetAccount**(`client`, `params`): `Promise`\<`SetAccountResult`\<`TevmSetAccountError`\>\>

Defined in: [packages/memory-client/src/tevmSetAccount.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmSetAccount.js#L30)

Tree-shakeable `tevmSetAccount` action. Directly sets account balance, nonce, bytecode, and/or
storage without a transaction — useful for test fixtures and edge-case setups.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> | The viem client configured with TEVM transport. |
| `params` | `SetAccountParams`\<`boolean`\> | Parameters for setting the account. |

## Returns

`Promise`\<`SetAccountResult`\<`TevmSetAccountError`\>\>

Result of the set-account operation.

## Example

```typescript
import { tevmSetAccount } from 'tevm/actions'
import { createClient, parseEther } from 'viem'
import { createTevmTransport } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
await tevmSetAccount(client, {
  address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  balance: parseEther('100'),
  nonce: 0n,
})
```

## Throws

Will throw if the address or hex inputs (bytecode, storage keys/values) are invalid.

## See

 - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/)
 - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/)
