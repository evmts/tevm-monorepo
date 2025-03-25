[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmDumpState

# Function: tevmDumpState()

> **tevmDumpState**(`client`): `Promise`\<[`DumpStateResult`](../../actions/type-aliases/DumpStateResult.md)\<[`TevmDumpStateError`](../../actions/type-aliases/TevmDumpStateError.md)\>\>

Defined in: packages/memory-client/types/tevmDumpState.d.ts:1

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](../type-aliases/Account.md), `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

## Returns

`Promise`\<[`DumpStateResult`](../../actions/type-aliases/DumpStateResult.md)\<[`TevmDumpStateError`](../../actions/type-aliases/TevmDumpStateError.md)\>\>
