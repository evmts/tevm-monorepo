[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmDeploy

# Function: tevmDeploy()

> **tevmDeploy**(`client`, `params`): `Promise`\<[`DeployResult`](../type-aliases/DeployResult.md)\>

Defined in: packages/memory-client/types/tevmDeploy.d.ts:1

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](../type-aliases/Account.md), `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

### params

[`DeployParams`](../type-aliases/DeployParams.md)\<`boolean`, [`Abi`](../type-aliases/Abi.md), `true`, readonly `unknown`[]\>

## Returns

`Promise`\<[`DeployResult`](../type-aliases/DeployResult.md)\>
