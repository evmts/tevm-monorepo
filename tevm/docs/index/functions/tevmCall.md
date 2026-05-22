[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmCall

# Function: tevmCall()

> **tevmCall**(`client`, `params`): `Promise`\<[`CallResult`](../../actions/type-aliases/CallResult.md)\<[`TevmCallError`](../../actions/type-aliases/TevmCallError.md)\>\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, [`Account`](../type-aliases/Account.md) \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> |
| `params` | [`CallParams`](../../actions/type-aliases/CallParams.md)\<`boolean`\> |

## Returns

`Promise`\<[`CallResult`](../../actions/type-aliases/CallResult.md)\<[`TevmCallError`](../../actions/type-aliases/TevmCallError.md)\>\>
