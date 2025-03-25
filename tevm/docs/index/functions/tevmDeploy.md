[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmDeploy

# Function: tevmDeploy()

> **tevmDeploy**(`client`, `params`): `Promise`\<[`DeployResult`](../../actions/type-aliases/DeployResult.md)\>

Defined in: packages/memory-client/types/tevmDeploy.d.ts:1

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](../type-aliases/Account.md), `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

### params

`Omit`\<[`BaseCallParams`](../../actions/type-aliases/BaseCallParams.md)\<`boolean`\>, `"to"`\> & `object` & `object` & `object` & [`CallEvents`](../../actions/type-aliases/CallEvents.md)

## Returns

`Promise`\<[`DeployResult`](../../actions/type-aliases/DeployResult.md)\>
