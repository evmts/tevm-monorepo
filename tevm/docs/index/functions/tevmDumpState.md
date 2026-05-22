[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmDumpState

# Function: tevmDumpState()

> **tevmDumpState**(`client`): `Promise`\<[`DumpStateResult`](../../actions/type-aliases/DumpStateResult.md)\<[`TevmDumpStateError`](../../actions/type-aliases/TevmDumpStateError.md)\>\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, [`Account`](../type-aliases/Account.md) \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> |

## Returns

`Promise`\<[`DumpStateResult`](../../actions/type-aliases/DumpStateResult.md)\<[`TevmDumpStateError`](../../actions/type-aliases/TevmDumpStateError.md)\>\>
