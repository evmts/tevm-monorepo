[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmSetAccount

# Function: tevmSetAccount()

> **tevmSetAccount**(`client`, `params`): `Promise`\<[`SetAccountResult`](../../actions/type-aliases/SetAccountResult.md)\<[`TevmSetAccountError`](../../actions/type-aliases/TevmSetAccountError.md)\>\>

Defined in: packages/memory-client/types/tevmSetAccount.d.ts:1

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](../type-aliases/Account.md), `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

### params

[`SetAccountParams`](../../actions/type-aliases/SetAccountParams.md)\<`boolean`\>

## Returns

`Promise`\<[`SetAccountResult`](../../actions/type-aliases/SetAccountResult.md)\<[`TevmSetAccountError`](../../actions/type-aliases/TevmSetAccountError.md)\>\>
