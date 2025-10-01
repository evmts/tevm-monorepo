[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmLoadState

# Function: tevmLoadState()

> **tevmLoadState**(`client`, `params`): `Promise`\<[`LoadStateResult`](../../actions/type-aliases/LoadStateResult.md)\<[`InternalError`](../../errors/classes/InternalError.md)\>\>

Defined in: packages/memory-client/types/tevmLoadState.d.ts:1

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](../type-aliases/Account.md), `undefined`, `undefined` \| \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \}\>

### params

[`LoadStateParams`](../../actions/type-aliases/LoadStateParams.md)\<`boolean`\>

## Returns

`Promise`\<[`LoadStateResult`](../../actions/type-aliases/LoadStateResult.md)\<[`InternalError`](../../errors/classes/InternalError.md)\>\>
