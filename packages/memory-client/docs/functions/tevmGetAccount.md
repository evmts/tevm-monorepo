[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmGetAccount

# Function: tevmGetAccount()

> **tevmGetAccount**(`client`, `params`): `Promise`\<`GetAccountResult`\<`TevmGetAccountError`\>\>

Defined in: [packages/memory-client/src/tevmGetAccount.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmGetAccount.js#L29)

Tree-shakeable `tevmGetAccount` action. Returns balance, nonce, code, and optionally storage.

With `returnStorage: true`, only storage that's already cached locally is returned (in fork mode,
uncached slots won't appear). Skip storage for contracts with large state for performance.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> | The viem client configured with TEVM transport. |
| `params` | `GetAccountParams`\<`boolean`\> | Get-account parameters. |

## Returns

`Promise`\<`GetAccountResult`\<`TevmGetAccountError`\>\>

Account info including address, balance, nonce, code, and optionally storage.

## Example

```typescript
import { tevmGetAccount } from 'tevm/actions'
import { createClient } from 'viem'
import { createTevmTransport } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
const account = await tevmGetAccount(client, {
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  returnStorage: true,
})
```

## See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/)
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/)
