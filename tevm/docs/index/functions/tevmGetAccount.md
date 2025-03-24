[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmGetAccount

# Function: tevmGetAccount()

> **tevmGetAccount**(`client`, `params`): `Promise`\<[`GetAccountResult`](../../actions/type-aliases/GetAccountResult.md)\<[`TevmGetAccountError`](../../actions/type-aliases/TevmGetAccountError.md)\>\>

Defined in: packages/memory-client/types/tevmGetAccount.d.ts:1

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](../type-aliases/Account.md), `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

### params

[`GetAccountParams`](../../actions/type-aliases/GetAccountParams.md)\<`boolean`\>

## Returns

`Promise`\<[`GetAccountResult`](../../actions/type-aliases/GetAccountResult.md)\<[`TevmGetAccountError`](../../actions/type-aliases/TevmGetAccountError.md)\>\>
